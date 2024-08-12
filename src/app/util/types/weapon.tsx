export type Weapon = {
    id: string;
    name: string;
    requirements: number[];
    category: string;
    unique: boolean;
    infusions: {
        id: string;
        damage: number[];
        scaling: number[];
        aux: { id: string; effect: [number, number] };
        masks: number[][];
        corrections: string[];
        buffable: boolean;
    }[];
};
