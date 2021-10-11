/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { CommunicationModel } from './StructureMetada';

export interface INodeWay {
    unique: string;
    visited: string;
    children: string[];
    way: string[];
}

export default class Diameter {
    // Modelo analizado
    private _model: CommunicationModel;

    private _nodes: INodeWay[];

    public constructor(model: CommunicationModel) {
        this._model = model;
        this._nodes = this._idNodes().map((id) => ({
            unique: id,
            visited: '',
            children: this._nodeChildren(id),
            way: [],
        }));
    }

    // Getters and Setters
    public set model(value: CommunicationModel) {
        this._model = value;
    }

    public get model(): CommunicationModel {
        return this._model;
    }

    public get nodes(): INodeWay[] {
        return this._nodes;
    }

    public set nodes(value: INodeWay[]) {
        this._nodes = value;
    }

    // Todos los ids de los nodos no actores
    private _idNodes() {
        const ids = [
            ...this.model.communicativeEvents.map((element) => element.unique),
            ...this.model.specialisedCommunicativeEvents
                .map((element) => [
                    element.unique,
                    ...element.internalCommunicativeEvent.map((internalEvent) => internalEvent.unique),
                ])
                .flat(),
        ];
        ids.forEach((id, index) => {
            if (Array.isArray(id)) {
                ids.splice(index, 1);
                id.forEach((i) => {
                    ids.push(i);
                });
            }
        });
        return ids as string[];
    }

    // Todos los nodos hijos de un nodo
    private _nodeChildren(nodeId: string): string[] {
        return this.model.precedenceRelations
            .filter((relation) => relation.source === nodeId)
            .map((relation) => relation.target);
    }

    // Camino de un nodo
    private _nodeWay(node: INodeWay, initial: INodeWay): string[] {
        const childrenInfo = node.children.map((ch) => this.nodes.find((n) => n.unique === ch) as INodeWay);

        // Nodo visitado
        if (node.visited === initial.unique) {
            return node.way;
        }
        // Se setea el camino que tuvo en un anterior trayecto
        node.way = [];
        node.visited = initial.unique;

        // Nodos no visitados

        // Nodo rodeado de nodos visitados
        if (childrenInfo.filter((ch) => ch.visited !== initial.unique).length === 0) {
            return [node.unique];

            // Nodo con mas de 1 camino viable
        }
        const childWays = node.children
            .filter((ch) => ch !== initial.unique)
            .map((child) => {
                const childData = this.nodes.find((n) => n.unique === child) as INodeWay;
                return this._nodeWay(childData, initial);
            });

        node.way = childWays.reduce<string[]>(
            (bestWay, childWay) => (childWay.length >= bestWay.length ? childWay : bestWay),
            node.way
        );
        return [node.unique, ...node.way];
    }

    // Inicio de busqueda
    public longestWay() {
        const ways: string[][] = [];
        // Se recorren todos los nodos del sistema
        this.nodes.forEach((node) => {
            // Se recorren todos los hjos del nodo
            node.children.forEach((child) => {
                // Info del nodo hijo
                const childData = this.nodes.find((n) => n.unique === child) as INodeWay;

                // Se setea el camino anterior
                node.way = [];

                // Por cada hijo genera el mejor camino
                ways.push(this._nodeWay(childData, node));
            });

            // Se comparan los caminos de los hijos, con el mejor camino existente hasta el momento
            node.way = ways.reduce<string[]>(
                (bestWay, childWay) => (childWay.length >= bestWay.length ? childWay : bestWay),
                node.way
            );
        });

        // Ya teniendo todos los caminos, simplemente se hace la selección del trayecto mas largo
        return this.nodes.reduce<INodeWay>(
            (best, node) => (node.way.length >= best.way.length ? node : best),
            this.nodes[0]
        ).way.length;
    }
}
