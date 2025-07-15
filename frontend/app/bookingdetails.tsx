import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StatusBar,
    Image,
    TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

type AccessUser = {
    id: string;
    name: string;
    avatar: string;
    status?: string;
};

type Booking = {
    id: string;
    number: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    timeWindow: string;
    address: string;
    distanceKm: number;
    mapLat: number;
    mapLng: number;
    size: string;
    capacity: string;
    price: string;
    extras: string[];
    access: AccessUser[];
};

const booking: Booking = {
    id: 'booking-1',
    number: '№364',
    startDate: '30 Бер.',
    endDate: '2 Квіт.',
    durationDays: 3,
    timeWindow: '18:00—19:00',
    address: 'Вул. Романа Шухевича 3',
    distanceKm: 4,
    mapLat: 50.4501,
    mapLng: 30.5234,
    size: 'Середня',
    capacity: '15 кг',
    price: '100 грн/година',
    extras: ['Захист', 'Охолодження'],
    access: [
        {
            id: 'u1',
            name: 'Замега Станіслав',
            avatar: 'https://placehold.co/48x48.png',
        },
        {
            id: 'u2',
            name: 'Рудая Валерия',
            avatar: 'https://placehold.co/48x48.png',
            status: 'Забряв/ла',
        },
    ],
};

export default function BookingDetailsScreen() {
    return (
        <View className="flex-1 bg-[#0b132b]">
            <StatusBar barStyle="light-content" translucent />
            <Header bookingNumber={booking.number} />
            <ScrollView
                className="flex-1 mt-4"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <MapSnippet lat={booking.mapLat} lng={booking.mapLng} />
                <BookingMeta booking={booking} />
                <SettingsCard booking={booking} />
                <AccessRights booking={booking} />
                <ActionMenu />
            </ScrollView>
            <BottomActions />
        </View>
    );
}

type HeaderProps = { bookingNumber: string };
const Header: React.FC<HeaderProps> = ({ bookingNumber }) => (
    <View className="pt-14 px-6 flex-row items-center justify-between">
        <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-base font-semibold">{bookingNumber}</Text>
        <TouchableOpacity>
            <Feather name="share" size={20} color="white" />
        </TouchableOpacity>
    </View>
);

type MapSnippetProps = { lat: number; lng: number };
const MapSnippet: React.FC<MapSnippetProps> = ({ lat, lng }) => (
    <View className="mx-6 rounded-2xl overflow-hidden h-40 mt-4">
        <MapView
            initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            className="flex-1"
            pointerEvents="none"
        >
            <Marker coordinate={{ latitude: lat, longitude: lng }} />
        </MapView>
    </View>
);

const BookingMeta: React.FC<{ booking: Booking }> = ({ booking }) => (
    <View className="mx-6 bg-[#0d1b37] rounded-b-2xl px-4 pb-4">
        <View className="flex-row justify-between pt-2">
            <Text className="text-xs text-gray-400">
                {booking.startDate} – {booking.endDate}
            </Text>
            <Text className="text-xs text-gray-400">
                {booking.durationDays} доби | {booking.timeWindow}
            </Text>
        </View>
        <View className="flex-row items-center mt-2">
            <View className="bg-[#1a274a] rounded-full px-3 py-1 mr-2">
                <Text className="text-xs text-white">{booking.address}</Text>
            </View>
            <View className="bg-[#1a274a] rounded-full px-2 py-1">
                <Text className="text-xs text-white">{booking.distanceKm} км</Text>
            </View>
        </View>
    </View>
);

const SettingsCard: React.FC<{ booking: Booking }> = ({ booking }) => (
    <View className="mx-6 mt-4 bg-[#0d1b37] rounded-2xl p-4">
        <Text className="text-white text-sm font-semibold mb-2">Налаштування</Text>
        <View className="flex-row justify-between mb-3">
            <View>
                <Text className="text-xs text-gray-400">Розмір</Text>
                <Text className="text-white text-sm">{booking.size}</Text>
            </View>
            <View>
                <Text className="text-xs text-gray-400">Вміст</Text>
                <Text className="text-white text-sm">{booking.capacity}</Text>
            </View>
            <View>
                <Text className="text-xs text-gray-400">Ціна</Text>
                <Text className="text-white text-sm">{booking.price}</Text>
            </View>
        </View>
        {booking.extras.length > 0 && (
            <View>
                <Text className="text-xs text-gray-400 mb-1">Додатково:</Text>
                <View className="flex-row flex-wrap gap-2">
                    {booking.extras.map(ext => (
                        <View key={ext} className="bg-[#1a274a] px-3 py-1 rounded-full">
                            <Text className="text-xs text-white">{ext}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )}
    </View>
);

const AccessRights: React.FC<{ booking: Booking }> = ({ booking }) => (
    <View className="mx-6 mt-4 bg-[#0d1b37] rounded-2xl p-4">
        <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-white font-semibold">Права доступу</Text>
            <Pressable>
                <Text className="text-xs text-blue-500">Додати співвласника</Text>
            </Pressable>
        </View>
        {booking.access.map(user => (
            <View key={user.id} className="flex-row items-center py-2 border-b border-[#1a274a] last:border-b-0">
                <Image source={{ uri: user.avatar }} className="w-8 h-8 rounded-full mr-3" />
                <View className="flex-1">
                    <Text className="text-white text-sm">{user.name}</Text>
                    {user.status && <Text className="text-xs text-gray-400">{user.status}</Text>}
                </View>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#6b7ab1" />
            </View>
        ))}
    </View>
);

const ActionMenu = () => (
    <View className="mx-6 mt-4 bg-[#0d1b37] rounded-2xl">
        <ActionRow label="Редагувати період та опції" />
        <ActionRow label="Скасувати бронювання" />
        <ActionRow label="Зв’язатися з підтримкою" last />
    </View>
);

type ActionRowProps = { label: string; last?: boolean };
const ActionRow: React.FC<ActionRowProps> = ({ label, last }) => (
    <Pressable className={`flex-row items-center justify-between px-4 py-3 ${!last ? 'border-b border-[#1a274a]' : ''}`}>
        <Text className="text-white text-sm">{label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#6b7ab1" />
    </Pressable>
);

const BottomActions = () => (
    <View className="absolute bottom-0 inset-x-0 bg-[#0d1b37] h-20 flex-row items-center justify-around border-t border-[#1a274a]">
        <Pressable className="bg-blue-600 px-6 py-3 rounded-full">
            <Text className="text-white text-sm font-semibold">Змінити</Text>
        </Pressable>
        <Pressable className="bg-red-600 px-6 py-3 rounded-full">
            <Text className="text-white text-sm font-semibold">Скасувати</Text>
        </Pressable>
    </View>
);