import {Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link} from "expo-router";


export default function  Test () {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nothing here yet :)</Text>
            <Link href={"/" as Href}> Go to Start</Link>
        </View>
    );
};