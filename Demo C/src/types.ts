export interface Initiative {
    id: string;
    name: string;
    cost: number;
    impact_multiple: number; // e.g. 0.5 means +0.5x MOIC
    category: 'Operational' | 'Engineering' | 'Commercial';
}

export interface SimulationState {
    activeInitiatives: string[]; // IDs of active initiatives
    exitYear: number;
    marketMultiple: number;
}
