import { Outlet } from "react-router-dom";
import Menubar from "../components/Menubar";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useFiles } from "../hooks/useFiles";
import Loader from "../components/Loader";

const Layout = () => {
    // 1. Destructure 'isLoading' from each context and give it a unique name
    const { isLoading: authIsLoading } = useContext(AppContext);


    // 2. Call your custom hook directly
    const { loading: fileIsLoading } = useFiles();

    // 3. Combine the loading states with the OR (||) operator
    const isAnyLoading = authIsLoading || fileIsLoading;
    useEffect(() => {
        // This will log every time the value changes
        console.log('isAnyLoading changed to:', isAnyLoading);
    }, [isAnyLoading]);

    return (
        <div
            className="min-h-screen flex flex-col font-[Poppins] text-white bg-[url('/bg.png')] bg-cover bg-center bg-fixed"
        >
            <div className="min-h-screen flex flex-col bg-black/80 backdrop-blur-sm">
                <Menubar />
                <main className="w-full max-w-screen-2xl mx-auto flex-grow px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    {/* Render Loader if any context is loading */}
                    {isAnyLoading ? <Loader /> : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Layout;