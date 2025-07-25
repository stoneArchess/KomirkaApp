import React, {useEffect, useState} from "react";
import { View, Text, Pressable, ScrollView, Alert, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useBookings } from "@/contexts/bookingsContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function BookingDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { userBookings, deleteBooking, updateBooking } = useBookings();

    const booking = userBookings.find((b) => b.id === Number(id));

    useEffect(() => {
        console.log("booking",booking?.destinationCabinet);
    }, []);

    if (!booking) {
        return (
            <View className="flex-1 items-center justify-center bg-zinc-900">
                <Text className="text-gray-400">Бронювання не знайдено</Text>
            </View>
        );
    }

    const handleCancel = async () => {
        Alert.alert("Скасувати бронювання?", "Це дію не можна буде скасувати.", [
            { text: "Відміна", style: "cancel" },
            {
                text: "Скасувати",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteBooking(booking);
                        router.back();
                    } catch (e) {
                        Alert.alert("Помилка", "Не вдалося скасувати бронювання.");
                    }
                },
            },
        ]);
    };


    return (
        <ScrollView className="flex-1 bg-[#0c0c1c]" contentContainerStyle={{ paddingBottom: 100 }}>
            <LinearGradient
                colors={["#1b1b35", "#0c0c1c"]}
                className="pb-6"
                style={{ paddingTop: Platform.OS === "ios" ? 60 : 40 }}
            >
                <View className="px-6">
                    <View className="flex-row justify-between items-center mb-2">
                        <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
                        <Text className="text-white font-semibold text-base">#{booking.id}</Text>
                        <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                    </View>
                    <Text className="text-gray-400 text-sm mb-1">{new Date(booking.startDate).toLocaleDateString()} — {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "—"}</Text>
                    <Text className="text-gray-400 text-sm">{booking.endDate !== null ? (Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)) + "днів") : "" } </Text>
                </View>
            </LinearGradient>

            <View className="px-6 -mt-6">
                <Section title="Основна інформація">
                    <Detail label="Комірка" value={`#${booking.cell.id}`} />
                    <Detail label="Кабінет" value={`#${booking.cell.cabinet.address}`} />
                    <Detail label="Статус" value={booking.status} />
                    <Detail label="Початок" value={new Date(booking.startDate).toLocaleString()} />
                    <Detail label="Завершення" value={booking.endDate ? new Date(booking.endDate).toLocaleString() : "—"} />
                    { booking.destinationCabinet && (<Detail label="Місце призначення" value={booking.destinationCabinet.address} />)}
                </Section>

                <Section title="Налаштування">
                    <Detail label="Розмір" value="Середня" />
                    <Detail label="Вміст" value="15 кг" />
                    <Detail label="Ціна" value="100 грн/година" />
                    <View className="flex-row gap-2 mt-2">
                        <Text className="text-blue-400 text-xs border border-blue-400 px-3 py-1 rounded-full">Захист</Text>
                        <Text className="text-blue-400 text-xs border border-blue-400 px-3 py-1 rounded-full">Охолодження</Text>
                    </View>
                </Section>

                <Section title="Дії">
                    <Pressable className="py-3 border-b border-zinc-700">
                        <Text className="text-white">Редагувати період та опції</Text>
                    </Pressable>
                    <Pressable onPress={handleCancel} className="py-3 border-b border-zinc-700">
                        <Text className="text-red-500">Скасувати бронювання</Text>
                    </Pressable>
                    <Pressable className="py-3">
                        <Text className="text-white">Зв&apos;язатися з підтримкою</Text>
                    </Pressable>
                </Section>

                <View className="flex-row justify-between gap-2 mt-4">
                    <Pressable className="flex-1 border border-white rounded-full py-3">
                        <Text className="text-white text-center">Прокласти маршрут</Text>
                    </Pressable>
                    <Pressable className="flex-1 bg-blue-600 rounded-full py-3">
                        <Text className="text-white text-center">Відкрити комірку</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6 rounded-2xl bg-[#1a1a2f] px-4 py-5">
        <Text className="text-white text-base font-semibold mb-3">{title}</Text>
        {children}
    </View>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between py-2 border-b border-zinc-700">
        <Text className="text-gray-400 text-sm">{label}</Text>
        <Text className="text-white text-sm font-medium max-w-[60%] text-right">{value}</Text>
    </View>
);
