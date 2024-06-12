import {create} from "zustand"
import {createJSONStorage, persist} from "zustand/middleware";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type BadgeStore = {
    id: string;
    name: string;
    email: string;
    checkedInAt?: string;
    image?: string;
}

type StateProps = {
    data: BadgeStore | null;
    save: (data: BadgeStore) => void;
    remove: () => void;
}

export const useBadgeStore = create(
    persist<StateProps>((set) => ({
    data: null,
    save: (data: BadgeStore) => set(() => ({data}))
}), {
        name: "passin-mobile:badge",
        storage: createJSONStorage(() => AsyncStorage)
    }))