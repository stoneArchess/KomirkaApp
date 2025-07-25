import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useBookings } from "@/contexts/bookingsContext";
import { Ionicons } from "@expo/vector-icons";

export default function BookingDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { userBookings, deleteBooking, updateBooking } = useBookings();

    const booking = userBookings.find((b) => b.id === Number(id));

    const [newDestinationId, setNewDestinationId] = useState(booking?.destinationCabinetId ?? null);

    if (!booking) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-500">Бронювання не знайдено</Text>
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

    const handleUpdateDestination = async () => {
        try {
            await updateBooking({ ...booking, destinationCabinetId: newDestinationId });
            Alert.alert("Оновлено", "Місце призначення оновлено.");
        } catch (e) {
            Alert.alert("Помилка", "Не вдалося оновити місце призначення.");
        }
    };

    return (
        <ScrollView className="flex-1 bg-white px-6 pt-6" contentContainerStyle={{ paddingBottom: 80 }}>
            <Text className="text-xl font-semibold mb-4">Деталі бронювання</Text>

            <View className="space-y-2">
                <Detail label="ID" value={booking.id.toString()} />
                <Detail label="Кабінет" value={`#${booking.cabinetId}`} />
                <Detail label="Статус" value={booking.bookingStatus} />
                <Detail label="Комірка" value={`#${booking.cellId}`} />
                <Detail label="Дата початку" value={booking.startDate ? new Date(booking.startDate).toLocaleString() : "—"} />
                <Detail label="Дата завершення" value={booking.endDate ? new Date(booking.endDate).toLocaleString() : "—"} />
                <Detail label="З доставкою" value={booking.delivery ? "Так" : "Ні"} />
                {booking.delivery && (
                    <>
                        <Detail label="Місце призначення" value={`#${newDestinationId ?? "—"}`} />

                        <Pressable
                            onPress={handleUpdateDestination}
                            className="bg-blue-500 mt-2 py-2 px-4 rounded-full"
                        >
                            <Text className="text-white text-center">Змінити місце призначення</Text>
                        </Pressable>
                    </>
                )}
            </View>

            <Pressable
                onPress={handleCancel}
                className="mt-8 border border-red-500 py-3 rounded-full"
            >
                <Text className="text-red-500 text-center">Скасувати бронювання</Text>
            </Pressable>
        </ScrollView>
    );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between border-b border-gray-200 py-2">
        <Text className="text-gray-500">{label}</Text>
        <Text className="text-black font-medium">{value}</Text>
    </View>
);
