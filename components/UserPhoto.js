import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../supabase'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Photo = ({ route, navigation }) => {
    const user_id = route.params.user_id;
    const [image, setImage] = useState(null);
    const [finished_sign_up, setFinishedSignUp] = useState(false);
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setMounting(true);
            const { data, error } = await supabase
            .from('users')
            .select('image_url, finished_sign_up')
            .eq('user_id', user_id);
            
            if (error) {
                console.log(error);
                return;
            }

            const result = data[0];
            const img = result.image_url;
            const fsu = result.finished_sign_up;
            
            if (img) {
                setImage(img);
            }
            setFinishedSignUp(fsu);
            setMounting(false);
        }
        fetchData();
    }, [user_id]);

    const handleBack = async () => {
        if (finished_sign_up) {
            navigation.navigate("Account", { user_id: user_id });
        }
        else {
            navigation.navigate("UserName", { user_id: user_id })
        }
    }

    const pickImage = async () => {
        const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraRollPermission.status !== 'granted') {
            alert('Permission for camera roll access needed.');
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            console.log(result);
    
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("ImagePicker Error", error.message);
        }
    };
    
    const takeImage = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            alert('Permission for camera access needed.');
            return;
        }
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            console.log(result);
    
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Camera Error", error.message);
        }
    };

    async function convertImageToBuffer(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                try {
                    const base64data = reader.result.split(',')[1];
                    const arrayBuffer = decode(base64data);
                    resolve(arrayBuffer);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(new Error('Error reading blob.'));
            };
        });
    }

    const handleClick = async () => {
        if (!image) {
            Alert.alert("Uh oh", "Please select an image!");
            return;
        }
    
        setLoading(true);
    
        try {
            const base64Response = await fetch(image);
            const blob = await base64Response.blob();
            const arrayBuffer = await convertImageToBuffer(blob);
    
            supabase
                .storage
                .from('profile-photos')
                .upload(`${user_id}/${user_id}.png`, arrayBuffer, {
                    contentType: 'image/png',
                    upsert: true
                })
                .then((upload_response) => {
                    if (upload_response.error) throw upload_response.error;
                    const publicUrlResponse = supabase.storage.from('profile-photos').getPublicUrl(`${user_id}/${user_id}.png`);
                    const url = publicUrlResponse.data.publicUrl;
                    supabase
                    .from('users')
                    .update({ image_url: url })
                    .eq('user_id', user_id)
                    .then((response) => {
                        if (response.error) throw response.error;
                        setLoading(false);
                        if (finished_sign_up) {
                            Alert.alert("Updated Successfully");
                            navigation.navigate("Account", { user_id: user_id });
                        } else {
                            navigation.navigate("UserPrompts", { user_id: user_id })
                        }
                    }).catch((error) => {
                        setLoading(false);
                        Alert.alert("Uhoh", error.message);
                    });
                }).catch((upload_error) => {
                    setLoading(false);
                    Alert.alert("Uhoh", upload_error.message);
                });
        } catch (image_error) {
            setLoading(false);
            Alert.alert("Uhoh", image_error.message);
        }
    }
    

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.namesContainer}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.namesContainer}>
            <Text style={styles.titleText}>Select a Profile Photo!</Text>
            <View style={styles.imageContainer}>
                {
                    image ?
                    <Image source={{ uri: image }} style={styles.image} /> :
                    <View style={styles.image} />
                }
                <View style={styles.iconContainer}>
                    <Pressable onPress={pickImage} style={styles.icon1}>
                        <FontAwesome 
                            name='image' 
                            size={screenWidth * 0.1} 
                            color='#000000'
                        />
                        <Text style={styles.iconText}>Upload Photo</Text>
                    </Pressable>
                    <Pressable onPress={takeImage} style={styles.icon2} >
                        <FontAwesome 
                            name='camera' 
                            size={screenWidth * 0.1}
                            color='#000000'
                        />
                        <Text style={styles.iconText}>Take Photo</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.lowerContainer}>
                {
                    loading ? 
                    <ActivityIndicator style={styles.loading} /> :
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.backButton} onPress={handleBack}>
                            <Text style={styles.buttonText}>Back</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={handleClick}>
                            <Text style={styles.buttonText}>{finished_sign_up ? "Save" : "Continue"}</Text>
                        </Pressable>
                    </View>
                }
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    namesContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.06
    },
    imageContainer: {
        width: screenWidth * 0.75,
        margin: screenWidth * 0.05,
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
        borderRadius: 100,
        borderWidth: "#000000",
        borderWidth: 2,
        margin: screenHeight * 0.05,
        opacity: 1
    },
    iconContainer: {
        flexDirection: "row"
    },
    icon1: {
        marginRight: screenHeight * 0.05,
        marginBottom: screenHeight * 0.05,
        justifyContent: "center",
        alignItems: "center"
    },
    icon2: {
        marginLeft: screenHeight * 0.05,
        marginBottom: screenHeight * 0.05,
        justifyContent: "center",
        alignItems: "center"
    },
    iconText: {
        size: screenWidth * 0.1,
        resizeMode: "contain",
        color: '#000000',
        fontFamily: "Dongle-Regular"
    },
    lowerContainer: {
        height: screenHeight * 0.05,
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.025
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: screenWidth * 0.025
    },
    button: {
        width: screenWidth * 0.3,
        height: screenHeight * 0.05,
        backgroundColor: "#77678C",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: screenWidth * 0.025
    },
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.04
    },
    loading: {
        size: "large",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Photo;