import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Pressable,
    PanResponder,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Href, router} from 'expo-router';
import { useCabinet, Cell, Cabinet } from '@/contexts/cabinetContext';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import {Ionicons} from "@expo/vector-icons";

const absoluteFill = StyleSheet.absoluteFill;

export default function MapScreen() {
    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sizeFilter, setSizeFilter] = useState<'small' | 'medium' | 'big' | null>(null);
    const [coolingOnly, setCoolingOnly] = useState(false);
    const [cameraOnly, setCameraOnly] = useState(false);

    const { getCabinets, cabinetCells, cabinets } = useCabinet();

    useEffect(() => {
        getCabinets();
    }, []);

    useEffect(() => {
        if (!selectedCabinet && (searchQuery || sizeFilter || coolingOnly || cameraOnly)) {
            openPanel();
        }
    }, [searchQuery, sizeFilter, coolingOnly, cameraOnly]);

    const panelAnim = useRef(new Animated.Value(0)).current;
    const panelHeight = SCREEN_HEIGHT * 0.6;

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

    const handleMarkerPress = (cabinet: Cabinet) => {
        setSelectedCabinet(cabinet);
        openPanel();
    };

    const getSize = (cell: Cell): 'small' | 'medium' | 'big' => {
        const area = (cell.width ?? 1) * (cell.height ?? 1);
        if (area <= 1) return 'small';
        if (area <= 2) return 'medium';
        return 'big';
    };

    const filteredCabinets = useMemo(() => {
        return cabinets.filter((cabinet) => {
            const addressMatch = cabinet.address.toLowerCase().includes(searchQuery.toLowerCase());

            const cells = cabinetCells.get(cabinet.id) ?? [];

            const hasCooling = !coolingOnly || cells.some((cell) => cell.hasAC);
            const hasCamera = !cameraOnly || cells.some((cell) => cell.isReinforced);

            if (!addressMatch || !hasCooling || !hasCamera) return false;

            if (!sizeFilter) return true;

            return cells.some((cell) => getSize(cell) === sizeFilter);
        });
    }, [searchQuery, sizeFilter, coolingOnly, cameraOnly, cabinets, cabinetCells]);

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1">
                <View className="absolute top-12 left-4 z-10">
                    <Pressable onPress={() => router.back()} className="flex-row items-center space-x-1">
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text className="text-black font-medium">Назад</Text>
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

                <View className="absolute top-6 left-4 right-4 z-10 bg-white p-3 rounded-xl shadow">
                    <TextInput
                        placeholder="Пошук адреси..."
                        value={searchQuery}
                        onChangeText={text => {
                            setSearchQuery(text);
                            setSelectedCabinet(null);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                    />

                    <View className="flex-row justify-between space-x-2">
                        {(['small', 'medium', 'big'] as const).map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => {
                                    setSizeFilter(sizeFilter === size ? null : size);
                                    setSelectedCabinet(null);
                                }}
                                className={`flex-1 px-3 py-2 rounded-md items-center ${
                                    sizeFilter === size ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <Text className={`${sizeFilter === size ? 'text-white' : 'text-black'}`}>
                                    {size[0].toUpperCase() + size.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row justify-between mt-2 space-x-2">
                        <TouchableOpacity
                            onPress={() => {
                                setCoolingOnly(!coolingOnly);
                                setSelectedCabinet(null);
                            }}
                            className={`flex-1 px-3 py-2 rounded-md items-center ${
                                coolingOnly ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                            <Text className={`${coolingOnly ? 'text-white' : 'text-black'}`}>Охолодження</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setCameraOnly(!cameraOnly);
                                setSelectedCabinet(null);
                            }}
                            className={`flex-1 px-3 py-2 rounded-md items-center ${
                                cameraOnly ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                            <Text className={`${cameraOnly ? 'text-white' : 'text-black'}`}>Камера</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View
                    {...panResponder.panHandlers}
                    style={{
                        transform: [{ translateY: panelAnim }],
                        position: 'absolute',
                        bottom: -panelHeight,
                        left: 0,
                        right: 0,
                        height: panelHeight,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 8,
                        zIndex: 10,
                    }}
                >
                    {selectedCabinet ? (
                        <View className="flex-1 px-5 pt-4 pb-2">
                            <Text className="text-lg font-semibold text-gray-900 mb-3">
                                {selectedCabinet.address}
                            </Text>
                            <TouchableOpacity
                                className="bg-blue-600 py-3 rounded-lg items-center mb-2"
                                onPress={() => {
                                    router.push({
                                        pathname: '/cellSelection',
                                        params: { cabinetId: selectedCabinet.id },
                                    });
                                }}
                            >
                                <Text className="text-white font-semibold text-base">Open Detail</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredCabinets}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                const cells = cabinetCells.get(item.id) ?? [];
                                const hasAC = cells.some(cell => cell.hasAC);
                                const hasCamera = cells.some(cell => cell.isReinforced);

                                return (
                                    <TouchableOpacity
                                        onPress={() => handleMarkerPress(item)}
                                        className="border-b border-gray-200 py-3 px-4"
                                    >
                                        <Text className="font-semibold text-black">{item.address}</Text>
                                        <Text className="text-xs text-gray-500">
                                            {hasAC ? 'Охолодження ' : ''}
                                            {hasCamera ? '| Камера' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                    <Pressable onPress={closePanel} className="absolute top-2 right-4">
                        <Text className="text-gray-500 text-sm">⬇ Закрити</Text>
                    </Pressable>
                </Animated.View>


            </View>
        </GestureHandlerRootView>
    );
}


