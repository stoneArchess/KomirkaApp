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
            <Link href={"/AccountScreen"}>Account</Link>
            <Link href={"/WalletScreen"}>Wallet</Link>
            <Link href={"/profile"}>Profile</Link>
        </View>
    );
}
