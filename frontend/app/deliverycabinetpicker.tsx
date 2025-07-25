import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Pressable,
    PanResponder,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import {Cabinet, Cell, useCabinet} from '@/contexts/cabinetContext';
import {Booking, useBookings} from '@/contexts/bookingsContext';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const absoluteFill = StyleSheet.absoluteFill;

export type NewBooking = {
    cellId: number,
    destinationCabinetId: null | number,
    startDate: Date,
    endDate: null | Date ,
};

export default function DeliveryMapScreen() {
    const { cabinetId, cellId } = useLocalSearchParams();
    const { getCabinets, cabinetCells, cabinets } = useCabinet();
    const { createBooking } = useBookings();

    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
    const panelAnim = useRef(new Animated.Value(0)).current;
    const panelHeight = SCREEN_HEIGHT * 0.4;

    useEffect(() => {
        getCabinets();
    }, []);

    const openPanel = () => {
        Animated.timing(panelAnim, {
            toValue: -panelHeight,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closePanel = () => {
        Animated.timing(panelAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => setSelectedCabinet(null));
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    closePanel();
                }
            },
        })
    ).current;

    const handleMarkerPress = (cabinet:Cabinet) => {
        setSelectedCabinet(cabinet);
        openPanel();
    };

    const filteredCabinets = useMemo(() => {
        return cabinets.filter((c) => c.id !== Number(cabinetId));
    }, [cabinets, cabinetId]);

    const handleOrder = async () => {
        if (!selectedCabinet || !cellId) return;
        try {
            const booking: NewBooking = {
                cellId: Number(cellId),
                destinationCabinetId: selectedCabinet.id,
                startDate: new Date(),
                endDate: null,
            };
            await createBooking(booking);
            router.replace('/home');
        } catch (err) {
            console.error('Booking failed:', err);
        }
    };

    return (
        <GestureHandlerRootView className="flex-1 bg-black">
            <View className="flex-1">
                <View className="absolute top-12 left-4 z-10">
                    <Pressable onPress={() => router.back()} className="flex-row items-center space-x-1">
                        <Ionicons name="arrow-back" size={24} color="white" />
                        <Text className="text-white font-medium">Назад</Text>
                    </Pressable>
                </View>

                <MapView
                    style={absoluteFill}
                    initialRegion={{
                        latitude: 50.05905600367985,
                        longitude: 14.479300486699936,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {filteredCabinets.map((cabinet) => (
                        <Marker
                            key={cabinet.id}
                            coordinate={{
                                latitude: Number(cabinet.latitude),
                                longitude: Number(cabinet.longitude),
                            }}
                            title={cabinet.address}
                            onPress={() => handleMarkerPress(cabinet)}
                        />
                    ))}
                </MapView>

                <Animated.View
                    {...panResponder.panHandlers}
                    style={{
                        transform: [{ translateY: panelAnim }],
                        position: 'absolute',
                        bottom: -panelHeight,
                        left: 0,
                        right: 0,
                        height: panelHeight,
                        backgroundColor: '#111827',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 8,
                        zIndex: 10,
                    }}
                >
                    {selectedCabinet && (
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-white mb-3">
                                {selectedCabinet.address}
                            </Text>
                            <TouchableOpacity
                                className="bg-blue-600 py-3 rounded-lg items-center"
                                onPress={handleOrder}
                            >
                                <Text className="text-white font-semibold text-base">Замовити доставку сюди</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </View>
        </GestureHandlerRootView>
    );
}
