import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Button,
    KeyboardAvoidingView,
    Platform, Alert, ActivityIndicator,
} from 'react-native';
import {router} from "expo-router";
import {useUser} from "@/contexts/userContext";

const CODE_LENGTH = 6;

export default function EmailValidation() {
    const [code, setCode] = useState('');
    const inputRef = useRef<TextInput | null>(null);
    const [loading, setLoading] = useState(false);
    const {verify} = useUser();

    const handleChange = (text: string) => {
        const sanitized = text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH);
        setCode(sanitized);
    };

    const focusInput = () => inputRef.current?.focus();

    const handleSubmit = async () => {
        if (code.length !== CODE_LENGTH) return;

        setLoading(true);

        try {
            if(code.length !== CODE_LENGTH)
                return;

            setLoading(true);
            await verify(code);

        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };




    const boxes = [...Array(CODE_LENGTH)].map((_, i) => {
        const digit = code[i] || '';
        const isFocused = i === code.length;          // next empty box
        const isFilled  = i < code.length;

        return (
            <View
                key={i}
                style={[
                    styles.box,
                    isFocused && styles.boxFocused,
                    isFilled && styles.boxFilled,
                ]}
            >
                <Text style={styles.digit}>{digit}</Text>
            </View>
        );
    });

    if (loading) return <ActivityIndicator style={{flex: 1}} />;
    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            style={styles.container}
        >
            <Text style={styles.title}>Enter the 6‑digit code we sent you</Text>

            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                style={styles.hiddenInput}
                autoFocus
                caretHidden
            />

            <Pressable style={styles.row} onPress={focusInput}>
                {boxes}
            </Pressable>

            <Button
                title="Verify"
                onPress={handleSubmit}
                disabled={code.length !== CODE_LENGTH}
            />
        </KeyboardAvoidingView>
    );
}

const BOX_SIZE = 48;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 18, marginBottom: 32, textAlign: 'center' },

    /* hidden input sits on top but invisible (opacity 0) */
    hiddenInput: { position: 'absolute', opacity: 0 },

    row: { flexDirection: 'row', justifyContent: 'space-between' },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        marginHorizontal: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bbb',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    boxFocused: { borderColor: '#007AFF' },
    boxFilled:  { borderColor: '#007AFF', backgroundColor: '#e6f0ff' },
    digit: { fontSize: 24, fontWeight: '600' },
});