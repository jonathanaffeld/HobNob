import React, { 
    useCallback, 
    useEffect, 
    useState 
} from "react";
import { 
    ActivityIndicator, 
    Dimensions, 
    Image, 
    Pressable, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import BottomBar from "./BottomBar";
import EventsText from "../assets/images/EventsText.png";
import EventCard from "./EventCard";
import { supabase } from "../supabase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Events = ({ navigation }) => {
    const [user_id, setUserID] = useState("");
    const [tab, setTab] = useState("My Events");
    const [events, setEvents] = useState([]);
    const [mounting, setMounting] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                setMounting(true);
                setTab("My Events");
                supabase.auth.getUser()
                .then((auth_response) => {
                    if (auth_response.error) throw auth_response.error;

                    const id = auth_response.data.user.id;
                    setUserID(id);

                    const currentDateTime = new Date().toISOString();

                    supabase
                    .from("events")
                    .select()
                    .eq("owner", id)
                    .order("start_time", { ascending: false })
                    .then((event_response) => {
                        if (event_response.error) throw event_response.error;

                        setEvents(event_response.data);
                        setMounting(false);
                    }).catch((event_error) => {
                        console.log(event_error);
                    });
                }).catch((auth_error) => {
                    console.log(auth_error);
                });
            }
            fetchData();
        }, [])
    );

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            const currentDateTime = new Date().toISOString();

            if (tab === "My Events") {
                const { data, error } = await supabase
                    .from("events")
                    .select()
                    .eq("owner", user_id)
                    .order("start_time", { ascending: false });

                if (error) console.log(error.message);

                setEvents(data);
            }
            if (tab === "Upcoming Events") {
                const { data, error } = await supabase
                    .from("events")
                    .select()
                    .contains("participants", [user_id])
                    .gte("end_time", currentDateTime)
                    .order("start_time", { ascending: true });

                if (error) console.log(error.message);

                setEvents(data);
            }
            if (tab === "Past Events") {
                const { data, error } = await supabase
                    .from("events")
                    .select()
                    .contains("participants", [user_id])
                    .lte("end_time", currentDateTime)
                    .order("start_time", { ascending: false });

                if (error) console.log(error.message);

                setEvents(data);
            }
            setLoading(false);
        }
        if (user_id) fetchEvents();
    }, [user_id, tab, setLoading]);

    const renderEvents = () => {
        if (events.length !== 0) {
            return (
                <ScrollView style={styles.scrollContainer}>
                    {
                        events.map(event => (
                            <EventCard 
                                key={event.event_id} 
                                event={event} 
                                navigation={navigation} 
                            />
                        ))
                    }
                </ScrollView>
            );
        } else {
            if (tab === "Upcoming Events") {
                return (
                    <Pressable style={styles.noEventsContainer} onPress={() => navigation.navigate("Discover")}>
                        <Text style={styles.noEventsTitle}>No Upcoming Events!</Text>
                        <Text style={styles.noEventsText}>Discover New Events on the Discover Page!</Text>
                    </Pressable>
                );
            }
            if (tab === "Past Events") {
                return (
                    <Pressable style={styles.noEventsContainer} onPress={() => navigation.navigate("Discover")}>
                        <Text style={styles.noEventsTitle}>No Past Events!</Text>
                        <Text style={styles.noEventsText}>Discover New Events on the Discover Page!</Text>
                    </Pressable>
                );
            }
            return (
                <Pressable style={styles.noEventsContainer} onPress={() => navigation.navigate("EventCreate")}>
                    <Text style={styles.noEventsTitle}>No Events!</Text>
                    <Text style={styles.noEventsText}>Create an Event to Start HobNob-ing!</Text>
                </Pressable>
            );
        }
    };

    const [fontsLoaded] = useFonts({
        "Dongle-Bold": require("../assets/fonts/Dongle-Bold.ttf"),
        "Dongle-Regular": require("../assets/fonts/Dongle-Regular.ttf"),
        "Dongle-Light": require("../assets/fonts/Dongle-Light.ttf"),
    });

    if (!fontsLoaded || mounting) {
        return (
            <LinearGradient 
                colors={["#A8D0F5", "#D0B4F4"]} 
                style={styles.eventsContainer}
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
            style={styles.eventsContainer}
        >
            <Image 
                source={EventsText} 
                style={styles.eventsText} 
            />
            <View style={styles.tabContainer}>
                <Text 
                    style={tab === "My Events" ? styles.textOn : styles.textOff}
                    onPress={() => setTab("My Events")}
                >
                    My Events
                </Text>
                <Text 
                    style={tab === "Upcoming Events" ? styles.textOn : styles.textOff}
                    onPress={() => setTab("Upcoming Events")}
                >
                    Upcoming Events
                </Text>
                <Text 
                    style={tab === "Past Events" ? styles.textOn : styles.textOff}
                    onPress={() => setTab("Past Events")}
                >
                    Past Events
                </Text>
            </View>
            {
                loading ? 
                <ActivityIndicator style={{ alignItems: "center", justifyContent: "center" }} />
                :
                renderEvents()
            }
            <BottomBar navigation={navigation} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    eventsContainer: {
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: screenHeight * 0.1,
        width: screenWidth,
        height: screenHeight
    },
    eventsText: {
        height: screenHeight * 0.125,
        resizeMode: "contain",
        marginTop: screenHeight * 0.05
    },
    tabContainer: {
        flexDirection: "row",
        paddingHorizontal: screenWidth * 0.05,
        marginBottom: screenHeight * 0.025,
        justifyContent: "center",
        alignItems: "center"
    },
    textOn: {
        color: "#77678C",
        textDecorationLine: "underline",
        textDecorationColor: "#77678C",
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.035,
        textAlign: "center",
        marginHorizontal: screenWidth * 0.015
    },
    textOff: {
        color: "#000000",
        fontFamily: "Dongle-Regular",
        fontSize: screenHeight * 0.035,
        textAlign: "center",
        marginHorizontal: screenWidth * 0.015
    },
    scrollContainer: {
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

export default Events;