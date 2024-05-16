import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserName from "./components/UserName";
import UserPhoto from "./components/UserPhoto";
import UserPrompts from "./components/UserPrompts";
import Home from "./components/Home";
import Discover from "./components/Discover";
import EventCreate from "./components/EventCreate";
import Events from './components/Events'
import Account from "./components/Account";
import Event from "./components/Event";

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ 
                    headerShown: false,
                    presentation: "modal"
                }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ 
                    headerShown: false,
                    presentation: "modal"
                }}
            />
            <Stack.Screen
                name="UserName"
                component={UserName}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="UserPhoto"
                component={UserPhoto}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="UserPrompts"
                component={UserPrompts}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="Discover"
                component={Discover}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="EventCreate"
                component={EventCreate}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="Events"
                component={Events}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="Account"
                component={Account}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
            <Stack.Screen
                name="Event"
                component={Event}
                options={{ 
                    headerShown: false,
                    animationEnabled: false
                }}
            />
        </Stack.Navigator>
  </NavigationContainer>
);

export default App;
