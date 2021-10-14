/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { CommunicationModel } from './StructureMetada';

export interface INodeWay {
    unique: string;
    visited: boolean;
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
            visited: false,
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
        const childrens = this.model.precedenceRelations
            .filter(
                (relation) =>
                    relation.source === nodeId &&
                    ![...(this.model.ends ? this.model.ends : [])].map((end) => end.unique).includes(relation.target)
            )
            .map((relation) => relation.target);
        return childrens;
    }

    // Camino de un nodothis.model.ends
    private _nodeWay(node: INodeWay): string[] {
        const childrenInfo = node.children.map((ch) => this.nodes.find((n) => n.unique === ch) as INodeWay);
        node.visited = true;
        node.way = [];

        // Nodo rodeado de nodos visitados
        if (childrenInfo.filter((ch) => ch.visited === false).length === 0) {
            node.visited = false;
            return [node.unique];
        }
        // Nodo con mas 1 o mas caminos viables
        childrenInfo
            .filter((ch) => ch.visited === false)
            .forEach((child) => {
                child.way = this._nodeWay(child);
                child.visited = false;
            });

        node.visited = false;

        // Hijo con el mejor camino
        node.way = childrenInfo.reduce<string[]>(
            (bestWay, child) => (child.way.length >= bestWay.length ? child.way : bestWay),
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
            ways.push(this._nodeWay(node));
        });

        console.log(ways);

        // Ya teniendo todos los caminos, simplemente se hace la selección del trayecto mas largo (Si mas de 1 camino, es el mas largo, se escoge el ultimo)
        return ways.reduce<string[]>((best, way) => (way.length >= best.length ? way : best), ways[0]).length;
    }
}
