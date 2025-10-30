import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface Item {
    id: number;
    name: string;
    completed: boolean;
}

type ItemState = Item[];

const initialState: ItemState = [
    // some example items
    { id: 1, name: "Item One", completed: false },
    { id: 2, name: "Item Two", completed: true },
];

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addNew(state, action: PayloadAction<Item>) {
            state.push(action.payload);
        },
        removeItem(state, action: PayloadAction<number>) {
            return state.filter((item) => item.id != action.payload);
        },
        toggleCompleted(state, action: PayloadAction<number>) {
            const item = state.find((item) => item.id === action.payload);
            if (item) {
                item.completed = !item.completed;
            }
        },
    },
});

export const { addNew, removeItem, toggleCompleted } = todoSlice.actions;
export default todoSlice.reducer;
export const selectItems = (state: RootState) => state;
