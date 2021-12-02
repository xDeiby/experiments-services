/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { CommunicationModel, PrecedenceRelation } from './StructureMetada';
import Diameter from './Diameter';

export enum TypeRel {
    INPUT,
    OUTPUT,
}

export enum TypeMeasure {
    WIDTH,
    HEIGHT,
}

export default class CommunicationoModelMetadata extends Diameter {
    private _communicationModel: CommunicationModel;

    constructor(communicationModel: CommunicationModel) {
        super(communicationModel);
        this._communicationModel = communicationModel;
    }

    // Verifica que una relacion no incluya los nodos start y end
    private _excludeNodes(relation: PrecedenceRelation): boolean {
        if (this._communicationModel.starts && this._communicationModel.ends) {
            const nodes = [
                ...this._communicationModel.starts.map((s) => s.unique),
                ...this._communicationModel.ends.map((e) => e.unique),
            ];
            return !nodes.includes(relation.source) && !nodes.includes(relation.target);
        }
        return true;
    }

    // Determina de que tipo es una relación: Entrada o Salida
    private _findTypeRel(source: string): TypeRel {
        const isActor = (id: string) => this._communicationModel.actors.find((actor) => actor.unique === id);

        if (isActor(source)) {
            return TypeRel.INPUT;
        }
        return TypeRel.OUTPUT;
    }

    // Obtención de todas las relaciones del modelo
    private _allRelations(): PrecedenceRelation[] {
        return [
            ...this._communicationModel.communicativeInteractions,
            this._communicationModel.precedenceRelations,
        ] as unknown as PrecedenceRelation[];
    }

    // Obtención de todos los nodos en el modelo (Exceptuando start end)
    private _allNodesIds(): string[] {
        return [
            ...this._communicationModel.actors.map((act) => act.unique),
            ...this._communicationModel.communicativeEvents.map((ce) => ce.unique),
            ...this._communicationModel.specialisedCommunicativeEvents.map((sc) => sc.unique),
            ...this._communicationModel.specialisedCommunicativeEvents
                .map((sc) => sc.internalCommunicativeEvent.map((ic) => ic.unique))
                .flat(),
        ];
    }

    // ############################################### Cálculo de los Metadatos ###############################################

    // Número de relaciones del modelo
    public numRels(): number {
        return (
            this._communicationModel.communicativeInteractions.length +
            this._communicationModel.precedenceRelations.filter((rel) => this._excludeNodes(rel)).length
        );
    }

    // Número de relaciones de un tipo (Excluyendo las relaciones de un actor)
    public numRelsType(type: TypeRel): number {
        return this._communicationModel.communicativeInteractions.reduce<number>(
            (numRels, rel) => numRels + (this._findTypeRel(rel.source) === type ? 1 : 0),
            0
        );
    }

    // Número de nodos en el modelo
    public numNodes(): number {
        return (
            this._communicationModel.actors.length +
            this._communicationModel.communicativeEvents.length +
            this._communicationModel.specialisedCommunicativeEvents.length +
            this._communicationModel.specialisedCommunicativeEvents.map((sp) => sp.internalCommunicativeEvent).length
        );
    }

    // Número de actores en el modelo
    public numActors(): number {
        return this._communicationModel.actors.length;
    }

    // Número de eventos simples
    public numSimpleEvents(): number {
        return this._communicationModel.communicativeEvents.length;
    }

    // Número de eventos complejos
    public numComplexEvents(): number {
        return this._communicationModel.specialisedCommunicativeEvents.length;
    }

    // Diámertro del modelo
    public calculateDiameter(): number {
        return this.longestWay();
    }

    // Cálculo de la Densidad
    public calculateDensity(): number {
        const densityEquation = (arcs: number, nodes: number) => arcs / (nodes * (nodes - 1));

        return densityEquation(this.numRels(), this.numNodes());
    }

    // Cálculo del coeficiente de conectividad
    public calculateConectivityCoefiecients(): number {
        const coefEquation = (arcs: number, nodes: number) => arcs / nodes;

        return coefEquation(this.numRels(), this.numNodes());
    }

    // Cálculo del promedio de relacions de los nodos
    public calculateAvgRelsNodes(typeRel?: TypeRel): number {
        const averageRels = (rels: number, numNodes: number) => rels / numNodes;

        // Relaciones de entrada o salida
        if (typeRel) {
            return averageRels(this.numRelsType(typeRel), this.numNodes());
        }

        // Todas las relaciones
        return averageRels(this.numRels(), this.numNodes());
    }

    // Número máximo de relaciones
    public calculateMaxRels(type?: TypeRel): number {
        const allNodes = this._allNodesIds();
        const allRelations = this._allRelations().flat();

        const rels = allNodes.map((node) => ({ id: node, count: 0 }));

        rels.forEach((rel) => {
            if (type === undefined) {
                rel.count = allRelations.filter((r) => r.target === rel.id || r.source === rel.id).length;
            } else if (type === TypeRel.INPUT) {
                rel.count = allRelations.filter((r) => r.source === rel.id).length;
            } else if (type === TypeRel.OUTPUT) {
                rel.count = allRelations.filter((r) => r.target === rel.id).length;
            }
        });

        return rels.reduce<number>((best, rel) => (rel.count >= best ? rel.count : best), 0);
    }

    // Cálcula medias del modelo (Ancho o Altura)
    public calculateMeasure(measure: TypeMeasure): number {
        const field = measure === TypeMeasure.HEIGHT ? 'y' : 'x';

        const allNodes = [
            ...this._communicationModel.actors,
            ...this._communicationModel.communicativeEvents,
            ...this._communicationModel.specialisedCommunicativeEvents,
        ].flat();

        const line = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };

        allNodes.forEach((node) => {
            const nodeMeasure = node[field];
            if (nodeMeasure <= line.min) {
                line.min = nodeMeasure;
            }
            if (nodeMeasure >= line.max) {
                line.max = nodeMeasure;
            }
        });

        return Math.abs(line.max - line.min);
    }

    // Cálcula el area del modelo
    public calculateArea(): number {
        const areaEquation = (width: number, height: number) => width * height;

        return areaEquation(this.calculateMeasure(TypeMeasure.WIDTH), this.calculateMeasure(TypeMeasure.HEIGHT));
    }

    // Cálculo del promedio de longitud de las etiquetas del modelo
    public calculateAvgLenLabel(): number {
        const sumLabelsLength =
            this._communicationModel.actors.reduce<number>((sum, actor) => sum + actor.name.length, 0) +
            this._communicationModel.communicativeEvents.reduce<number>((sum, event) => sum + event.name.length, 0) +
            this._communicationModel.specialisedCommunicativeEvents.reduce<number>(
                (sum, event) =>
                    sum +
                    event.name.length +
                    event.internalCommunicativeEvent.reduce<number>((sum2, actor) => sum2 + actor.name.length, 0),
                0
            );

        return sumLabelsLength / this.numNodes();
    }

    // Cálculo de máximo largo de una etiqueta en el modleo
    public calculateMaxLengthLabel(): number {
        const allNodes = [
            ...this._communicationModel.actors,
            ...this._communicationModel.communicativeEvents,
            ...this._communicationModel.specialisedCommunicativeEvents,
            ...this._communicationModel.specialisedCommunicativeEvents
                .map((event) => event.internalCommunicativeEvent)
                .flat(),
        ].flat();

        return allNodes.reduce<number>(
            (bestLength, node) => (node.name.length > bestLength ? node.name.length : bestLength),
            0
        );
    }

    // Génera un objeto con todos los metadatos del modelo de análisis comunicacional
    public getAllMetadata(additionaField?: string): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let communicationMetadata = {} as any;

        communicationMetadata.NumRelsModel = this.numRels();
        communicationMetadata.NumInputRels = this.numRelsType(TypeRel.INPUT);
        communicationMetadata.NumOutputRels = this.numRelsType(TypeRel.OUTPUT);
        communicationMetadata.NumNodes = this.numNodes();
        communicationMetadata.NumEvents = this.numComplexEvents() + this.numSimpleEvents();
        communicationMetadata.NumActors = this.numActors();
        communicationMetadata.NumComplexEvents = this.numComplexEvents();
        communicationMetadata.NumSimpleNodes = this.numSimpleEvents();
        communicationMetadata.Diameter = this.calculateDiameter();
        communicationMetadata.Density = this.calculateDensity();
        communicationMetadata.ConectivityCoeficient = this.calculateConectivityCoefiecients();
        communicationMetadata.AverageRels = this.calculateAvgRelsNodes();
        communicationMetadata.AverageInputRels = this.calculateAvgRelsNodes(TypeRel.INPUT);
        communicationMetadata.AverageOutputRels = this.calculateAvgRelsNodes(TypeRel.OUTPUT);
        communicationMetadata.MaxRels = this.calculateMaxRels();
        communicationMetadata.MaxInputRels = this.calculateMaxRels(TypeRel.INPUT);
        communicationMetadata.MaxOutputRels = this.calculateMaxRels(TypeRel.OUTPUT);
        communicationMetadata.Area = this.calculateArea();
        communicationMetadata.Width = this.calculateMeasure(TypeMeasure.WIDTH);
        communicationMetadata.Height = this.calculateMeasure(TypeMeasure.HEIGHT);
        communicationMetadata.AverageLabelLength = this.calculateAvgLenLabel();
        communicationMetadata.MaxLabelLength = this.calculateMaxLengthLabel();

        if (this._communicationModel.additional_attributes) {
            communicationMetadata = { ...communicationMetadata, ...this._communicationModel.additional_attributes };
        }

        if (additionaField) {
            for (const key in communicationMetadata) {
                const newKey = key + additionaField;
                communicationMetadata[newKey] = communicationMetadata[key];
                delete communicationMetadata[key];
            }
        }

        return communicationMetadata;
    }
}
