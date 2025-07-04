
import { Stack } from 'expo-router';

import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated,TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import {styles} from "@/styles/styles";
import {Cell} from "@/app/cellSelection";
import {useCabinet} from "@/contexts/cabinetContext";

export type Poi = {
    id: number,
    boxes: Cell[],
    address: string,
    coordinate: { latitude: number, longitude: number },
};

const pois: Poi[] = [
    {
        id: 1,
        address: 'street name n2',
        coordinate: { latitude:  50.06092232009283, longitude: 14.47394388197166 },
        boxes: [
            { id: 'c2', label: 'Middle', width: 1, height: 1, symbol: "❄️" },
            { id: 'c3', label: 'corner 1', width: 4, height: 1 },

            { id: 'c4', label: 'Middle Left', width: 2, height: 1 },
            { id: 'c5', label: 'Middle', width: 1, height: 1 },
            { id: 'c6', label: 'Mid right', width: 2, height: 1 },

            { id: 'c7', label: 'corner 3', width: 2, height: 2 },
            { id: 'c8', label: 'bott0m', width: 1, height: 2, symbol: "❄️"  },
            { id: 'c9', label: 'corner 4', width: 2, height: 2 },
        ],
    },
    {
        id: 2,
        address: 'street name n5',
        coordinate: { latitude: 50.05639464914488, longitude: 14.488102545725791 },
        boxes: [
            { id: 'c1', label: 'corner 1', width: 4, height: 1, symbol: "❄️"  },
            { id: 'c11', label: 'Middle', width: 1, height: 1 },
            { id: 'c2', label: 'Middle', width: 1, height: 1, symbol: "❄️" },
            { id: 'c3', label: 'corner 1', width: 4, height: 1 },

            { id: 'c4', label: 'Middle Left', width: 2, height: 1 },
            { id: 'c5', label: 'Middle', width: 1, height: 1 },
            { id: 'c6', label: 'Mid right', width: 2, height: 1 },

            { id: 'c7', label: 'corner 3', width: 2, height: 2 },
            { id: 'c8', label: 'bott0m', width: 1, height: 2, symbol: "❄️"  },
            { id: 'c9', label: 'corner 4', width: 2, height: 2 },
        ],
    },
    {
        id: 3,
        boxes: [
            { id: 'c1', label: 'corner 1', width: 4, height: 1, symbol: "❄️"  },
            { id: 'c11', label: 'Middle', width: 1, height: 1 },
            { id: 'c2', label: 'Middle', width: 1, height: 1, symbol: "❄️" },
            { id: 'c3', label: 'corner 1', width: 4, height: 1 },

            { id: 'c4', label: 'Middle Left', width: 2, height: 1 },
            { id: 'c5', label: 'Middle', width: 1, height: 1 },
            { id: 'c6', label: 'Mid right', width: 2, height: 1 },

            { id: 'c31', label: 'corner 1', width: 3, height: 1, symbol: "❄️"  },
            { id: 'c32', label: 'corner 1', width: 2, height: 1 },

            { id: 'c7', label: 'corner 3', width: 2, height: 2 },
            { id: 'c8', label: 'bott0m', width: 1, height: 2, symbol: "❄️"  },
            { id: 'c9', label: 'corner 4', width: 2, height: 2 },
        ],
        address: 'street street n1',
        coordinate: { latitude: 50.05584162188565, longitude: 14.468560359631688 },
    },
];

export default function MapScreen() {
    const snapPoints = useMemo(() => ['15%', '40%'], []);
    console.log(snapPoints);
    const [selectedPoi, setSelectedPoi] = useState<Poi | null>();

    const {getCabinets, getAllCells} = useCabinet();



    const panelAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const openPanel = () => {
        Animated.timing(panelAnim, {
            toValue: SCREEN_HEIGHT * 0.6,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closePanel = () => {
        Animated.timing(panelAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setSelectedPoi(null);
        });
    };

    const handleMarkerPress = (poi: Poi) => {
        setSelectedPoi(poi);
        openPanel();
    };

    const handleClosePress = () => {
        closePanel();
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={{
                        latitude: 50.05905600367985,
                        longitude: 14.479300486699936,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {pois.map((poi) => (
                        <Marker
                            key={poi.id}
                            coordinate={poi.coordinate}
                            title={poi.address}
                            onPress={() => handleMarkerPress(poi)}
                        />
                    ))}
                </MapView>

                {selectedPoi && (
                    <Animated.View
                        style={[
                            {
                                top: panelAnim,
                            },s.panel
                        ]}
                    >
                        <Text style={s.title}>{selectedPoi.address}</Text>

                        <TouchableOpacity style={s.button} onPress={() => {
                            router.push({
                                pathname: '/cellSelection',
                                params: {
                                    boxes: JSON.stringify(selectedPoi?.boxes),
                                },
                            })
                        }}>
                            <Text style={s.buttonText}>Open Detail</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.button} onPress={handleClosePress}>
                            <Text style={s.buttonText}>Close</Text>
                        </TouchableOpacity>

                    </Animated.View>
                )}
            </View>
        </GestureHandlerRootView>
    );
}

const s = StyleSheet.create({
    panel: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 10,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#222',
    },

    button: {
        marginTop: 12,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});