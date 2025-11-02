import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Component definitions...
export default function QuickAdd({
    onAdd,
}: {
    onAdd: (title: string) => void;
}) {
    const [val, setVal] = useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!val.trim()) return;
                onAdd(val.trim());
                setVal("");
            }}
            className="flex gap-2"
        >
            <Input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Task title"
            />
            <Button type="submit">Add</Button>
        </form>
    );
}
