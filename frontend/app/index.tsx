import React, {useEffect, useState} from "react";


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from "@/app/auth/register";
import Login from "@/app/auth/login";
import {Text, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link} from "expo-router";

export default function Index() {
    return (
        <View style={styles.container}>
            <View className="bg-red-500 h-10" />
            <Text style={styles.title}>Nothing here yet :)</Text>
            <Link href={"/profile" as Href}> Go to Account</Link>
            <Link href={"/auth/register" as Href}> to Register</Link>
            <Link href={"/auth/emailValidation" as Href}> Go to Email Validation</Link>
            <Link href={"/home" as Href}> Go to Home menu</Link>
            <Link href={"/map" as Href}> Go to Map</Link>
            <Link href={"/WalletScreen" as Href}> Go to Wallet</Link>
            <Link href={"/AccountScreen" as Href}> Go to Screen</Link>
            <Link href={"/profileTEST" as Href}> Go to Profile(Test)</Link>
            <Link
                href={{
                        pathname: '/cellSelection',
                        params: {
                            cabinetId: 5,
                        },
                    }}
                > Go to Cell Selection</Link>
        </View>
    );
}
