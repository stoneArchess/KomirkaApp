
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import {Href, router} from "expo-router";

type Coordinates = { latitude: number; longitude: number };

export type User = {
    id: number;
    email: string;
    name: string;
    description: string;
    region: string;
    coordinates: Coordinates;
    selectedTheme: string;
};

type AuthTokens = {
    access: string;
    expires: number;
};

type UserContextType = {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;

    verify: (code: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    update: (name: string, description: string, region: string, selectedTheme: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateTheme: (theme: User["selectedTheme"]) => void;
};

const STORAGE_KEY = "authkey";
const API_BASE    = process.env.EXPO_PUBLIC_API_URL ?? ""; // blank string fallback is for typescript stuff

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user,    setUser]   = useState<User | null>(null);
    const [tokens,  setTokens] = useState<AuthTokens | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    const isAuthenticated = !!tokens?.access;

    useEffect(() => {
        (async () => {
            const raw = await SecureStore.getItemAsync(STORAGE_KEY);
            if (!raw) return;

            try {
                const saved = JSON.parse(raw) as { user: User; tokens: AuthTokens };

                setUser(saved.user);
                setTokens(saved.tokens);
            } catch {
                await SecureStore.deleteItemAsync(STORAGE_KEY);
            }
        })();
    }, []);

    const persist = async (u: User, t: AuthTokens) => {
        setUser(u);
        setTokens(t);
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify({ user: u, tokens: t }));
    };

    const fetchMe = async (accessToken: string) => {

        const res = await fetch(`${API_BASE}/api/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(res);
        if (!res.ok) throw new Error("Unable to fetch user profile");
        return (await res.json()) as User;
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        console.log(res);
        if (!res.ok) throw new Error("Invalid credentials");

        const { token, expiresIn } = await res.json();
        const u = await fetchMe(token);
        await persist(u, { access: token, expires: Date.now() + expiresIn * 1000 });
        router.replace("/");
    };
    const verify = async (code: string) => {
        const res = await fetch(`${API_BASE}/api/users/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, code }),
        });
        if (!res.ok) throw new Error("Invalid credentials");

        const { token, expiresIn } = await res.json();
        const u = await fetchMe(token);
        await persist(u, { access: token, expires: Date.now() + expiresIn * 1000 });
        router.replace("/");
    };

    const register = async (email: string, password: string, name: string) => {

        const res = await fetch(`${API_BASE}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });
        if (!res.ok) throw new Error("Registration failed");

        const { token, expiresIn } = await res.json();
        const u = await fetchMe(token);
        await persist(u, { access: token, expires: Date.now() + expiresIn * 1000 });
        router.replace("/");
    };

    const update = async (name: string, description: string, region: string, selectedTheme: string) => {
        const res = await fetch(`${API_BASE}/api/users/me`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${tokens?.access}`, "Content-Type": "application/json" },
            body: JSON.stringify({name, description, region, selectedTheme }),
        });
        if (!res.ok) throw new Error("Invalid credentials");

        const { token, expiresIn } = await res.json();
        const u = await fetchMe(token);
        await persist(u, { access: token, expires: Date.now() + expiresIn * 1000 });
    };



    const logout = async () => {
        setUser(null);
        setTokens(null);
        await SecureStore.deleteItemAsync(STORAGE_KEY);
        router.replace("/login" as Href);
    };

    const updateTheme = (theme: User["selectedTheme"]) =>
        setUser((prev) => (prev ? { ...prev, selectedTheme: theme } : prev));


    const value: UserContextType = {
        user,
        tokens,
        isAuthenticated,
        login,
        verify,
        register,
        logout,
        update,
        updateTheme,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
};