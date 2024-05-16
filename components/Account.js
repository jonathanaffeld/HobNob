import React, { useState, useCallback } from 'react';
import { 
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomBar from './BottomBar';
import { supabase } from '../supabase';
import AccountText from '../assets/images/AccountText.png'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Account = ({ route, navigation }) => {
    const user_id = route.params.user_id;
    const [auth_user_id, setAuthUserID] = useState("");
    const [user, setUser] = useState({});
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);
                
                const auth_response = await supabase.auth.getUser();
                if (auth_response.error) {
                    console.log(auth_response.error);
                    return;
                }
                const auth_uid = auth_response.data.user.id;
                setAuthUserID(auth_uid);

                const { data, error } = await supabase
                    .from('users')
                    .select('first_name, last_name, image_url, prompt1, response1, prompt2, response2')
                    .eq('user_id', user_id);
                
                if (error) {
                    console.log(error);
                    return;
                }

                const result = data[0];
                setUser(result);
                setMounting(false);
            }
            fetchData();
        }, [user_id])
    );

    const canEdit = () => {
        return user_id === auth_user_id;
    }

    const editPhoto = () => {
        navigation.navigate("UserPhoto")
    }

    const editName = () => {
        navigation.navigate("UserName")
    }

    const editPrompt1 = () => {
        navigation.navigate("UserPrompt1");
    }

    const editPrompt2 = () => {
        navigation.navigate("UserName");
    }

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            Alert.alert("Uhoh", error.message);
            return;
        }

        navigation.navigate("Login");
    }

    const handleDelete = async () => {
        Alert.alert("Uhoh", "This Feature isn't ready yet!");
    }

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.accountContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }
    
    return(
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.accountContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Image style={styles.accountText} source={AccountText} />
                <View style={styles.imageContainer}>
                    <Image source={{ uri: user.image_url }} style={styles.image} />
                    {
                        canEdit() &&
                        <TouchableOpacity style={styles.imagePressable} onPress={editPhoto}>
                            <View style={styles.imageEditContainer}>
                                <FontAwesome
                                    name='edit'
                                    size={screenWidth*0.05}
                                    color={'#FFFFFF'}
                                />
                                <Text style={styles.imageEditText}>Edit </Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{`${user.first_name} ${user.last_name}`}</Text>
                    {
                        canEdit() &&
                        <Pressable style={styles.nameEditContainer} onPress={editName}>
                            <FontAwesome
                                name='edit'
                                size={screenWidth*0.05}
                                color={'#77678C'}
                            />
                            <Text style={styles.nameEditText}>Edit </Text>
                        </Pressable>
                    }
                </View>
                <View style={styles.promptContainer}>
                    <Text style={styles.promptText}>{user.prompt1}</Text>
                    <Text style={styles.responseText}>{user.response1}</Text>
                    {
                        canEdit() &&
                        <Pressable style={styles.promptEditContainer} onPress={editPrompt1}>
                            <FontAwesome
                                name='edit'
                                size={screenWidth*0.05}
                                color={'#77678C'}
                            />
                            <Text style={styles.promptEditText}>Edit </Text>
                        </Pressable>
                    }
                </View>
                <View style={styles.promptContainer}>
                    <Text style={styles.promptText}>{user.prompt2}</Text>
                    <Text style={styles.responseText}>{user.response2}</Text>
                    {
                        canEdit() &&
                        <Pressable style={styles.promptEditContainer} onPress={editPrompt2}>
                            <FontAwesome
                                name='edit'
                                size={screenWidth*0.05}
                                color={'#77678C'}
                            />
                            <Text style={styles.promptEditText}>Edit </Text>
                        </Pressable>
                    }
                </View>
                {
                    canEdit() &&
                    <View style={styles.lowerContainer}>
                        {
                            loading ? 
                            <ActivityIndicator style={styles.loading} /> :
                            <View>
                                <Pressable style={styles.logout} onPress={handleLogout}>
                                    <Text style={styles.logoutText}>Logout</Text>
                                </Pressable>
                                <Pressable style={styles.delete} onPress={handleDelete}>
                                    <Text style={styles.deleteText}>Delete Account</Text>
                                </Pressable>
                            </View>
                        }
                    </View>
                }
                <View style={styles.removeSpace}/>
            </ScrollView>
            <BottomBar user_id={user_id} navigation={navigation} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    accountContainer: {
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: screenHeight * 0.1,
    },
    scrollContent: {
        alignItems: "center",
        paddingBottom: screenHeight * 0.1,
        width: screenWidth
    },
    accountText: {
        height: screenHeight * 0.125,
        resizeMode: "contain",
        marginTop: screenHeight * 0.05
    },
    imageContainer: {
        position: 'relative',
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
        borderRadius: 100,
        borderColor: "#000000",
        borderWidth: 2,
        overflow: "hidden",
        marginBottom: screenHeight * 0.0125
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
    imagePressable: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
        height: "33%", 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageEditContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: screenHeight * 0.015
    },
    imageEditText: {
        color: '#FFFFFF',
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.016,
    },
    nameContainer: {
        position: 'relative',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: screenHeight * 0.0125
    },
    nameText: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.06,
    },
    nameEditContainer: {
        position: 'absolute',
        right: 0,
        marginRight: -35,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    nameEditText: {
        color: '#77678C',
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.016
    },
    promptContainer: {
        position: 'relative',
        flexDirection: "column",
        width: screenWidth * 0.75,
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        padding: screenHeight * 0.025,
        marginBottom: screenHeight * 0.025,
    },
    promptText: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.015,
        marginBottom: screenHeight * 0.0125
    },
    responseText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        lineHeight: screenHeight * 0.03,
    },
    promptEditContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        margin: screenHeight * 0.01,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    promptEditText: {
        color: '#77678C',
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.016
    },
    lowerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: screenHeight * 0.0125,
    },
    removeSpace: {
        marginBottom: screenHeight * -0.075
    },
    logout: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: screenHeight * 0.0125
    },
    logoutText: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.04,
    },
    delete: {
        alignItems: "center",
        justifyContent: "center",
    },
    deleteText: {
        color: "#e74c3c",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.04,
    },
    loading: {
        size: "large",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Account;