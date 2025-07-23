import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {useBookings, Booking} from "@/contexts/bookingsContext";

import "../global.css";
import {Href, router} from "expo-router";

export default function HomeScreen() {
    const { userBookings, getUserBookings} = useBookings();

    useEffect(() => {
        getUserBookings();
    }, [userBookings]);

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" translucent />

            <ScrollView
                className="flex-1 mt-4 px-6"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {userBookings.length === 0 ? (
                    <Text className="text-center text-gray-400 mt-20">Немає активних відправлень</Text>
                ) : (
                    userBookings.map((booking) => (
                        <Pressable
                            key={booking.id}
                            onPress={() =>
                                router.push({
                                    pathname: '/bookingdetails',
                                    params: { id: booking.id.toString() },
                                })
                            }
                        >
                            <DeliveryCard booking={booking} />
                        </Pressable>
                    ))
                )}
            </ScrollView>

            <BottomMenu />
        </View>
    );
}



const ToggleButton: React.FC<{
    label: string;
    active?: boolean;
    onPress?: () => void;
}> = ({ label, active = false, onPress }) => (
    <Pressable className="flex-1" onPress={onPress}>
        {({ pressed }) => (
            <View
                className={`py-2 rounded-full ${
                    active ? 'bg-white border border-blue-500' : pressed ? 'bg-gray-200' : ''
                }`}
            >
                <Text className={`text-center text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>
                    {label}
                </Text>
            </View>
        )}
    </Pressable>
);

function ToggleBar() {
    return (
        <View className="mx-6 mt-6 bg-gray-100 rounded-full flex-row p-1 border border-gray-200">
            <ToggleButton label="Я ініціюю" active />
            <ToggleButton label="Мені передають" />
        </View>
    );
}

const DeliveryCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const statusStyles: Record<string, { color: string; text: string }> = {
        finished: { color: 'bg-green-500', text: 'Перевірено' },
        cancelled: { color: 'bg-red-500', text: 'Відхилено' },
        active: { color: 'bg-yellow-400', text: 'Очікує' },
    };

    const statusInfo = statusStyles[booking.bookingStatus] || {
        color: 'bg-gray-300',
        text: booking.bookingStatus,
    };

    return (
        <View className="mb-4 bg-gray-100 rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-center mb-2">
                <View className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                <Text className="ml-2 text-xs text-gray-600">{statusInfo.text}</Text>
            </View>

            <View className="flex-row justify-between">
                <Text className="text-black font-medium">Кабінет #{booking.cabinetId}</Text>
                <Text className="text-black font-medium">
                    {booking.delivery && booking.destinationCabinetId
                        ? `→ Кабінет #${booking.destinationCabinetId}`
                        : 'Без доставки'}
                </Text>
            </View>

            <View className="flex-row justify-between items-center mt-1">
                <Text className="text-xs text-gray-500">ID: {booking.id}</Text>
                <MaterialCommunityIcons name="dots-horizontal" size={18} color="#838383" />
            </View>

            <View className="h-px bg-gray-300 my-3" />
        </View>
    );
};

const MenuItem: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }> = ({
                                                                                                               icon,
                                                                                                               label,
                                                                                                               onPress,
                                                                                                           }) => (
    <Pressable className="items-center" onPress={onPress}>
        <Ionicons name={icon} size={22} color="#555" />
        <Text className="text-[10px] text-gray-600 mt-1">{label}</Text>
    </Pressable>
);

function BottomMenu() {

    function handleMapPress() {
        router.push("map" as Href);
    }


    return (
        <View className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-gray-200 flex-row items-center justify-around">
            <MenuItem icon="map-outline" label="Мапа" onPress={handleMapPress}/>
        </View>
    );
}