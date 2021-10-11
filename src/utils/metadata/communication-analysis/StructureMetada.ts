// ########## Sub Models ##########

// Common Model
export interface CommonModelCis {
    unique: string;
    identifier: string;
    name: string;
    type: string;
}

// Point of systeme reference
export interface Point {
    x: string;
    y: string;
}

// Actor Model
export type ActorModel = CommonModelCis & Point;

// Support Actor in Communicative Event
export type SupportActorModel = CommonModelCis;

// Communicative Event
export interface CommunicativeEventModel extends CommonModelCis, Point {
    goals: string;
    description: string;
    channel: string;
    temporalRestrictions: string;
    frequency: string;
    contextConstraints: string;
    structuralConstraints: string;
    treatment: string;
    linkedCommunication: string;
    linkedReaction: string;
    supportActor: SupportActorModel[];
}

// Internal Communicative Event in Specialised Event
export type InternalCommunicativeEventModel = Omit<CommunicativeEventModel, 'supportActor' | 'x' | 'y'>;

// Specialised Communicative Event
export interface SpecialisedCommunicativeEvent extends CommunicativeEventModel {
    internalCommunicativeEvent: InternalCommunicativeEventModel[];
}

// ########## Interactions ##########

// Message Structure
export interface MessageStructureModel {
    name: string;
    type: string;
    // ? Qué tipo es children (No se utiliza)
    children: any[];
}

// Precedence Relations
export interface PrecedenceRelationsModel {
    unique: string;
    type: string;
    source: string;
    target: string;
    points?: Point[];
}

// Communicative Interactions
export interface CommunicativeInteractionsModel extends SupportActorModel {
    messageStructure: MessageStructureModel;
    source: string;
    target: string;
    points: Point[];
}

// ########## Model Complete ##########
export interface CommunicationModel {
    actors: ActorModel[];
    communicativeEvents: CommunicativeEventModel[];
    specialisedCommunicativeEvents: SpecialisedCommunicativeEvent[];
    communicativeInteractions: CommunicativeInteractionsModel[];
    precedenceRelations: PrecedenceRelationsModel[];
}
