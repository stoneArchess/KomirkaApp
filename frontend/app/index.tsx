import React, {useEffect, useState} from "react";


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from "@/app/auth/register";
import Login from "@/app/auth/login";
import {Text, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link} from "expo-router";
import {Cell} from "@/app/cellSelection";

const Stack = createNativeStackNavigator();
const boxes: Cell[] = [
    { id: 'c1', label: 'corner 1', width: 4, height: 1, symbol: "❄️"  },
    { id: 'c11', label: 'Middle', width: 1, height: 1 },
    { id: 'c2', label: 'Middle', width: 1, height: 1, symbol: "❄️" },
    { id: 'c3', label: 'corner 1', width: 4, height: 1 },

    { id: 'c4', label: 'Middle Left', width: 2, height: 1 },
    { id: 'c5', label: 'Middle', width: 1, height: 1 },
    { id: 'c6', label: 'Mid right', width: 2, height: 1 },

    { id: 'c31', label: 'corner 1', width: 3, height: 1, symbol: "❄️"  },
    { id: 'c32', label: 'corner 1', width: 2, height: 1 },

    { id: 'c7', label: 'corner 3', width: 2, height: 2 },
    { id: 'c8', label: 'bott0m', width: 1, height: 2, symbol: "❄️"  },
    { id: 'c9', label: 'corner 4', width: 2, height: 2 },

];

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nothing here yet :)</Text>
            <Link href={"/profile" as Href}> Go to Account</Link>
            <Link href={"/auth/emailValidation" as Href}> Go to Email Validation</Link>
            <Link href={"/map" as Href}> Go to Map</Link>
            <Link
                href={{
                        pathname: '/cellSelection',
                        params: {
                            boxes: JSON.stringify(boxes),
                        },
                    }}
                > Go to Cell Selection</Link>
        </View>
    );
}
