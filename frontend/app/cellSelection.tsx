import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    ScrollView,
    Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Cell, useCabinet } from '@/contexts/cabinetContext';
import { Ionicons } from '@expo/vector-icons';

export type CellSlot = {
    cell: Cell;
    symbol?: string;
    row?: number;
    col?: number;
};

export default function BoxGridScreen() {
    const { cabinetId: idParam } = useLocalSearchParams<{ cabinetId?: string }>();
    const cabinetId = Number(idParam);
    const { cabinetCells, getCabinetCells, changeOccupancy } = useCabinet();
    const [selected, setSelected] = useState<CellSlot | null>(null);

    useEffect(() => {
        getCabinetCells(cabinetId);
        console.log(cabinetCells);
    }, [cabinetId]);

    const raw: CellSlot[] = useMemo(() => {
        const cells = cabinetCells.get(cabinetId) ?? [];
        return cells.map((cell, i) => ({cell}));
    }, [cabinetCells, cabinetId]);

    const totalCells = raw.reduce((s, cs) => s + (cs.cell.width ?? 1) * (cs.cell.height ?? 1), 0);
    const maxBoxWidth = Math.max(...raw.map((cs) => cs.cell.width ?? 1), 1);
    const divisors: number[] = [];
    for (let d = maxBoxWidth; d <= totalCells; d++) if (totalCells % d === 0) divisors.push(d);
    let COLS = divisors[0];
    for (const d of divisors) {
        const rows = totalCells / d;
        const bestRows = totalCells / COLS;
        const diff = Math.abs(d - rows);
        const bestDiff = Math.abs(COLS - bestRows);
        if (diff < bestDiff || (diff === bestDiff && d > COLS)) COLS = d;
    }

    const { cellSlots, rowsUsed } = useMemo(() => {
        const slots: CellSlot[] = raw.map((cs) => ({ ...cs }));
        slots.sort((a, b) => (b.cell.width ?? 1) * (b.cell.height ?? 1) - (a.cell.width ?? 1) * (a.cell.height ?? 1));

        const grid: boolean[][] = [];
        const ensureRows = (n: number) => { while (grid.length < n) grid.push(Array(COLS).fill(false)); };
        const fits = (r: number, c: number, w: number, h: number) => {
            ensureRows(r + h);
            if (c + w > COLS) return false;
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (grid[r + y][c + x]) return false;
            return true;
        };
        const occupy = (r: number, c: number, w: number, h: number) => {
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) grid[r + y][c + x] = true;
        };

        for (const s of slots) {
            const w = s.cell.width ?? 1;
            const h = s.cell.height ?? 1;
            outer: for (let r = 0; ; r++) {
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
        return { cellSlots: slots, rowsUsed: grid.length };
    }, [raw, COLS]);

    const GUTTER = 8;
    const SLOT = (Dimensions.get('window').width - GUTTER * (COLS + 1)) / COLS;
    const BOARD_WIDTH = Dimensions.get('window').width;
    const BOARD_HEIGHT = rowsUsed * SLOT + GUTTER * (rowsUsed + 1);

    return (
        <View className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 16 }}>
                <View style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
                    {cellSlots.map((cs) => {
                        const top = GUTTER + cs.row! * (SLOT + GUTTER);
                        const left = GUTTER + cs.col! * (SLOT + GUTTER);
                        const width = (cs.cell.width ?? 1) * SLOT + GUTTER * ((cs.cell.width ?? 1) - 1);
                        const height = (cs.cell.height ?? 1) * SLOT + GUTTER * ((cs.cell.height ?? 1) - 1);
                        const bg = cs.cell.isOccupied ? 'bg-gray-300' : 'bg-teal-500';
                        return (
                            <Pressable
                                key={cs.cell.id}
                                onPress={() => setSelected(cs)}
                                className={`absolute ${bg} rounded-xl justify-center items-center shadow`}
                                style={{ top, left, width, height }}
                            >
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <Modal visible={!!selected} transparent animationType="fade">
                <BlurView intensity={40} tint="light" className="flex-1 justify-center items-center px-6">
                    <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
                        <View className="flex-row justify-between items-center mb-4">
                            <Pressable onPress={() => setSelected(null)}>
                                <Ionicons name="close" size={20} color="black" />
                            </Pressable>
                        </View>
                        <Text className="text-black mb-2">Occupied: {selected?.cell.isOccupied ? 'Yes' : 'No'}</Text>
                        <Text className="text-black mb-4">
                            Size: {selected?.cell.width}×{selected?.cell.height} / {selected?.cell.weightCapacity}kg
                        </Text>
                        <Pressable
                            className="bg-blue-600 py-3 rounded-full"
                            onPress={() => {
                                if (selected) changeOccupancy(selected.cell.id, selected.cell.isOccupied);
                            }}
                        >
                            <Text className="text-center text-white font-semibold">Забронювати</Text>
                        </Pressable>
                    </View>
                </BlurView>
            </Modal>

            <View className="h-16 bg-white border-t border-gray-200 flex-row items-center justify-around">
                <BottomButton icon="home-outline" label="Головна" />
                <BottomButton icon="map-outline" label="Мапа" />
                <BottomButton icon="qr-code-outline" label="QR" />
                <BottomButton icon="gift-outline" label="Бонуси" />
                <BottomButton icon="person-outline" label="Профіль" />
            </View>
        </View>
    );
}

const BottomButton = ({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) => (
    <Pressable className="items-center" >
        <Ionicons name={icon} size={20} color="#555" />
        <Text className="text-[10px] text-gray-600 mt-1">{label}</Text>
    </Pressable>
);
