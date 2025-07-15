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
            <Text style={styles.title}>Nothing here yet :)</Text>
            <Link href={"/profile" as Href}> Go to Account</Link>
            <Link href={"/auth/register" as Href}> to Register</Link>
            <Link href={"/auth/emailValidation" as Href}> Go to Email Validation</Link>
            <Link href={"/map" as Href}> Go to Map</Link>
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
