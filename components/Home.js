import React, { 
    useCallback, 
    useState 
} from "react";
import { 
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    Pressable 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import BottomBar from "./BottomBar";
import EventCard from "./EventCard";
import UpcomingEvents from "../assets/images/UpcomingEvents.png";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Home = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [mounting, setMounting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);

                supabase.auth.getUser()
                .then((auth_response) => {
                    if (auth_response.error) throw auth_response.error;

                    const id = auth_response.data.user.id;
                    supabase
                    .from("users")
                    .select("first_name, last_name, image_url")
                    .eq("user_id", id)
                    .then((user_response) => {
                        if (user_response.error) throw user_response.error;
                        
                        const user_result = user_response.data[0];
                        setUser(user_result);

                        const currentDateTime = new Date().toISOString();

                        supabase
                        .from("events")
                        .select()
                        .contains("participants", [id])
                        .gte("end_time", currentDateTime)
                        .order("start_time", { ascending: true })
                        .then((event_response) => {
                            if (event_response.error) throw event_response.error;
                            
                            setUpcomingEvents(event_response.data);
                            setMounting(false);
                        }).catch((event_error) => {
                            console.log(event_error);
                        });
                    }).catch((user_error) => {
                        console.log(user_error);
                    });
                }).catch((auth_error) => {
                    console.log(auth_error);
                });
            }
            fetchData();
        }, [])
    );

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient 
                colors={["#A8D0F5", "#D0B4F4"]} 
                style={styles.homeContainer}
            >
                <ActivityIndicator 
                    size="large" 
                    style={{ alignItems: "center", justifyContent: "center", flex: 1 }} 
                />
            </LinearGradient>
        );
    }
    
    return (
        <LinearGradient 
            colors={["#A8D0F5", "#D0B4F4"]} 
            style={styles.homeContainer}
        >
            <Text style={styles.hobNob}>HobNob.</Text>
            <Image 
                source={{ uri: user.image_url }} 
                style={styles.image} 
            />
            <Text style={styles.welcomeText}>
                {`Welcome ${user.first_name} ${user.last_name}!`}
            </Text>
            <Image 
                source={UpcomingEvents} 
                style={styles.upcomingEventsText} 
            />
            {
                upcomingEvents.length !== 0 ? 
                <ScrollView style={styles.upcomingEventsContainer}>
                    {
                        upcomingEvents.map(event => (
                            <EventCard 
                                key={event.event_id} 
                                event={event} 
                                navigation={navigation} 
                            />
                        ))
                    }
                </ScrollView>
                :
                <Pressable style={styles.noEventsContainer} onPress={() => navigation.navigate("Discover")}>
                    <Text style={styles.noEventsTitle}>No Upcoming Events!</Text>
                    <Text style={styles.noEventsText}>Discover New Events on the Discover Page!</Text>
                </Pressable>
            }
            <BottomBar navigation={navigation} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: screenHeight * 0.1,
        width: screenWidth,
        height: screenHeight
    },
    hobNob: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.05,
        marginTop: screenHeight * 0.05,
        marginLeft: screenWidth * 0.05,
        textAlign: "left",
        alignSelf: "flex-start",
    },
    image: {
        width: screenWidth * 0.4,
        height: screenWidth * 0.4,
        borderRadius: screenWidth * 0.25,
        borderColor: "#000000",
        borderWidth: 2,
        marginBottom: screenHeight * 0.025,
        opacity: 1
    },
    welcomeText: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.04,
    },
    upcomingEventsText: {
        height: screenHeight * 0.125,
        resizeMode: "contain",
        marginTop: screenHeight * -0.01
    },
    upcomingEventsContainer: {
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenWidth * 0.025,
    },
    noEventsContainer: {
        width: screenWidth * 0.75,
        padding: screenWidth * 0.05,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        opacity: 0.75,
        borderRadius: screenWidth * 0.05,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    noEventsTitle: {
        fontFamily: "Dongle-Bold",
        fontSize: screenHeight * 0.03,
        textAlign: "center"
    },
    noEventsText: {
        fontFamily: "Dongle-Light",
        fontSize: screenHeight * 0.02,
        textAlign: "center"
    }
});

export default Home;