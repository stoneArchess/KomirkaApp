import React, {useState} from "react";
import axios from "axios";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link, useRouter} from "expo-router";
import {useUser} from "@/contexts/userContext";


export default function  Login () {
    const [email, setEmail]     = useState('');
    const [password, setPassword] = useState('');

    const { login } = useUser();
    const [loading,  setLoading]  = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await login(email, password);
        } catch (e: any) {
            console.log(e.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{flex: 1}} />;
    return (
        <View style={styles.container}>
            <Link href={"/auth/register" as Href} style={styles.link}>
                Don&apos;t have an account? <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
            </Link>
            <Text style={styles.title}>Log in</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};