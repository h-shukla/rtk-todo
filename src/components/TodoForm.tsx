import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function TodoForm({
    onSave,
    onCancel,
}: {
    onSave: (values: { title: string }) => void;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!title.trim()) return;
                onSave({ title: title.trim() });
            }}
            className="flex flex-col gap-3"
        >
            <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit">Create</Button>
            </div>
        </form>
    );
}
