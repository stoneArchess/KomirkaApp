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
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useCabinet, Cell, Cabinet } from '@/contexts/cabinetContext';
import { useBookings} from "@/contexts/bookingsContext";
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

const absoluteFill = StyleSheet.absoluteFill;

export default function MapScreen() {
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<'small' | 'medium' | 'big' | null>(null);
  const [coolingOnly, setCoolingOnly] = useState(false);
  const [cameraOnly, setCameraOnly] = useState(false);
  const [orderType, setOrderType] = useState<'personal' | 'delivery' | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const { getCabinets, cabinetCells, cabinets } = useCabinet();
  const { createBooking } = useBookings();

  useEffect(() => {
    getCabinets();
  }, []);

  useEffect(() => {
    if (!selectedCabinet && (searchQuery || sizeFilter || coolingOnly || cameraOnly)) {
      openPanel();
    }
  }, [searchQuery, sizeFilter, coolingOnly, cameraOnly, selectedCabinet]);

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
    setOrderType(null);
    openPanel();
  };

  const getSize = (cell: Cell): 'small' | 'medium' | 'big' => {
    const area = (cell.width ?? 1) * (cell.height ?? 1);
    if (area <= 1) return 'small';
    if (area <= 4) return 'medium';
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

  const handleBooking = async () => {
    if (!selectedCabinet) return;

    const booking = {
      id: 0,
      cabinetId: selectedCabinet.id,
      cellId: 0,
      bookingStatus: 'pending',
      delivery: orderType === 'delivery',
      destinationCabinetId: orderType === 'delivery' ? 1 : null,
    };

    try {
      await createBooking(booking);
      router.push({ pathname: '/cellSelection', params: { cabinetId: selectedCabinet.id } });
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return (
      <GestureHandlerRootView className="flex-1">

        <TouchableOpacity
            className="bg-blue-600 py-3 rounded-lg items-center mt-4"
            onPress={handleBooking}
        >
          <Text className="text-white font-semibold text-base">Продовжити</Text>
        </TouchableOpacity>

      </GestureHandlerRootView>
  );
}
