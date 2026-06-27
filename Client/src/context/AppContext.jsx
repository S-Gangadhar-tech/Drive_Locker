import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../utils/constants";
import * as authApi from "../api/auth";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalLoading, setGlobalLoading] = useState(false);

    axios.defaults.withCredentials = true;

    const getUserdata = async () => {
        try {
            setIsLoading(true);
            const userProfile = await authApi.getProfile();
            if (userProfile) {
                setUserData(userProfile);
            } else {
                setUserData(null);
            }
        } catch (error) {
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const initializeAuth = async () => {
        try {
            setIsLoading(true);
            const isLoggedInResult = await authApi.isAuthenticated();
            setIsLoggedin(isLoggedInResult);

            if (isLoggedInResult) {
                await getUserdata();
            } else {
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const contextValue = {
        BackendURL,
        isLoggedin,
        userData,
        setIsLoggedin,
        getUserdata,
        setUserData,
        isLoading,
        setIsLoading,
        globalLoading,
        setGlobalLoading,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};