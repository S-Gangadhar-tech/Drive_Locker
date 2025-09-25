import { Outlet } from "react-router-dom";
import Menubar from "../Components/Menubar";
import loginbg from "../assets/loginbg.jpg";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useFiles } from "../context/FileContext";
import { NotesContext } from "../context/NotesContext";
import Loader from "../Components/Loader";

const Layout = () => {
    // 1. Destructure 'isLoading' from each context and give it a unique name
    const { isLoading: authIsLoading } = useContext(AppContext);
    const { isLoading: notesIsLoading } = useContext(NotesContext);

    // 2. Call your custom hook directly
    const { loading: fileIsLoading } = useFiles();

    // 3. Combine the loading states with the OR (||) operator
    const isAnyLoading = authIsLoading || notesIsLoading || fileIsLoading;
    useEffect(() => {
        // This will log every time the value changes
        console.log('isAnyLoading changed to:', isAnyLoading);
    }, [isAnyLoading]);

    return (
        <div
            className="min-h-screen flex flex-col font-[Poppins] text-white bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${loginbg})` }}
        >
            <div className="min-h-screen flex flex-col bg-black/75">
                <Menubar />
                <main className="flex-grow flex items-center justify-center w-full px-6 py-10">
                    {/* Render Loader if any context is loading */}
                    {isAnyLoading ? <Loader /> : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Layout;