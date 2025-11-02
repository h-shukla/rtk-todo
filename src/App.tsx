import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
} from "./features/todoSlice";
import type { RootState } from "./store";
import type { Todo } from "./features/todoSlice";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle, Trash2, Search } from "lucide-react";
import TodoForm from "./components/TodoForm";
import TodoInlineEditor from "./components/TodoInlineEditor";
import QuickAdd from "./components/QuickAdd";

// Helper
const uid = () => Math.random().toString(36).slice(2, 9);

// Main App - Just the todo logic, no providers!
export default function App() {
    const dispatch = useDispatch();
    const todos = useSelector((state: RootState) => state.todos.items);

    const [q, setQ] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [dialogOpen, setDialogOpen] = useState(false);

    const counts = useMemo(() => {
        return {
            all: todos.length,
            active: todos.filter((t) => !t.completed).length,
            completed: todos.filter((t) => t.completed).length,
        };
    }, [todos]);

    const filtered = useMemo(() => {
        let list = todos;
        if (filter === "active") list = list.filter((t) => !t.completed);
        if (filter === "completed") list = list.filter((t) => t.completed);
        if (q.trim())
            list = list.filter((t) =>
                t.title.toLowerCase().includes(q.toLowerCase())
            );
        return [...list].sort(
            (a, b) =>
                Number(a.completed) - Number(b.completed) ||
                +new Date(b.createdAt) - +new Date(a.createdAt)
        );
    }, [todos, q, filter]);

    function handleAddTodo(title: string) {
        const t: Todo = {
            id: uid(),
            title,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: "medium",
        };
        dispatch(addTodo(t));
    }

    function handleToggle(id: string) {
        dispatch(toggleTodo(id));
    }

    function handleRemove(id: string) {
        dispatch(removeTodo(id));
    }

    function handleUpdate(updated: Todo) {
        dispatch(updateTodo(updated));
    }

    function handleClearCompleted() {
        dispatch(clearCompleted());
    }

    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="p-6 min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-800">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr,420px] gap-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Tasks</h2>
                            <p className="text-sm text-slate-500">
                                A minimal grey modern todo app with Redux.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    placeholder="Search tasks..."
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="pl-10 w-60"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>

                            <Dialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="hidden md:inline-flex"
                                    >
                                        <PlusCircle className="w-4 h-4 mr-2" />{" "}
                                        New
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create a task</DialogTitle>
                                    </DialogHeader>
                                    <TodoForm
                                        onSave={(values) => {
                                            handleAddTodo(values.title);
                                            setDialogOpen(false);
                                        }}
                                        onCancel={() => setDialogOpen(false)}
                                    />
                                    <DialogFooter />
                                </DialogContent>
                            </Dialog>

                            <Button
                                variant="ghost"
                                onClick={() => setFilter("all")}
                            >
                                All ({counts.all})
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setFilter("active")}
                            >
                                Active ({counts.active})
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setFilter("completed")}
                            >
                                Done ({counts.completed})
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Todo list</CardTitle>
                            <CardDescription>
                                Keep things focused with Redux state management.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="max-h-[60vh]">
                                <div className="flex flex-col divide-y divide-slate-100">
                                    {filtered.length === 0 && (
                                        <div className="p-6 text-center text-slate-500">
                                            No tasks found.
                                        </div>
                                    )}

                                    {filtered.map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex items-start gap-4 p-4 hover:bg-slate-50"
                                        >
                                            <div>
                                                <Checkbox
                                                    checked={t.completed}
                                                    onCheckedChange={() =>
                                                        handleToggle(t.id)
                                                    }
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`text-sm ${
                                                            t.completed
                                                                ? "line-through text-slate-400"
                                                                : "text-slate-800"
                                                        }`}
                                                    >
                                                        {t.title}
                                                    </div>
                                                    <div className="ml-auto flex items-center gap-2">
                                                        {t.priority ===
                                                            "high" && (
                                                            <Badge variant="destructive">
                                                                High
                                                            </Badge>
                                                        )}
                                                        {t.priority ===
                                                            "medium" && (
                                                            <Badge>
                                                                Medium
                                                            </Badge>
                                                        )}
                                                        {t.priority ===
                                                            "low" && (
                                                            <Badge variant="secondary">
                                                                Low
                                                            </Badge>
                                                        )}

                                                        {t.dueDate && (
                                                            <div className="text-xs text-slate-500">
                                                                {format(
                                                                    new Date(
                                                                        t.dueDate
                                                                    ),
                                                                    "MMM d"
                                                                )}
                                                            </div>
                                                        )}

                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="px-2"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[320px]">
                                                                <TodoInlineEditor
                                                                    todo={t}
                                                                    onSave={(
                                                                        u
                                                                    ) =>
                                                                        handleUpdate(
                                                                            u
                                                                        )
                                                                    }
                                                                    onDelete={() =>
                                                                        handleRemove(
                                                                            t.id
                                                                        )
                                                                    }
                                                                />
                                                            </PopoverContent>
                                                        </Popover>

                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleRemove(
                                                                    t.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {t.notes && (
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        {t.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                            <div className="text-sm text-slate-500">
                                {counts.active} active • {counts.completed}{" "}
                                completed
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setQ("")}
                                >
                                    Clear search
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleClearCompleted()}
                                >
                                    Clear completed
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <aside className="hidden md:block">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Add</CardTitle>
                            <CardDescription>
                                Rapidly create a task.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <QuickAdd onAdd={(title) => handleAddTodo(title)} />
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-slate-500">
                                Tip: Use the new button to create a task with
                                more details.
                            </div>
                        </CardFooter>
                    </Card>

                    <div className="h-4" />

                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant={
                                        filter === "all" ? "default" : "ghost"
                                    }
                                    onClick={() => setFilter("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={
                                        filter === "active"
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() => setFilter("active")}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={
                                        filter === "completed"
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() => setFilter("completed")}
                                >
                                    Completed
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
