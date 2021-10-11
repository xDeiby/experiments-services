/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import Diameter from './Diameter';
import { CommunicationModel, PrecedenceRelationsModel } from './StructureMetada';

// Tipo de Relación
type TypeRel = 'INPUT' | 'OUTPUT';

export default class ModelMetadata {
    // All Models
    private _models: CommunicationModel[];

    // Constructor
    public constructor(models: CommunicationModel[]) {
        this._models = models;
    }

    // Getters And Setters
    get models(): CommunicationModel[] {
        return this._models;
    }

    set models(value: CommunicationModel[]) {
        this._models = value;
    }

    // Determina que tipo de Relación es: Entrada, Salida o Normal
    private _findTypeRel(source: string, quizId: number): TypeRel {
        const isActor = (id: string) => this.models[quizId].actors.find((actor) => actor.unique === id);

        if (isActor(source)) {
            return 'INPUT';
        }
        return 'OUTPUT';
    }

    // Todas las relaciones de un modelo
    private _getAllRelationsModel(model: CommunicationModel) {
        return [...model.communicativeInteractions, model.precedenceRelations] as unknown as PrecedenceRelationsModel[];
    }

    // All los nodos de un modelo
    private _getAllNodesIds(model: CommunicationModel) {
        return [
            ...model.actors,
            ...model.communicativeEvents.map((ce) => ce.unique),
            ...model.specialisedCommunicativeEvents.map((sc) => sc.unique),
            ...model.specialisedCommunicativeEvents
                .map((sc) => sc.internalCommunicativeEvent.map((ic) => ic.unique))
                .flat(),
        ];
    }

    // Número de nodos de un modelo
    private _numNodesModel(model: CommunicationModel): number {
        return (
            model.actors.length +
            model.communicativeEvents.length +
            model.specialisedCommunicativeEvents.length +
            model.specialisedCommunicativeEvents.map((sp) => sp.internalCommunicativeEvent).length
        );
    }

    // Nodo con mas relaciones de un modelo
    private bestNode(model: CommunicationModel, type: 'all' | 'input' | 'output') {
        const allNodes = this._getAllNodesIds(model);
        const allRelations = this._getAllRelationsModel(model).flat();

        const rels = allNodes.map((node) => ({ id: node, count: 0 }));

        rels.forEach((rel) => {
            if (type === 'input') {
                rel.count = allRelations.filter((r) => r.source === rel.id).length;
            } else if (type === 'output') {
                rel.count = allRelations.filter((r) => r.target === rel.id).length;
            } else {
                rel.count = allRelations.filter((r) => r.target === rel.id || r.source === rel.id).length;
            }
        });

        return rels.reduce<number>((best, rel) => (rel.count >= best ? rel.count : best), 0);
    }

    // Número de arcos de un modelo
    private _numArcModel(model: CommunicationModel): number {
        return model.communicativeInteractions.length + model.precedenceRelations.length;
    }

    // Número de relaciones de un nodo
    private _relsOfNode(id: string, quizId: number, type: 'all' | 'input' | 'output' = 'all'): number {
        const allRelations = this._getAllRelationsModel(this._models[quizId]);

        switch (type) {
            case 'all':
                return allRelations.reduce<number>(
                    (numRels, rel) => (rel.target === id || rel.source === id ? numRels + 1 : numRels),
                    0
                );

            case 'input':
                return allRelations.reduce<number>((numRels, rel) => (rel.target === id ? numRels + 1 : numRels), 0);

            case 'output':
                return allRelations.reduce<number>((numRels, rel) => (rel.source === id ? numRels + 1 : numRels), 0);
        }
    }

    // TODO: Preguntar que sucede si el nodo es 1
    // Ecuación de densidad
    private _densityEquation(arcs: number, nodes: number): number {
        return arcs / (nodes * (nodes - 1));
    }

    // Ancho del modelo
    private _weightModel(model: CommunicationModel) {
        const allNodes = [
            ...model.actors,
            ...model.communicativeEvents,
            ...model.specialisedCommunicativeEvents,
        ].flat();

        const line = { x0: 1000, x1: -1000 };

        allNodes.forEach((node) => {
            const x = parseInt(node.x);
            if (x <= line.x0) {
                line.x0 = x;
            } else if (x >= line.x1) {
                line.x1 = x;
            }
        });

        return line.x1 - line.x0;
    }

    // Altura del modelo
    private _heightModel(model: CommunicationModel) {
        const allNodes = [
            ...model.actors,
            ...model.communicativeEvents,
            ...model.specialisedCommunicativeEvents,
        ].flat();

        const line = { y0: 1000, y1: -1000 };

        allNodes.forEach((node) => {
            const y = parseInt(node.y);
            if (y <= line.y0) {
                line.y0 = y;
            } else if (y >= line.y1) {
                line.y1 = y;
            }
        });

        return line.y1 - line.y0;
    }

    // Coeficiente de conectividad
    private _connectivityCoef(arcs: number, nodes: number): number {
        return arcs / nodes;
    }

    // Número de relaciones en total.
    public countRels() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._numArcModel(model),
            header: `NumRelsModel${index + 1}`,
        }));
    }

    // Número de relaciones entre eventos en total.
    public countEventRels() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: model.precedenceRelations.length,
            header: `Numeventrels${index + 1}`,
        }));
    }

    // Número de relaciones de entrada o salida (No soportado por el modelo, no se distingen en el JSON)
    public countTypeRels(type: TypeRel) {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: model.communicativeInteractions.reduce<number>(
                (numInputs, relation) =>
                    this._findTypeRel(relation.source, index) === type ? numInputs + 1 : numInputs,
                0
            ),
            header: `Num${type}rels${index}`,
        }));
    }

    // Número de nodos simples y complejos
    public countNodes() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._numNodesModel(model),
            header: `NumEvents${index + 1}`,
        }));
    }

    // Número de actores en el modelo
    public countActors() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: model.actors.length,
            header: `NumActors${index + 1}`,
        }));
    }

    // Número de nodos simples
    public countSimpleNodes() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: model.communicativeEvents.length,
            header: `NumSimpleNodes${index + 1}`,
        }));
    }

    // Número de nodos simples
    public countComplexNodes() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: model.specialisedCommunicativeEvents.length,
            header: `NumComplexEvents${index + 1}`,
        }));
    }

    // Camino mas largo
    public diameter() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: new Diameter(model).longestWay(),
            header: `diameter${index + 1}`,
        }));
    }

    // Densidades
    public densitys() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._densityEquation(this._numArcModel(model), this._numNodesModel(model)),
            header: `Density${index + 1}`,
        }));
    }

    // Coeficientes de conectividades
    public coeficients() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._connectivityCoef(this._numArcModel(model), this._numNodesModel(model)),
            header: `ConectivityCoeficient${index + 1}`,
        }));
    }

    // Promedio de relaciones de los nodos
    public relAverageNodes() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value:
                this._getAllRelationsModel(model).reduce<number>(
                    (summation, rel) => summation + this._relsOfNode(rel.unique, index),
                    0
                ) / this._numNodesModel(model),
            header: `AverageRels${index + 1}`,
        }));
    }

    // ! Es lo mismo que todas
    // Promedio de relaciones entrada de los nodos
    public relInputAverage() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value:
                this._getAllRelationsModel(model).reduce<number>(
                    (summation, rel) => summation + this._relsOfNode(rel.unique, index, 'input'),
                    0
                ) / this._numNodesModel(model),
            header: `AverageInputRels${index + 1}`,
        }));
    }

    // ! Es lo mismo que todas
    // Promedio de relaciones salida de los nodos
    public relOutputAverage() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value:
                this._getAllRelationsModel(model).reduce<number>(
                    (summation, rel) => summation + this._relsOfNode(rel.unique, index, 'input'),
                    0
                ) / this._numNodesModel(model),
            header: `AverageOutputRels${index + 1}`,
        }));
    }

    // Número maximo de relaciones
    public maxRels() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this.bestNode(model, 'all'),
            header: `MaxRels${index + 1}`,
        }));
    }

    // Número maximo de relaciones de entrada
    public maxRelsInput() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this.bestNode(model, 'input'),
            header: `MaxInputRels${index + 1}`,
        }));
    }

    // Número maximo de relaciones de salida
    public maxRelsOutput() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this.bestNode(model, 'output'),
            header: `MaxOutputRels${index + 1}`,
        }));
    }

    // Ancho de los modelos
    public weights() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._weightModel(model),
            header: `Weight${index + 1}`,
        }));
    }

    // Altura de los modelos
    public heights() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._heightModel(model),
            header: `Height${index + 1}`,
        }));
    }

    public area() {
        return this.models.map((model, index) => ({
            idQuiz: index,
            value: this._heightModel(model) * this._weightModel(model),
            header: `Area${index + 1}`,
        }));
    }
}
