import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const { version } = require('../package.json');

export enum THEMES {
  LIGHT = 'light',
  DARK = 'dark',
}

interface Store {
  theme: THEMES
  matrix: number[];
}

interface State {
  store: Store;
  set: (key: keyof Store, data: Partial<Store[keyof Store]>) => void;
  get: (key: keyof Store) => Store[keyof Store];
}

const name = version;
const storage = createJSONStorage<State>(() => localStorage);
const merge = (...args: [unknown, State]) => {
  const state = args[0] as State;
  const store = state.store;
  return { ...args[1], store };
}

const state = persist<State, [], [], State>((set, get) => ({
  store: {
    theme: THEMES.DARK,
    matrix: [],
  },
  get: (key) => {
    const state = get();
    const data = state.store[key];
    if (!data) {
      throw new Error('...');
    }
    return data;
  },
  set: (key, data) => set((state) => {
    const store = { ...state.store, [key]: data };
    return { store };
  }),
}), { name, merge, storage });

export const useStore = create<State>()(state);

