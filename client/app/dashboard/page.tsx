import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import IDEPage from "../components/IDE";

export default function Layout({ children }: { children?: React.ReactNode; isIDEPage?: boolean }) {
    // If isIDEPage is true, override children with the IDEPage component
    const content = <IDEPage />;

    return (
        <SidebarProvider className="bg-black">
            <AppSidebar variant="floating" className="dark  text-white border-gray-500" />

            <main className=" w-full h-screen overflow-clip">
                <SidebarTrigger />
                {content}
            </main>
        </SidebarProvider>
    );
}
