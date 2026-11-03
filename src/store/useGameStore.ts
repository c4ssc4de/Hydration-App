import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
    COINS_PER_ML,
    GROWTH_PER_ML,
    MIN_COIN_STAGE,
    getStage,
} from '@/constants/pet';

const todayKey = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0')
    return '${d.getFullYear()}-${m}-&{day}';
};

type AddWaterResult = { leveledUp: boolean; coinsEarned: number};

type GameState = {
    intakeToday: number;
    lastDate: string;
    growthPoints: number;
    coins: number;
    inventory: string[]; //item id

    addWater: (ml: number) => AddWaterResult;
    checkNewDay: () => void;
};

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            intakeToday: 0,
            lastDate: todayKey(),
            growthPoints: 0,
            coins: 0,
            inventory: [],

            checkNewDay: () => {
                if (get().lastDate !== todayKey()) {
                    set({ intakeToday: 0, lastDate: todayKey() });
                }
            },

            addWater: (ml) => {
                get().checkNewDay();
                const { intakeToday, growthPoints, coins } = get();

                const oldStage = getStage(growthPoints).level;
                const newGrowth = growthPoints + Math.round(ml * GROWTH_PER_ML);
                const newStage = getStage(newGrowth).level;

                const coinsEarned =
                    oldStage >= MIN_COIN_STAGE ? Math.floor(ml * COINS_PER_ML) : 0;

                set ({
                    intakeToday: intakeToday + ml,
                    growthPoints: newGrowth,
                    coins: coins + coinsEarned,
                });

                return { leveledUp: newStage > oldStage, coinsEarned };
            },
        }),
        {
            name: 'hydration-pet-save',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);