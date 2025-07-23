import React, { createContext, useContext, useState, ReactNode } from "react";
import { useUser } from "./userContext";
import {router} from "expo-router";

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "";

export type Booking = {
    id: number;
    cellId: number;
    cabinetId: number;
    bookingStatus: string;
    delivery: boolean;
    startDate: Date;
    endDate: Date | null;
    destinationCabinetId: number | null;
};

export type BookingsContextType = {
    userBookings: Booking[];

    getUserBookings: () => Promise<void>;

    createBooking: (newBooking: Booking) => Promise<void>;
    deleteBooking: (booking: Booking) => Promise<void>;
    updateBooking: (newBooking: Booking) => Promise<void>;
};

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
    const { tokens, user } = useUser();

    const authHeaders = (extra?: Record<string, string>) => {
        if (!tokens?.access) throw new Error("Not authenticated – access token missing");
        return { Authorization: `Bearer ${tokens.access}`, ...extra } as HeadersInit;
    };

    const [userBookings, setUserBookings] = useState<Booking[]>([]);

    const getUserBookings = async () => {
        if (!user) return;
        const res = await fetch(`${API_BASE}/api/bookings/getUserBookings`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Unable to fetch user's bookings");
        setUserBookings(await res.json());
    };

    const createBooking = async (newBooking: Booking) => {
        const res = await fetch(`${API_BASE}/api/bookings/createBooking`, {
            method: "POST",
            headers: { Authorization: `Bearer ${tokens?.access}`, "Content-Type": "application/json" },
            body: JSON.stringify(newBooking),
        });
        console.log(newBooking);
        if (!res.ok) throw new Error(`Failed to create the booking `);

        await getUserBookings();
    };

    const updateBooking = async (newBooking: Booking) => {
        const res = await fetch(`${API_BASE}/api/bookings/updateBooking`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${tokens?.access}`, "Content-Type": "application/json" },
            body: JSON.stringify(newBooking),
        });
        if (!res.ok) throw new Error("Failed to update the booking");

        await getUserBookings();
    };
    const deleteBooking = async (newBooking: Booking) => {
        console.log(newBooking.id, "old")
        const res = await fetch(`${API_BASE}/api/bookings/deleteBooking`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${tokens?.access}`, "Content-Type": "application/json" },
            body: JSON.stringify({ id: newBooking.id }),
        });
        console.log(newBooking.id, "new")

        if (!res.ok) throw new Error("Failed to delete the booking");

        await getUserBookings();
    };

    const value: BookingsContextType = {
        userBookings,
        getUserBookings,
        updateBooking,
        deleteBooking,
        createBooking,
    };

    return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
};

export const useBookings = (): BookingsContextType => {
    const ctx = useContext(BookingsContext);
    if (!ctx) throw new Error("useBookings must be used within a BookingsProvider");
    return ctx;
};
