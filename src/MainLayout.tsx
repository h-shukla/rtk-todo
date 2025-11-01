import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import App from "./App";
import {
    Sidebar,
    SidebarProvider,
    SidebarContent,
} from "./components/ui/sidebar";
import { SidebarContentComponent } from "./components/sidebarContentComponent";

const LayoutWithSidebar = () => (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
            <Sidebar side="left" variant="sidebar">
                <SidebarContent>
                    <SidebarContentComponent />
                </SidebarContent>
            </Sidebar>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    </SidebarProvider>
);

const MainLayout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutWithSidebar />}>
                    <Route path="/" element={<App />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default MainLayout;
