import type { Todo } from "@/features/todoSlice";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@radix-ui/react-select";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

function TodoInlineEditor({
    todo,
    onSave,
    onDelete,
}: {
    todo: Todo;
    onSave: (t: Todo) => void;
    onDelete: () => void;
}) {
    const [title, setTitle] = useState(todo.title);
    const [notes, setNotes] = useState(todo.notes || "");
    const [priority, setPriority] = useState<Todo["priority"]>(
        todo.priority || "medium"
    );
    const [dueDate, setDueDate] = useState(todo.dueDate || "");

    return (
        <div className="flex flex-col gap-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
            />

            <div className="flex items-center justify-between gap-2">
                <Select
                    value={priority}
                    onValueChange={(v) => setPriority(v as Todo["priority"])}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="date"
                    value={dueDate?.slice(0, 10)}
                    onChange={(e) =>
                        setDueDate(
                            e.target.value
                                ? new Date(e.target.value).toISOString()
                                : ""
                        )
                    }
                />
            </div>

            <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => {
                        onSave({ ...todo, title, notes, priority, dueDate });
                    }}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

export default TodoInlineEditor;
