// Enhanced Cell Selection screen with delivery/reservation option and destination/date logic
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    Modal,
    TouchableOpacity,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Cell, useCabinet } from '@/contexts/cabinetContext';
import { useBookings, Booking } from '@/contexts/bookingsContext';

export type CellSlot = {
    cell: Cell;
    symbol?: string;
    row?: number;
    col?: number;
};

const MAX_COLS = 4;
const MAX_ROWS = 6;
const GUTTER = 8;

export default function BoxGridScreen() {
    const router = useRouter();
    const { cabinetId: idParam } = useLocalSearchParams<{ cabinetId?: string }>();
    const cabinetId = Number(idParam);
    const { cabinetCells, getCabinetCells, cabinets, getCabinets } = useCabinet();
    const { createBooking } = useBookings();
    const [selected, setSelected] = useState<CellSlot | null>(null);
    const [orderType, setOrderType] = useState<'delivery' | 'personal' | null>(null);
    const [destinationId, setDestinationId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
        getCabinetCells(cabinetId);
        getCabinets();
    }, [cabinetId]);

    const raw: CellSlot[] = useMemo(() => {
        const cells = cabinetCells.get(cabinetId) ?? [];
        return cells.map((cell) => ({ cell }));
    }, [cabinetCells, cabinetId]);

    const COLS = MAX_COLS;

    const { cellSlots } = useMemo(() => {
        const slots: CellSlot[] = raw.map((cs) => ({ ...cs }));
        slots.sort((a, b) => (b.cell.width ?? 1) * (b.cell.height ?? 1) - (a.cell.width ?? 1) * (a.cell.height ?? 1));

        const grid: boolean[][] = [];
        const ensureRows = (n: number) => { while (grid.length < n) grid.push(Array(COLS).fill(false)); };
        const fits = (r: number, c: number, w: number, h: number) => {
            ensureRows(r + h);
            if (c + w > COLS || r + h > MAX_ROWS) return false;
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (grid[r + y][c + x]) return false;
            return true;
        };
        const occupy = (r: number, c: number, w: number, h: number) => {
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) grid[r + y][c + x] = true;
        };

        for (const s of slots) {
            const w = s.cell.width ?? 1;
            const h = s.cell.height ?? 1;
            outer: for (let r = 0; r < MAX_ROWS; r++) {
                ensureRows(r + h);
                for (let c = 0; c < COLS; c++) {
                    if (fits(r, c, w, h)) {
                        occupy(r, c, w, h);
                        s.row = r;
                        s.col = c;
                        break outer;
                    }
                }
            }
        }

        return { cellSlots: slots };
    }, [raw]);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const SLOT = (screenWidth - GUTTER * (COLS + 1)) / COLS;
    const SLOT_HEIGHT = (screenHeight - GUTTER * (MAX_ROWS + 1) - 80) / MAX_ROWS;
    const SLOT_SIZE = Math.min(SLOT, SLOT_HEIGHT);

    const handleReserve = async () => {
        if (!selected || !orderType) return;

        const booking:Booking = {
            id: 0,
            cabinetId: selected.cell.cabinet.id,
            cellId: selected.cell.id,
            bookingStatus: 'pending',
            delivery: orderType === 'delivery',
            destinationCabinetId: orderType === 'delivery' ? destinationId : null,
            startDate: startDate,
            endDate: orderType === 'personal' ? endDate : null,
        };

        try {
            await createBooking(booking);
            router.back();
        } catch (err) {
            console.error('Failed to reserve cell:', err);
        }
    };


    return (
        <View className="flex-1 bg-white">
            <View className="absolute top-12 left-4 z-10">
                <Pressable onPress={() => router.replace("/home")} className="flex-row items-center space-x-1">
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text className="text-black font-medium">Назад</Text>
                </Pressable>
            </View>

            <View className="flex-1 items-center justify-center px-2 pt-24">
                <View className="relative" style={{ width: screenWidth, height: SLOT_SIZE * MAX_ROWS + GUTTER * (MAX_ROWS + 1) }}>
                    {cellSlots.map((cs) => {
                        const top = GUTTER + (cs.row ?? 0) * (SLOT_SIZE + GUTTER);
                        const left = GUTTER + (cs.col ?? 0) * (SLOT_SIZE + GUTTER);
                        const width = (cs.cell.width ?? 1) * SLOT_SIZE + GUTTER * ((cs.cell.width ?? 1) - 1);
                        const height = (cs.cell.height ?? 1) * SLOT_SIZE + GUTTER * ((cs.cell.height ?? 1) - 1);
                        const colorStyle = cs.cell.isOccupied
                            ? { backgroundColor: '#ccc' }
                            : { borderColor: '#14b8a6', borderWidth: 2, backgroundColor: 'transparent' };

                        return (
                            <Pressable
                                key={cs.cell.id}
                                onPress={() => !cs.cell.isOccupied && setSelected(cs)}
                                className="absolute rounded-xl justify-center items-center shadow"
                                style={{ top, left, width, height, ...colorStyle }}
                            >
                                <Text className="text-xs font-semibold">
                                    #{cs.cell.id}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <Modal visible={!!selected} transparent animationType="fade">
                <BlurView intensity={40} tint="light" className="flex-1 justify-center items-center px-6">
                    <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
                        <View className="flex-row justify-between items-center mb-4">
                            <Pressable onPress={() => setSelected(null)}>
                                <Ionicons name="close" size={20} color="black" />
                            </Pressable>
                            <Text className="text-lg font-semibold text-black">Інформація про комірку</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-black">📏 Розмір: {selected?.cell.width} × {selected?.cell.height}</Text>
                            <Text className="text-black">⚖️ Вантажопідйомність: {selected?.cell.weightCapacity} кг</Text>
                            <Text className="text-black">📍 Адреса: {selected?.cell.cabinet.address}</Text>
                            <Text className="text-black">❄️ Охолодження: {selected?.cell.hasAC ? 'Так' : 'Ні'}</Text>
                            <Text className="text-black">📷 Камера: {selected?.cell.isReinforced ? 'Так' : 'Ні'}</Text>
                            <Text className="text-black">🔒 Статус: {selected?.cell.isOccupied ? 'Зайнято' : 'Вільно'}</Text>
                        </View>

                        <View className="mt-4">
                            <Text className="font-semibold mb-1">Тип замовлення</Text>
                            <View className="flex-row space-x-3">
                                <TouchableOpacity onPress={() => setOrderType('personal')} className={`px-3 py-2 rounded-md ${orderType === 'personal' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                    <Text className={orderType === 'personal' ? 'text-white' : 'text-black'}>Резервація</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setOrderType('delivery')} className={`px-3 py-2 rounded-md ${orderType === 'delivery' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                    <Text className={orderType === 'delivery' ? 'text-white' : 'text-black'}>Доставка</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {orderType === 'personal' && (
                            <View className="mt-4 space-y-2">
                                <Text>Початок:</Text>
                                <TouchableOpacity onPress={() => setShowStartPicker(true)} className="border px-3 py-2 rounded-md">
                                    <Text>{startDate?.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showStartPicker && (
                                    <DateTimePicker value={startDate} mode="date" display="default" onChange={(_, date) => { setShowStartPicker(false); if (date) setStartDate(date); }} />
                                )}
                                <Text>Кінець:</Text>
                                <TouchableOpacity onPress={() => setShowEndPicker(true)} className="border px-3 py-2 rounded-md">
                                    <Text>{endDate?.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showEndPicker && (
                                    <DateTimePicker value={endDate} mode="date" display="default" onChange={(_, date) => { setShowEndPicker(false); if (date) setEndDate(date); }} />
                                )}
                            </View>
                        )}

                        {orderType === 'delivery' && (
                            <View className="mt-4">
                                <Text className="mb-2">Оберіть точку призначення:</Text>
                                <View className="space-y-1 max-h-40 overflow-scroll">
                                    {cabinets.map((cab) => (
                                        cab.id !== cabinetId && (
                                            <TouchableOpacity
                                                key={cab.id}
                                                className={`px-3 py-2 rounded-md ${destinationId === cab.id ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                onPress={() => setDestinationId(cab.id)}
                                            >
                                                <Text className={destinationId === cab.id ? 'text-white' : 'text-black'}>{cab.address}</Text>
                                            </TouchableOpacity>
                                        )
                                    ))}
                                </View>
                            </View>
                        )}

                        <Pressable
                            className="bg-blue-600 py-3 rounded-full mt-6"
                            onPress={handleReserve}
                            disabled={!orderType || (orderType === 'delivery' && !destinationId)}
                        >
                            <Text className="text-center text-white font-semibold">Забронювати</Text>
                        </Pressable>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
}
