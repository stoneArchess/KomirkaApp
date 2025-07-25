import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Href, Link } from 'expo-router';
import { useUser } from '@/contexts/userContext';
import { validatePassword } from '@/passwordValidation';

export default function Register() {
    const [tempUsername, setTempUsername] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const { valid, reasons } = validatePassword(tempPassword);
    const { register } = useUser();
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        try {
            if (!valid) return;
            setLoading(true);
            await register(tempEmail, tempPassword, tempUsername);
        } catch (e: any) {
            console.log(e.message ?? 'Реєстрація не вдалася');
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );

    return (
        <View className="flex-1 bg-black justify-center items-center px-6 pb-10 shadow-blue-500/20 shadow-2xl">
            <Link href={'auth/login' as Href} className="mb-4 text-blue-300">
                Вже маєте акаунт? <Text className="font-bold">Увійти</Text>
            </Link>
            <Text className="text-white text-2xl font-bold mb-6">Реєстрація</Text>

            <TextInput
                placeholder="Ім'я користувача"
                placeholderTextColor="#aaa"
                value={tempUsername}
                onChangeText={setTempUsername}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white mb-4 border border-blue-500"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={tempEmail}
                onChangeText={setTempEmail}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white mb-4 border border-blue-500"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Пароль"
                placeholderTextColor="#aaa"
                value={tempPassword}
                onChangeText={setTempPassword}
                secureTextEntry
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white mb-4 border border-blue-500"
            />

            {!valid && tempPassword.length > 0 && (
                <View className="mb-3 pl-6 w-full">
                    {reasons.map((r) => (
                        <Text key={r} className="text-red-400 text-sm">
                            {r}
                        </Text>
                    ))}
                </View>
            )}

            <View className="w-full mt-3">
                <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center" onPress={handleRegister}>
                    <Text className="text-white font-semibold">Зареєструватися</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}