import React, { createContext, useContext, useState, ReactNode } from "react";
import { useUser } from "./userContext";

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "";

export type Cell = {
    id: number;
    width: number;
    height: number;
    weightCapacity: number;
    isOccupied: boolean;
    hasAC: boolean;
    isReinforced: boolean;
    cabinetId: number;
};

export type Cabinet = {
    id: number;
    longitude: number;
    latitude: number;
};

export type CabinetContextType = {
    userCells: Cell[];
    allCells: Cell[];
    cabinets: Cabinet[];
    cabinetCells: Record<number, Cell[]>;

    getUserCells: () => Promise<void>;
    getAllCells: () => Promise<void>;
    getCabinets: () => Promise<void>;
    getCabinetCells: (cabinetId: number) => Promise<void>;

    changeOccupancy: (cellId: number, isOccupied: boolean) => Promise<void>;
    openCell: (cellId: number) => Promise<void>;
};

const CabinetContext = createContext<CabinetContextType | undefined>(undefined);

export const CabinetProvider = ({ children }: { children: ReactNode }) => {
    const { tokens, user } = useUser();

    const authHeaders = (extra?: Record<string, string>) => {
        if (!tokens?.access) throw new Error("Not authenticated – access token missing");
        return { Authorization: `Bearer ${tokens.access}`, ...extra } as HeadersInit;
    };

    const [userCells, setUserCells] = useState<Cell[]>([]);
    const [allCells, setAllCells] = useState<Cell[]>([]);
    const [cabinets, setCabinets] = useState<Cabinet[]>([]);
    const [cabinetCells, setCabinetCells] = useState<Record<number, Cell[]>>({});

    const getUserCells = async () => {
        if (!user) return;
        const res = await fetch(`${API_BASE}/api/users/${user.id}/cells`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Unable to fetch user's cells");
        setUserCells(await res.json());
    };

    const getAllCells = async () => {
        const res = await fetch(`${API_BASE}/api/cells`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Unable to fetch cells");
        setAllCells(await res.json());
    };

    const getCabinets = async () => {
        const res = await fetch(`${API_BASE}/api/cabinets`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Unable to fetch cabinets");
        setCabinets(await res.json());
    };

    const getCabinetCells = async (cabinetId: number) => {
        const res = await fetch(`${API_BASE}/api/cabinets/${cabinetId}/cells`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Unable to fetch cells for cabinet");
        const data: Cell[] = await res.json();
        setCabinetCells((prev) => ({ ...prev, [cabinetId]: data }));
    };

    const changeOccupancy = async (cellId: number, isOccupied: boolean) => {
        const res = await fetch(`${API_BASE}/api/cells/${cellId}/occupancy`, {
            method: "PATCH",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ isOccupied, userId: user?.id }),
        });
        if (!res.ok) throw new Error("Failed to update cell occupancy");

        const apply = (arr: Cell[]) => arr.map((c) => (c.id === cellId ? { ...c, isOccupied } : c));
        setUserCells(apply);
        setAllCells(apply);
        setCabinetCells((prev) => {
            const copy: Record<number, Cell[]> = {};
            for (const key of Object.keys(prev)) copy[+key] = apply(prev[+key]);
            return copy;
        });
    };

    const openCell = async (cellId: number) => {
        const res = await fetch(`${API_BASE}/api/cells/${cellId}/open`, {
            method: "POST",
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Failed to open cell");
    };

    const value: CabinetContextType = {
        userCells,
        allCells,
        cabinets,
        cabinetCells,
        getUserCells,
        getAllCells,
        getCabinets,
        getCabinetCells,
        changeOccupancy,
        openCell,
    };

    return <CabinetContext.Provider value={value}>{children}</CabinetContext.Provider>;
};

export const useCabinet = (): CabinetContextType => {
    const ctx = useContext(CabinetContext);
    if (!ctx) throw new Error("useCabinet must be used within a CabinetProvider");
    return ctx;
};
