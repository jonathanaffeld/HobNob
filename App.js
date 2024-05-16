import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserName from "./components/UserName";
import UserPhoto from "./components/UserPhoto";
import UserPrompt1 from "./components/UserPrompt1";
import UserPrompt2 from "./components/UserPrompt2";
import Home from "./components/Home";
import Discover from "./components/Discover";
import EventCreate from "./components/EventCreate";
import Events from './components/Events'
import Account from "./components/Account";
import Event from "./components/Event";

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
        <Stack.Navigator screenOptions={{ animationEnabled: false }}>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="UserName"
                component={UserName}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="UserPhoto"
                component={UserPhoto}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="UserPrompt1"
                component={UserPrompt1}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="UserPrompt2"
                component={UserPrompt2}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Discover"
                component={Discover}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EventCreate"
                component={EventCreate}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Events"
                component={Events}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Account"
                component={Account}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Event"
                component={Event}
                options={{ 
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
  </NavigationContainer>
);

export default App;
