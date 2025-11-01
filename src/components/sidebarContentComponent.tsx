import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Inbox, Calendar, Settings, Tag, CheckSquare } from "lucide-react";

export function SidebarContentComponent() {
    const todos = useSelector((state: RootState) => state.todos.items);

    const counts = useMemo(() => {
        const active = todos.filter((t) => !t.completed).length;
        const completed = todos.filter((t) => t.completed).length;
        const today = todos.filter((t) => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate);
            const now = new Date();
            return due.toDateString() === now.toDateString();
        }).length;

        return { all: todos.length, active, completed, today };
    }, [todos]);

    const projects = useMemo(() => {
        const projectSet = new Set(todos.map((t) => t.project).filter(Boolean));
        return Array.from(projectSet);
    }, [todos]);

    return (
        <div className="p-4 flex flex-col gap-4 min-h-full text-slate-700 bg-slate-50">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>TS</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">Your Todos</div>
                    <div className="text-xs text-slate-500">
                        Organize tasks — shades of grey ✨
                    </div>
                </div>
            </div>

            <Separator />

            <nav className="flex flex-col gap-2">
                <button className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100">
                    <Inbox className="w-4 h-4" />
                    <span className="text-sm font-medium">Inbox</span>
                    <span className="ml-auto text-xs text-slate-500">
                        {counts.all}
                    </span>
                </button>

                <button className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Today</span>
                    <span className="ml-auto text-xs text-slate-500">
                        {counts.today}
                    </span>
                </button>

                <button className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">Tags</span>
                </button>

                <button className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100">
                    <CheckSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                    <span className="ml-auto text-xs text-slate-500">
                        {counts.completed}
                    </span>
                </button>
            </nav>

            <Separator />

            <div className="flex-1">
                <div className="text-xs uppercase text-slate-400 mb-2">
                    Projects
                </div>
                <div className="flex flex-col gap-1">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <button
                                key={project}
                                className="text-left px-3 py-2 rounded-md hover:bg-slate-100 text-sm"
                            >
                                {project}
                            </button>
                        ))
                    ) : (
                        <div className="text-xs text-slate-400 px-3 py-2">
                            No projects
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3 cursor-pointer hover:opacity-70">
                <Settings className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Settings</span>
            </div>
        </div>
    );
}
