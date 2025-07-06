import {ActivityIndicator, Alert, Button, ImageBackground, Text,Image, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "@/styles/styles";
import {Href, Link} from "expo-router";
import React, {useState} from "react";
import {User, useUser} from "@/contexts/userContext";
import {Picker} from "@react-native-picker/picker";

type EditableUser = Pick<User, 'name' | 'description' | 'region' | 'selectedTheme'>;


export default function  Profile () {
    const {user, update} = useUser()
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState<EditableUser | null>(() => user);

    const cancel = () => {
        setDraft(user);                           // just copy the whole object back
        setEditing(false);
    };

    const save = async () => {
        if (!draft) {
            Alert.alert('Nothing to save');
            return;
        }

        const { name, description, region, selectedTheme } = draft;

        if (!name || !description || !region || !selectedTheme) {
            Alert.alert('Please fill out all fields.');
            return;
        }

        try {
            setLoading(true);
            // context method call here
            console.log("before upd");
            await update(draft?.name, draft?.description, draft?.region, draft?.selectedTheme);
            console.log("after upd");
            setEditing(false);
        } catch (err) {
            Alert.alert('Could not save', err?.toString() ?? 'Please check your connection.' );
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{flex: 1}} />;
    return (
        <View style={styles.container}>
            <Link href={"/" as Href} style={styles.link}>
                Go back
            </Link>
                <ImageBackground
                    source={require('../assets/images/sadbg.png')}
                    style={styles.bgImage}
                    resizeMode="cover"
                >
                    <View style={styles.profileImageWrapper}>
                        <Image source={require('../assets/images/sadtestpfp.png')} style={styles.profileImage}/>
                    </View>
                </ImageBackground>

        <View style={styles.infoContainer}>
            <View style={styles.row}>
                <Text style={styles.label}>Username</Text>
                {editing ? (
                    <TextInput
                        style={styles.input}
                        value={draft?.name ?? ''}
                        onChangeText={text => setDraft(prev => prev ? { ...prev, name: text } : null)}
                        placeholder="Username"
                    />
                ) : (
                    <Text style={styles.value}>{user?.name}</Text>
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Description</Text>
                {editing ? (
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        multiline
                        numberOfLines={3}
                        value={draft?.description ?? ''}
                        onChangeText={text => setDraft(prev => prev ? { ...prev, description: text } : null)}
                        placeholder="Tell us about yourself"
                    />
                ) : (
                    <Text style={styles.value}>{user?.description}</Text>
                )}
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Rrgion</Text>
                {editing ? (
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        multiline
                        numberOfLines={3}
                        value={draft?.region ?? ''}
                        onChangeText={text => setDraft(prev => prev ? { ...prev, region: text } : null)}
                        placeholder="Tell us about your region"
                    />
                ) : (
                    <Text style={styles.value}>{user?.region}</Text>
                )}
            </View>

            <View style={styles.row}>
                {editing ? (
                    <Picker
                        selectedValue={draft?.selectedTheme ?? 'blue'}
                        onValueChange={(value) =>
                            setDraft(prev => prev ? { ...prev, selectedTheme: value } : null)
                        }
                        style={styles.profileInput}
                    >
                        <Picker.Item label="Blue" value="blue" />
                        <Picker.Item label="Dark" value="dark" />
                        <Picker.Item label="Orange" value="orange" />
                        <Picker.Item label="White" value="white" />
                    </Picker>
                ) : (
                    <Text style={styles.description}>
                        {user?.selectedTheme ?? 'No theme selected'}
                    </Text>
                )}
            </View>

            <View style={styles.buttonRow}>
                {editing ? (
                    <>
                        <Button title="Save" onPress={save} />
                        <Button title="Discard" onPress={cancel} color="grey" />
                    </>
                ) : (
                    <Button title="Edit profile" onPress={() => setEditing(true)} />
                )}
            </View>

        </View>
    </View>
    );
}
