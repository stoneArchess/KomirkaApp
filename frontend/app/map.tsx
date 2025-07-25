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
import { Href, router } from 'expo-router';
import { useCabinet, Cell, Cabinet } from '@/contexts/cabinetContext';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const absoluteFill = StyleSheet.absoluteFill;

export default function MapScreen() {
    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sizeFilter, setSizeFilter] = useState<'малі' | 'середні' | 'великі' | null>(null);
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

    const getSize = (cell: Cell): 'малі' | 'середні' | 'великі' => {
        const area = (cell.width ?? 1) * (cell.height ?? 1);
        if (area <= 1) return 'малі';
        if (area <= 2) return 'середні';
        return 'великі';
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

                <View className="absolute top-6 left-4 right-4 z-10 bg-neutral-900 p-3 rounded-xl shadow border border-gray-700">
                    <TextInput
                        placeholder="Пошук адреси..."
                        placeholderTextColor="#aaa"
                        value={searchQuery}
                        onChangeText={text => {
                            setSearchQuery(text);
                            setSelectedCabinet(null);
                        }}
                        className="border border-gray-600 rounded-md px-3 py-2 mb-2 text-white"
                    />

                    <View className="flex-row justify-between space-x-2">
                        {(['малі', 'середні', 'великі'] as const).map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => {
                                    setSizeFilter(sizeFilter === size ? null : size);
                                    setSelectedCabinet(null);
                                }}
                                className={`flex-1 px-3 py-2 rounded-md items-center ${
                                    sizeFilter === size ? 'bg-gradient-to-r from-blue-600 to-white/20' : 'bg-gray-800'
                                }`}
                                disabled={true}
                            >
                                <Text className={`${sizeFilter === size ? 'text-white font-semibold' : 'text-gray-300'}`}>
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
                                coolingOnly ? 'bg-gradient-to-r from-blue-600 to-white/20' : 'bg-gray-800'
                            }`}
                        >
                            <Text className={`${coolingOnly ? 'text-white font-semibold' : 'text-gray-300'}`}>Охолодження</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setCameraOnly(!cameraOnly);
                                setSelectedCabinet(null);
                            }}
                            className={`flex-1 px-3 py-2 rounded-md items-center ${
                                cameraOnly ? 'bg-gradient-to-r from-blue-600 to-white/20' : 'bg-gray-800'
                            }`}
                        >
                            <Text className={`${cameraOnly ? 'text-white font-semibold' : 'text-gray-300'}`}>Камера</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View
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
                            <Text className="text-lg font-semibold text-white mb-3">
                                {selectedCabinet.address}
                            </Text>
                            <TouchableOpacity
                                className="bg-gradient-to-r from-blue-600 to-white/20 py-3 rounded-lg items-center mb-2"
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
                                        className="border-b border-gray-700 py-3 px-4"
                                    >
                                        <Text className="font-semibold text-white">{item.address}</Text>
                                        <Text className="text-xs text-gray-400">
                                            {hasAC ? 'Охолодження ' : ''}
                                            {hasCamera ? '| Камера' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                    <Pressable onPress={closePanel} className="absolute top-2 right-4">
                        <Text className="text-gray-400 text-sm">⬇ Закрити</Text>
                    </Pressable>
                </Animated.View>

                <BottomMenu />
            </View>
        </GestureHandlerRootView>
    );
}

const MenuItem: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }> = ({ icon, label, onPress }) => (
    <Pressable className="items-center" onPress={onPress}>
        <Ionicons name={icon} size={22} color="#4F9EFF" />
        <Text className="text-[10px] text-gray-300 mt-1">{label}</Text>
    </Pressable>
);

function BottomMenu() {
    function handleMapPress() {
        router.push('map' as Href);
    }
    function handleHomePress() {
        router.push('home' as Href);
    }

    return (
        <View className="absolute bottom-0 inset-x-0 h-16 bg-black border-t border-gray-700 flex-row items-center justify-around">
            <MenuItem icon="map-outline" label="Мапа" onPress={handleMapPress} />
            <MenuItem icon="home-outline" label="Головна" onPress={handleHomePress} />
            <MenuItem icon="person-outline" label="Аккаунт" />
            <MenuItem icon="ellipsis-horizontal" label="Інше" />
        </View>
    );
}
