import React, {useEffect, useState} from "react";


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from "@/app/auth/register";
import Login from "@/app/auth/login";

const Stack = createNativeStackNavigator();


export default function Index() {
    return (
        <Register></Register>
    );
}
