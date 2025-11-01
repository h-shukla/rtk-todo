import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type Priority = "low" | "medium" | "high";

export interface Todo {
    id: string;
    title: string;
    notes?: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
    priority: Priority;
    project?: string;
    tags?: string[];
}

interface TodoState {
    items: Todo[];
}

const uid = () => Math.random().toString(36).slice(2, 9);

const sampleTodos = (): Todo[] => [
    {
        id: uid(),
        title: "Design app layout & components",
        notes: "Finalize color tokens and component spacing",
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "high",
        project: "Core",
        tags: ["design", "ui"],
    },
    {
        id: uid(),
        title: "Set up CI for tests",
        notes: "Add GitHub Actions workflow for lint/test",
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "medium",
        project: "DevOps",
        tags: ["ci"],
    },
    {
        id: uid(),
        title: "Buy groceries",
        notes: "Milk, eggs, paneer",
        completed: true,
        createdAt: new Date().toISOString(),
        priority: "low",
        project: "Personal",
        tags: ["personal"],
    },
];

const initialState: TodoState = {
    items: sampleTodos(),
};

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<Todo>) => {
            state.items.unshift(action.payload);
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.items.find((t) => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((t) => t.id !== action.payload);
        },
        updateTodo: (state, action: PayloadAction<Todo>) => {
            const index = state.items.findIndex(
                (t) => t.id === action.payload.id
            );
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        clearCompleted: (state) => {
            state.items = state.items.filter((t) => !t.completed);
        },
    },
});

export const { addTodo, toggleTodo, removeTodo, updateTodo, clearCompleted } =
    todoSlice.actions;
export default todoSlice.reducer;
export const selectTodos = (state: RootState) => state.todos.items;
