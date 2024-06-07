import React, { useState, useCallback, useEffect } from 'react';
import { 
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import axios from 'axios';

import AccountCard from "./AccountCard"
import BottomBar from './BottomBar';
import { supabase } from '../supabase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Event = ({ route, navigation }) => {
    const eventId = route.params.event_id;
    const currentDateTime = new Date().toISOString();
    const [userId, setUserId] = useState("");
    const [event, setEvent] = useState({});
    const [response, setResponse] = useState("");
    const [tab, setTab] = useState("All Users");
    const [users, setUsers] = useState([]);
    const [cluster, setCluster] = useState("");
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);
                try {
                    const authResponse = await supabase.auth.getUser();
                    if (authResponse.error) throw authResponse.error;

                    const id = authResponse.data.user.id;
                    setUserId(id);

                    const { data, error } = await supabase
                        .from('events')
                        .select()
                        .eq('event_id', eventId)
                        .single();

                    if (error) {
                        console.log(error);
                        return;
                    }

                    setEvent(data);
                    setResponse(data.participants.includes(id) ? data.participant_responses[id] : "");
                    setTab("All Users");

                    const getUsersPromises = data.participants
                        .filter(participantId => participantId !== id)
                        .map(participantId => 
                            supabase
                                .from('users')
                                .select('first_name, last_name, image_url, user_id')
                                .eq('user_id', participantId)
                                .single()
                        );

                    const getUsersResponses = await Promise.all(getUsersPromises);
                    const getUsers = getUsersResponses
                        .filter(response => !response.error)
                        .map(response => response.data);

                    setUsers(getUsers);
                } catch (error) {
                    console.log(error);
                } finally {
                    setMounting(false);
                }
            }
            fetchData();
        }, [eventId])
    );

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            try {
                if (tab === "All Users") {
                    const getUsersPromises = event.participants
                        .filter(participantId => participantId !== userId)
                        .map(participantId => 
                            supabase
                                .from('users')
                                .select('first_name, last_name, image_url, user_id')
                                .eq('user_id', participantId)
                                .single()
                        );
    
                    const getUsersResponses = await Promise.all(getUsersPromises);
                    const getUsers = getUsersResponses
                        .filter(response => !response.error)
                        .map(response => response.data);
    
                    setUsers(getUsers);
                }
                if (tab === "Cluster") {
                    if (event.participants.length > 2) {
                        const getUsersPromises = event.participants
                            .map(participantId => 
                                supabase
                                    .from('users')
                                    .select()
                                    .eq('user_id', participantId)
                                    .single()
                            );
        
                        const getUsersResponses = await Promise.all(getUsersPromises);
                        const getUsers = getUsersResponses
                            .filter(response => !response.error)
                            .map(response => response.data);
        
                        const clusterData = getUsers.reduce((acc, user) => {
                            acc[user.user_id] = {
                                ...user,
                                event_prompt: event.prompt,
                                event_response: event.participant_responses[user.user_id]
                            };
                            return acc;
                        }, {});
        
                        const aiResponse = await getCluster(clusterData, userId);
                        setCluster(aiResponse.cluster);
                        setUsers(aiResponse.users);
                    }
                    else {
                        setCluster("");
                        setUsers([]);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    
        if (userId && event && tab) fetchUsers();
    }, [userId, event, tab]);

    const getCluster = async (clusterData, userId) => {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that identifies similarities to a user among all users based on their data."
                    },
                    {
                        role: "user",
                        content: `Analyze the following user data and return a JSON object. One key is named "users" which will be the 2-4 most similar users to the current user and NOT including the current user: ${userId}. The similar users MUST share something in common with the current user. The similarities should be drawn from the choices of prompts (prompt1, prompt2, event_prompt) and content of the responses (response1, response2, event_response). The other key should be named "cluster" and will be a sentence description describing what the users share in common. For example, "These users also like cats!" where cats is the similarity. Be specific, draw on the content of their responses or prompt choices, and have the sentence be no more than 100 characters. Here is the data: ${JSON.stringify(clusterData)}`
                    }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${Constants.expoConfig.extra.openaiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data.choices[0].message.content;
            return JSON.parse(result);
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            return { users: [], cluster: "" };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? "0" + minutes : minutes;

        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${month}/${day}/${year} ${hours}:${strMinutes} ${ampm}`;
    };

    const handleJoin = async () => {
        if (!response) {
            Alert.alert("Uhoh", "A response is need to join the event!")
        }

        setLoading(true);

        const joined = event.participants.includes(userId);

        if (!joined) event.participants.push(userId);
        event.participant_responses[userId] = response;

        const { error } = await supabase
            .from("events")
            .update({ participants: event.participants, participant_responses:  event.participant_responses })
            .eq("event_id", eventId);

        setLoading(false);

        if (error) {
            Alert.alert("Uhoh", error.message);
            return;
        }

        if (joined) {
            Alert.alert("Response Updated Successfully!");
        }
        else {
            Alert.alert("Event joined!")
        }
    }

    const renderUsers = () => {
        if (tab === "All Users") {
            if (users.length !== 0) {
                return (
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        {users.map((user) => (
                            <AccountCard
                                key={user.user_id}
                                user={user}
                                event_id={eventId}
                                navigation={navigation}
                            />
                        ))}
                    </ScrollView>
                );
            } else {
                return (
                    <Text style={styles.ended}>No other Users!</Text>
                );
            }
        }
        if (tab === "Cluster") {
            if (users.length !== 0) {
                return (
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.cluster}>{cluster}</Text>
                        {users.map((user) => (
                            <AccountCard
                                key={user.user_id}
                                user={user}
                                event_id={eventId}
                                navigation={navigation}
                            />
                        ))}
                    </ScrollView>
                );
            } else {
                return (
                    <Text style={styles.cluster}>Not enough Eventgoers to form a cluster!</Text>
                );
            }
        }
    }

    const renderBottom = () => {
        if (currentDateTime > event.end_time) {
            return (
                <View style={styles.bottomContainer}>
                    <Text style={styles.ended}>Sorry! This Event has ended.</Text>
                </View>
            );
        }
        if ((currentDateTime <= event.end_time && !event.participants.includes(userId)) || (currentDateTime < event.start_time && event.participants.includes(userId))) {
            return (
                <View>
                    <View style={styles.promptContainer}>
                        <Text style={styles.promptText}>{event.prompt}</Text>
                        <TextInput 
                            style={styles.responseText}
                            onChangeText={setResponse}
                            value={response}
                            placeholder="Type your response here..."
                            placeholderTextColor="#888888"
                            maxLength={100}
                            multiline={true}
                        />
                        <View style={styles.charactersLeftContainer}>
                            <Text
                                style={[
                                    styles.charactersLeft,
                                    100 - response.length < 20 && { color: "#e74c3c" }
                                ]}
                            >
                                Characters left: {100 - response.length}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.lowerContainer}>
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <Pressable style={styles.button} onPress={handleJoin}>
                                <Text style={styles.buttonText}>{event.participants.includes(userId) ? "Save Response" : "Join Event"}</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.bottomContainer}>
                <View style={styles.tabContainer}>
                    <Text
                        style={tab === "All Users" ? styles.textOn : styles.textOff}
                        onPress={() => setTab("All Users")}
                    >
                        All Users
                    </Text>
                    <Text
                        style={tab === "Cluster" ? styles.textOn : styles.textOff}
                        onPress={() => setTab("Cluster")}
                    >
                        Cluster
                    </Text>
                </View>
                {loading ? (
                    <ActivityIndicator
                        style={{ alignItems: "center", justifyContent: "center" }}
                    />
                ) : (
                    renderUsers()
                )}
            </View>
        );
    }; 

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.eventContainer}>
                <ActivityIndicator size="large" style={{alignItems: "center", justifyContent: "center", flex: 1}}/>
            </LinearGradient>
        );
    }
    
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient colors={['#A8D0F5', '#D0B4F4']} style={styles.eventContainer}>
                <Image
                    source={{ uri: event.image_url }}
                    style={styles.image}
                />
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.description}>{event.description}</Text>
                <View style={styles.locationContainer}>
                    <FontAwesome6
                        name="location-dot"
                        size={screenHeight * 0.02}
                        color="#000000"
                        style={styles.locationIcon}
                    />
                    <Text style={styles.otherText}>{`${event.location}`}</Text>
                </View>
                <Text style={styles.otherText}>{`From ${formatDate(event.start_time)} To ${formatDate(event.end_time)}`}</Text>
                <Text style={styles.otherText}>{`${event.participants ? event.participants.length: 0} person(s) ${currentDateTime > event.end_time ? 'went' : 'going'}`}</Text>
                {renderBottom()}
                <BottomBar navigation={navigation} />
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    eventContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        width: screenWidth,
        height: screenHeight,
        paddingBottom: screenHeight * 0.1
    },
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: "center",
    },
    image: {
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
        borderRadius: screenWidth * 0.05,
        borderColor: "#000000",
        borderWidth: 2,
        marginTop: screenHeight * 0.075,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.04,
        lineHeight: screenHeight * 0.04,
        marginTop: screenHeight * 0.025,
        textAlign: "center",
        width: screenWidth * 0.8
    },
    description: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.025,
        lineHeight: screenHeight * 0.025,
        textAlign: "center",
        width: screenWidth * 0.8
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        width: screenWidth * 0.8,
    },
    locationIcon: {
        marginRight: screenWidth * 0.0125
    },
    otherText: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.02,
        textAlign: "center",
    },
    bottomContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: screenWidth * 0.8,
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        borderRadius: screenWidth * 0.05,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        marginVertical: screenHeight * 0.025,
        paddingTop: screenHeight * 0.05,
        position: 'relative',
    },
    ended: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.04,
        textAlign: "center"
    },
    promptContainer: {
        flexDirection: "column",
        width: screenWidth * 0.8,
        height: screenHeight * 0.18,
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
        borderRadius: screenWidth * 0.05,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        padding: screenHeight * 0.025,
        marginVertical: screenHeight * 0.0125,
        position: 'relative'
    },
    promptText: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.02,
        lineHeight: screenHeight * 0.02,
    },
    responseText: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        lineHeight: screenHeight * 0.03
    },
    charactersLeftContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    charactersLeft: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.02,
        lineHeight: screenHeight * 0.02,
        color: "#888888",
    },
    lowerContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: screenHeight * 0.0125
    },
    button: {
        width: screenWidth * 0.35,
        backgroundColor: "#77678C",
        borderRadius: screenWidth * 0.05,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.03
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: screenWidth * 0.05,
        borderTopRightRadius: screenWidth * 0.05,
    },
    textOn: {
        color: "#77678C",
        textDecorationLine: "underline",
        textDecorationColor: "#77678C",
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.035,
        textAlign: "center",
        marginHorizontal: screenWidth * 0.05
    },
    textOff: {
        color: "#000000",
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.035,
        textAlign: "center",
        marginHorizontal: screenWidth * 0.05
    },
    scrollContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth * 0.025,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    cluster: {
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.03,
        textAlign: "center"
    },
});

export default Event;