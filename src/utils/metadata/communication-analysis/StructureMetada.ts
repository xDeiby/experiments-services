export interface Header {
    userName: string;
    identifier: string;
    type: string;
}
export interface Point {
    x: number;
    y: number;
}
export interface PrecedenceRelation {
    unique: string;
    type: string;
    source: string;
    target: string;
    points?: Point[];
}
export interface SupportActor {
    unique: string;
    identifier: string;
    name: string;
    type: string;
}
export interface CommunicativeEvent {
    unique: string;
    identifier: string;
    name: string;
    type: string;
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
    x: number;
    y: number;
    supportActor: SupportActor[];
}

export type InternalCommunicationEvent = Omit<CommunicativeEvent, 'x' | 'y' | 'supportActor'>;

export interface SpecialisedCommunicativeEvents extends CommunicativeEvent {
    internalCommunicativeEvent: InternalCommunicationEvent[];
}

export interface Actor {
    unique: string;
    identifier: string;
    name: string;
    type: string;
    x: number;
    y: number;
}
export interface MessageStructure {
    name: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any[];
}
export interface CommunicativeInteraction {
    unique: string;
    identifier: string;
    name: string;
    type: string;
    messageStructure: MessageStructure;
    source: string;
    target: string;
    points?: Point[];
}
export interface CommunicationModel {
    header: Header[];
    actors: Actor[];
    starts: Actor[];
    ends: Actor[];
    communicativeEvents: CommunicativeEvent[];
    specialisedCommunicativeEvents: SpecialisedCommunicativeEvents[];
    communicativeInteractions: CommunicativeInteraction[];
    precedenceRelations: PrecedenceRelation[];
    // eslint-disable-next-line camelcase
    additional_attributes?: any;
}
