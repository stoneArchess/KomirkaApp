import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    View,
    Text,
    Pressable,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet, Button,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { useLocalSearchParams } from 'expo-router';
import { styles as styles } from '@/styles/styles';
import {Cell, useCabinet} from "@/contexts/cabinetContext";

export type CellSlot = {
    cell: Cell
    label: string;
    symbol?: string;
    row?: number;
    col?: number;
};

export default function BoxGridScreen() {
    const { cabinetId: idParam } = useLocalSearchParams<{ cabinetId?: string }>();

    const cabinetId = Number(idParam);
    console.log("cabinet id:", cabinetId);
    const { cabinetCells, getCabinetCells, allCells, changeOccupancy } = useCabinet();

    const modalRef = useRef<Modalize>(null);
    const [selected, setSelected] = useState<CellSlot | null>(null);

    useEffect(() => {

        const fetchCells = async () => {
            await getCabinetCells(cabinetId);
            const cells = cabinetCells.get(cabinetId);
            console.log("cabinet cells:", cells ? cells.length : 0);
        };

        fetchCells();
    }, []);

    const raw: CellSlot[] = useMemo(() => {
        const cells = cabinetCells.get(cabinetId) ?? [];
        return cells.map((cell, i) => ({ cell, label: `C${i + 1}` }));
    }, [cabinetCells, cabinetId]);

    const totalCells = raw.reduce(
        (s, cs) => s + (cs.cell.width ?? 1) * (cs.cell.height ?? 1),
        0
    );

    const maxBoxWidth = Math.max(...raw.map((cs) => cs.cell.width ?? 1), 1);

    const divisors: number[] = [];
    for (let d = maxBoxWidth; d <= totalCells; d++) {
        if (totalCells % d === 0) divisors.push(d);
    }

    let COLS = divisors[0];
    for (const d of divisors) {
        const rows        = totalCells / d;
        const bestRows    = totalCells / COLS;
        const diff        = Math.abs(d       - rows);
        const bestDiff    = Math.abs(COLS    - bestRows);

        if (diff < bestDiff || (diff === bestDiff && d > COLS)) {
            COLS = d;
        }
    }

    useEffect(() => {
        if (raw.some((cs) => (cs.cell.width ?? 1) > COLS)) {
            Alert.alert(
                "Layout error",
                `At least one box is wider than the chosen grid (${COLS} columns).`
            );
        }
    }, [COLS, raw]);

    const open = (box: CellSlot) => {
        setSelected(box);
        modalRef.current?.open();
    };

    const { cellSlots, rowsUsed } = useMemo(() => {
        const slots: CellSlot[] = raw.map((cs) => ({ ...cs })); // clone

        slots.sort(
            (a, b) =>
                (b.cell.width ?? 1) * (b.cell.height ?? 1) -
                (a.cell.width ?? 1) * (a.cell.height ?? 1),
        );

        const grid: boolean[][] = [];
        const ensureRows = (n: number) => {
            while (grid.length < n) grid.push(Array(COLS).fill(false));
        };
        const fits = (r: number, c: number, w: number, h: number) => {
            ensureRows(r + h);
            if (c + w > COLS) return false;
            for (let y = 0; y < h; y++)
                for (let x = 0; x < w; x++)
                    if (grid[r + y][c + x]) return false;
            return true;
        };
        const occupy = (r: number, c: number, w: number, h: number) => {
            for (let y = 0; y < h; y++)
                for (let x = 0; x < w; x++) grid[r + y][c + x] = true;
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
        <GestureHandlerRootView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
                    {cellSlots.map((cs) => {
                        const top = GUTTER + (cs.row! * (SLOT + GUTTER));
                        const left = GUTTER + (cs.col! * (SLOT + GUTTER));
                        const width =
                            (cs.cell.width ?? 1) * SLOT + GUTTER * ((cs.cell.width ?? 1) - 1);
                        const height =
                            (cs.cell.height ?? 1) * SLOT + GUTTER * ((cs.cell.height ?? 1) - 1);
                        const bg = cs.cell.isOccupied ? '#d1d5db' : '#14b8a6';
                        return (
                            <Pressable
                                key={cs.cell.id}
                                onPress={() => open(cs)}
                                style={[
                                    styles.box,
                                    {
                                        position: 'absolute',
                                        top,
                                        left,
                                        width,
                                        height,
                                        backgroundColor: bg,
                                    },
                                ]}
                            >
                                <Text style={styles.cellLabel}>{cs.label}</Text>
                                {cs.symbol && <Text style={styles.symbol}>{cs.symbol}</Text>}
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <Modalize ref={modalRef} snapPoint={240}>
                {selected && (
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selected.label}</Text>
                        {selected.symbol && (
                            <Text style={styles.modalSymbol}>{selected.symbol}</Text>
                        )}
                        <Text style={styles.modalText}>
                            Occupied: {selected.cell.isOccupied ? 'Yes' : 'No'}
                        </Text>
                        {Object.entries(selected).map(([k, v]) =>
                            ['id', 'label', 'symbol', 'occupied', 'color'].includes(k)
                                ? null
                                : (
                                    <Text key={k} style={styles.modalText}>
                                        {k}: {String(v)}
                                    </Text>
                                ),
                        )}
                        <Pressable
                            onPress={() => changeOccupancy(selected.cell.id, selected.cell.isOccupied)}
                            style={styles.button} >
                            <Text style={styles.cellLabel}>Order</Text>

                        </Pressable>
                    </View>
                )}
            </Modalize>
        </GestureHandlerRootView>
    );
}

