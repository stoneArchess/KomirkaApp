import React, {useState} from "react";
import axios from "axios";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link, useRouter} from "expo-router";
import {useUser} from "@/contexts/userContext";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await login(email, password);
        } catch (e: any) {
            console.log(e.message ?? 'Вхід не вдався');
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
            <Link href={'/auth/register' as Href} className="mb-4 text-blue-300">
                Не маєте акаунту? <Text className="font-bold">Зареєструватися</Text>
            </Link>
            <Text className="text-white text-2xl font-bold mb-6">Вхід</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white mb-4 border border-blue-500"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Пароль"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white mb-4 border border-blue-500"
            />

            <View className="w-full mt-3">
                <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center" onPress={handleLogin}>
                    <Text className="text-white font-semibold">Увійти</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}