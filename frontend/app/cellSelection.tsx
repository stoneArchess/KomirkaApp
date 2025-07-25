// CellSelection.tsx — modern dark UI with gradients and glowing outlines
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    Modal,
    TouchableOpacity,
    Platform,
    ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import {useRouter, useLocalSearchParams, router} from 'expo-router';
import { Cell, useCabinet } from '@/contexts/cabinetContext';
import { useBookings, Booking } from '@/contexts/bookingsContext';
import {NewBooking} from "@/app/deliverycabinetpicker";

export type CellSlot = {
    cell: Cell;
    symbol?: string;
    row?: number;
    col?: number;
};

const MAX_COLS = 4;
const MAX_ROWS = 6;
const GUTTER = 8;

export default function CellSelectionScreen() {
    const router = useRouter();
    const { cabinetId: idParam } = useLocalSearchParams<{ cabinetId?: string }>();
    const cabinetId = Number(idParam);
    const { cabinetCells, getCabinetCells, cabinets, getCabinets } = useCabinet();
    const { createBooking } = useBookings();

    const [selected, setSelected] = useState<CellSlot | null>(null);
    const [orderType, setOrderType] = useState<'delivery' | 'personal' | null>(null);
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

        const booking: NewBooking = {
            cellId: selected.cell.id,
            destinationCabinetId: null,
            startDate: startDate,
            endDate: endDate,
        };

        try {
            await createBooking(booking);
            router.back();
        } catch (err) {
            console.error('Failed to reserve cell:', err);
        }
    };

    function handleDelivery() {
      console.log("here")
        if (!selected || !orderType) return;

        router.push({
            pathname: '/deliverycabinetpicker',
            params: { cabinetId: cabinetId, cellId: selected.cell.id },
        });
    }

    return (
        <View className="flex-1 bg-[#0b0f1c]">
            <View className="absolute top-12 left-4 z-10">
                <Pressable onPress={() => router.replace('/home')} className="flex-row items-center space-x-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text className="text-white text-base font-semibold">Назад</Text>
                </Pressable>
            </View>

            <View className="flex-1 items-center justify-center px-2 pt-24">
                <View className="relative" style={{ width: screenWidth, height: SLOT_SIZE * MAX_ROWS + GUTTER * (MAX_ROWS + 1) }}>
                    {cellSlots.map((cs) => {
                        const top = GUTTER + (cs.row ?? 0) * (SLOT_SIZE + GUTTER);
                        const left = GUTTER + (cs.col ?? 0) * (SLOT_SIZE + GUTTER);
                        const width = (cs.cell.width ?? 1) * SLOT_SIZE + GUTTER * ((cs.cell.width ?? 1) - 1);
                        const height = (cs.cell.height ?? 1) * SLOT_SIZE + GUTTER * ((cs.cell.height ?? 1) - 1);

                        const isSelected = selected?.cell.id === cs.cell.id;
                        const occupied = cs.cell.isOccupied;

                        let bgColor = 'transparent';
                        let borderColor = 'rgba(0, 172, 255, 0.5)';
                        let textColor = '#fff';

                        if (isSelected) {
                            bgColor = 'linear-gradient(145deg, #007bff, #00d4ff)';
                            borderColor = '#00d4ff';
                        } else if (occupied) {
                            bgColor = '#2c2f3a';
                            textColor = '#777';
                        }

                        return (
                            <Pressable
                                key={cs.cell.id}
                                onPress={() => !occupied && setSelected(cs)}
                                style={{ top, left, width, height, position: 'absolute', borderWidth: 2, borderColor, backgroundColor: bgColor, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={{ color: textColor, fontSize: 12, fontWeight: '600' }}>#{cs.cell.id}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <Modal visible={!!selected} transparent animationType="slide">
                <View className="flex-1 justify-end">
                    <BlurView intensity={40} tint="dark" className="rounded-t-3xl p-6 bg-[#121829]/90">
                        <View className="items-center mb-4">
                            <Text className="text-white text-xl font-bold">#{selected?.cell.id}</Text>
                        </View>
                        <ScrollView className="space-y-2 max-h-96">
                            <Text className="text-white">📏 Розмір: {selected?.cell.width} × {selected?.cell.height}</Text>
                            <Text className="text-white">⚖️ Вантажопідйомність: {selected?.cell.weightCapacity} кг</Text>
                            <Text className="text-white">📍 Адреса: {selected?.cell.cabinet.address}</Text>
                            <Text className="text-white">❄️ Охолодження: {selected?.cell.hasAC ? 'Так' : 'Ні'}</Text>
                            <Text className="text-white">📷 Камера: {selected?.cell.isReinforced ? 'Так' : 'Ні'}</Text>
                            <Text className="text-white">🔒 Статус: {selected?.cell.isOccupied ? 'Зайнято' : 'Вільно'}</Text>

                            <View className="mt-4">
                                <Text className="text-white font-semibold mb-1">Тип замовлення</Text>
                                <View className="flex-row space-x-3">
                                    <TouchableOpacity onPress={() => setOrderType('personal')} className={`px-3 py-2 rounded-md ${orderType === 'personal' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                        <Text className={orderType === 'personal' ? 'text-white' : 'text-gray-200'}>Резервація</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setOrderType('delivery')} className={`px-3 py-2 rounded-md ${orderType === 'delivery' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                        <Text className={orderType === 'delivery' ? 'text-white' : 'text-gray-200'}>Доставка</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {orderType === 'personal' && (
                                <View className="mt-4 space-y-2">
                                    <Text className="text-white">Початок:</Text>
                                    <TouchableOpacity onPress={() => setShowStartPicker(true)} className="border border-gray-500 px-3 py-2 rounded-md">
                                        <Text className="text-white">{startDate?.toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                    {showStartPicker && (
                                        <DateTimePicker value={startDate} mode="date" display="default" onChange={(_, date) => { setShowStartPicker(false); if (date) setStartDate(date); }} />
                                    )}
                                    <Text className="text-white">Кінець:</Text>
                                    <TouchableOpacity onPress={() => setShowEndPicker(true)} className="border border-gray-500 px-3 py-2 rounded-md">
                                        <Text className="text-white">{endDate?.toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                    {showEndPicker && (
                                        <DateTimePicker value={endDate} mode="date" display="default" onChange={(_, date) => { setShowEndPicker(false); if (date) setEndDate(date); }} />
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        <Pressable
                            className="bg-blue-600 py-3 rounded-full mt-6"
                            onPress={orderType === 'delivery' ? handleDelivery : handleReserve}
                            disabled={
                                !orderType ||
                                (orderType === 'personal' && (!startDate || !endDate))
                            }
                        >
                            <Text className="text-center text-white font-semibold">
                                {orderType === 'delivery' ? 'Замовити доставку' : 'Забронювати'}
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => setSelected(null)} className="absolute top-3 right-3">
                            <Ionicons name="close" size={24} color="white" />
                        </Pressable>
                    </BlurView>
                </View>
            </Modal>
        </View>
    );
}
