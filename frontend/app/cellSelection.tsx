import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { useLocalSearchParams } from 'expo-router';
import { styles as styles } from '@/styles/styles';
import {Cell} from "@/contexts/cabinetContext";

export type CellSlot = {
    cell: Cell
    label: string;
    symbol?: string;
    row?: number;
    col?: number;
};

export default function BoxGridScreen() {
    const { boxes: boxesParam } = useLocalSearchParams<{ boxes?: string }>();
    const raw: CellSlot[] = boxesParam ? JSON.parse(boxesParam) : [];


    const modalRef = useRef<Modalize>(null);
    const [selected, setSelected] = useState<Cell | null>(null);
    const totalCells = raw.reduce(
        (s, cs) => s + (cs.cell.width ?? 1) * (cs.cell.height ?? 1),
        0,
    );

    const maxBoxWidth = Math.max(...raw.map((cs) => cs.cell.width ?? 1), 1);

    let COLS = Math.max(maxBoxWidth, Math.ceil(Math.sqrt(totalCells)));
    for (let c = maxBoxWidth; c <= totalCells; c++) {
        if (totalCells % c === 0) {
            COLS = c;
            break;
        }
    }

    useEffect(() => {
        if (raw.some((cs) => (cs.cell.width ?? 1) > COLS)) {
            Alert.alert(
                'Layout error',
                `At least one box is wider than the chosen grid (${COLS} columns).`,
            );
        }
    }, [COLS, raw]);


    if (raw.some((cs) => (cs.cell.width ?? 1) > COLS)) return null;

    const cellSlots = JSON.parse(JSON.stringify(raw)) as CellSlot[];

    const grid: boolean[][] = [];

    const ensureRows = (rows: number) => {
        while (grid.length < rows) grid.push(Array(COLS).fill(false));
    };

    const fits = (r: number, c: number, w: number, h: number) => {
        ensureRows(r + h);
        if (c + w > COLS) return false;
        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++) if (grid[r + y][c + x]) return false;
        return true;
    };

    const occupy = (r: number, c: number, w: number, h: number) => {
        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++) grid[r + y][c + x] = true;
    };

    for (const cs of cellSlots) {
        const w = cs.width ?? 1;
        const h = cs.height ?? 1;
        let placed = false;

        outer: for (let r = 0; ; r++) {
            ensureRows(r + h);
            for (let c = 0; c < COLS; c++) {
                if (fits(r, c, w, h)) {
                    occupy(r, c, w, h);
                    Object.assign(cs, { row: r, col: c });
                    placed = true;
                    break outer;
                }
            }
        }

        if (!placed) {
            Alert.alert('Layout error', `Could not place box ${cs.cell.label}.`);
            return null;
        }
    }

    const rowsUsed = grid.length;

    const GUTTER = 8;
    const SLOT =
        (Dimensions.get('window').width - GUTTER * (COLS + 1)) / COLS;
    const BOARD_HEIGHT = rowsUsed * SLOT + GUTTER * (rowsUsed + 1);
    const BOARD_WIDTH = Dimensions.get('window').width;

    const open = (box: Cell) => {
        setSelected(box);
        modalRef.current?.open();
    };

    return (
        <GestureHandlerRootView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
                    {cellSlots.map((b) => {
                        const top = GUTTER + (b.row! * (SLOT + GUTTER));
                        const left = GUTTER + (b.col! * (SLOT + GUTTER));
                        const width =
                            (b.width ?? 1) * SLOT + GUTTER * ((b.width ?? 1) - 1);
                        const height =
                            (b.height ?? 1) * SLOT + GUTTER * ((b.height ?? 1) - 1);
                        const bg = b.occupied ? '#d1d5db' : b.color || '#14b8a6';

                        return (
                            <Pressable
                                key={b.id}
                                onPress={() => open(b)}
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
                                <Text style={styles.cellLabel}>{b.label}</Text>
                                {b.symbol && <Text style={styles.symbol}>{b.symbol}</Text>}
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
                            Occupied: {selected.occupied ? 'Yes' : 'No'}
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
                    </View>
                )}
            </Modalize>
        </GestureHandlerRootView>
    );
}

