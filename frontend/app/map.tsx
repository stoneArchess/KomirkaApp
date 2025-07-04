
import { Stack } from 'expo-router';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import { View, Text, StyleSheet, Animated,TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import {styles} from "@/styles/styles";
import {useCabinet, Cell, Cabinet} from "@/contexts/cabinetContext";

export default function MapScreen() {
    const snapPoints = useMemo(() => ['15%', '40%'], []);
    console.log(snapPoints);
    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>();

    const {getCabinets, cabinetCells, cabinets} = useCabinet();

    useEffect(() => {
        getCabinets();
        console.log("cabinets:", cabinets.length);
    }, []);


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
            setSelectedCabinet(null);
        });
    };

    const handleMarkerPress = (poi: Cabinet) => {
        setSelectedCabinet(poi);
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
                    {cabinets.map((cabinet) => (
                        <Marker
                            key={cabinet.id}
                            coordinate={{latitude: Number(cabinet.latitude),longitude:  Number(cabinet.longitude)}}
                            title={cabinet.address}
                            onPress={() => handleMarkerPress(cabinet)}
                        />
                    ))}
                </MapView>

                {selectedCabinet && (
                    <Animated.View
                        style={[
                            {
                                top: panelAnim,
                            },s.panel
                        ]}
                    >
                        <Text style={s.title}>{selectedCabinet.address}</Text>

                        <TouchableOpacity style={s.button} onPress={() => {
                            router.push({
                                pathname: '/cellSelection',
                                params: {
                                    cabinetId: selectedCabinet.id,
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