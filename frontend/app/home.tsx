import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import "../global.css";

type Status = 'checked' | 'declined' | 'pending';

interface Delivery {
    id: string;
    status: Status;
    from: string;
    to: string;
    date: string;
    time: string;
    till: string;
    phone?: string;
    bill?: string;
    note?: string;
}

const deliveries: Delivery[] = [
    {
        id: '1',
        status: 'checked',
        from: 'Хмельницький',
        to: 'Житомир',
        date: '27 чер.',
        time: '12:00',
        till: 'Сьогодні | до 18:00',
        phone: '+380 98 *** 64 50',
        bill: '204515145',
        note: 'Післяплата',
    },
    {
        id: '2',
        status: 'declined',
        from: 'Хмельницький',
        to: 'Житомир',
        date: '27 чер.',
        time: '12:00',
        till: 'Сьогодні | до 18:00',
    },
];
export default function HomeScreen() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" translucent />

            <Header />

            <ToggleBar />

            <ScrollView
                className="flex-1 mt-4 px-6"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {deliveries.length === 0 ? (
                    <Text className="text-center text-gray-400 mt-20">Немає активних відправлень</Text>
                ) : (
                    deliveries.map((d) => <DeliveryCard key={d.id} {...d} />)
                )}
            </ScrollView>

            <BottomMenu />
        </View>
    );
}

function Header() {
    return (
        <View className="pt-14 px-6 flex-row items-center justify-between">
            <View>
                <Text className="text-xs text-gray-500">Доброго ранку</Text>
                <Text className="text-xl font-bold text-black">Замега Станіслав</Text>
            </View>
            <View className="flex-row space-x-4">
                <Feather name="search" size={20} color="#333" />
                <Feather name="bell" size={20} color="#333" />
            </View>
        </View>
    );
}

interface ToggleButtonProps {
    label: string;
    active?: boolean;
    onPress?: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, active = false, onPress }) => (
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

interface DeliveryCardProps extends Delivery {}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ status, from, to, date, time, till, phone, bill, note }) => {
    const statusStyles: Record<Status, { color: string; text: string }> = {
        checked: { color: 'bg-green-500', text: 'Перевірено' },
        declined: { color: 'bg-red-500', text: 'Відхилено' },
        pending: { color: 'bg-yellow-400', text: 'Очікує' },
    };

    return (
        <View className="mb-4 bg-gray-100 rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-center mb-2">
                <View className={`w-2 h-2 rounded-full ${statusStyles[status].color}`} />
                <Text className="ml-2 text-xs text-gray-600">{statusStyles[status].text}</Text>
            </View>

            <View className="flex-row justify-between">
                <Text className="text-black font-medium">{from}</Text>
                <Text className="text-black font-medium">{to}</Text>
            </View>

            <View className="flex-row justify-between items-center mt-1">
                <Text className="text-xs text-gray-500">
                    {date} | {time}
                </Text>
                <MaterialCommunityIcons name="dots-horizontal" size={18} color="#838383" />
                <Text className="text-xs text-gray-500">{till}</Text>
            </View>

            <View className="h-px bg-gray-300 my-3" />

            {bill && (
                <View className="mb-2">
                    <Text className="text-sm text-gray-600">{bill}</Text>
                    {phone && <Text className="text-xs text-gray-500">Для: {phone}</Text>}
                </View>
            )}

            {note && <Text className="text-xs text-gray-500">{note}</Text>}
        </View>
    );
};

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => (
    <Pressable className="items-center" onPress={onPress}>
        <Ionicons name={icon} size={22} color="#555" />
        <Text className="text-[10px] text-gray-600 mt-1">{label}</Text>
    </Pressable>
);

function BottomMenu() {
    return (
        <View className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-gray-200 flex-row items-center justify-around">
            <MenuItem icon="home-outline" label="Головна" />
            <MenuItem icon="map-outline" label="Мапа" />
            <MenuItem icon="qr-code-outline" label="QR" />
            <MenuItem icon="gift-outline" label="Бонуси" />
            <MenuItem icon="person-outline" label="Профіль" />
        </View>
    );
}

