import React, {use, useState} from "react";
import axios from "axios";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link, useRouter} from "expo-router";
import {useUser} from "@/contexts/userContext";
import {validatePassword} from "@/app/passwordValidation";


export default function  Register () {
    const [tempUsername, setTempUsername] = useState('');
    const [tempEmail, setTempEmail]     = useState('');
    const [tempPassword, setTempPassword] = useState('');


    const { valid, reasons } = validatePassword(tempPassword);
    const { register } = useUser();
    const [loading,  setLoading]  = useState(false);

    const handleRegister = async () => {
        try {
            if(!valid)
                return;
            setLoading(true);
            await register(tempEmail, tempPassword, tempUsername);
        } catch (e: any) {
            console.log(e.message ?? "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{flex: 1}} />;
    return (
        <View style={styles.container}>
             <Link href={"auth/login" as Href} style={styles.link}>
               Already have an account? <Text style={{ fontWeight: 'bold' }}>Log in</Text>
             </Link>
            <Text style={styles.title}>Sign up</Text>

            <TextInput
                placeholder="Username"
                value={tempUsername}
                onChangeText={setTempUsername}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Email"
                value={tempEmail}
                onChangeText={setTempEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Password"
                value={tempPassword}
                onChangeText={setTempPassword}
                secureTextEntry
                style={styles.input}
            />

            {!valid && tempPassword.length > 0 && (
                <View style={{ marginBottom: 12, paddingLeft: 24,  width: '100%'}}>
                    {reasons.map(r => (
                        <Text key={r} style={styles.unmetReqs}>{r}</Text>
                    ))}
                </View>
            )}


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};