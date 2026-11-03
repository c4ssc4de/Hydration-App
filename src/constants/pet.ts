export const DAILY_GOAL_ML = 2000;
export const GROWTH_PER_ML = 1 / 50;
export const COINS_PER_ML = 1 / 50;
export const MIN_COIN_STAGE = 2;

export type Stage = {
    level: number;
    name: string;
    emoji: string; //placeholder
    minGrowth: number;
};

export const STAGES: Stage[] = [
    {level: 1, name: 'Egg', emoji: '🥚', minGrowth: 0},
    {level: 2, name: 'Hatchling', emoji: '🐣', minGrowth: 50},
    {level: 3, name: 'Chick', emoji: '🐥', minGrowth: 200},
    {level: 4, name: 'Teen', emoji: '🐤', minGrowth: 500},
    {level: 5, name: 'Grown', emoji: '🦆', minGrowth: 1000},
];
//At about 2000ml a day (40 points), the pet hatches on day 2, becomes a chick around day 5, a teen around day 13 and grown around day 25.

export function getStage(growth: number): Stage {
    let current = STAGES[0];
    for (const s of STAGES) {
        if (growth >= s.minGrowth) current = s;
    }
    return current;
}

export function getNextStage(growth: number): Stage | null {
    return STAGES.find((s) => s.minGrowth > growth) ?? null;
}
