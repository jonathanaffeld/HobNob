import React from 'react';
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Account from './components/Account';
import AccountEdit from './components/AccountEdit';
import Discover from './components/Discover';
import Entry from './components/Entry';
import EntryCreate from './components/EntryCreate';
import EntryEdit from './components/EntryEdit';

const Stack = createNativeStackNavigator();

const App = () => (
    <View style={styles.container}>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                />
                <Stack.Screen
                    name="Account"
                    component={Account}
                />
                <Stack.Screen
                    name="AccountEdit"
                    component={AccountEdit}
                />
                <Stack.Screen
                    name="Discover"
                    component={Discover}
                />
                <Stack.Screen
                    name="Entry"
                    component={Entry}
                />
                <Stack.Screen
                    name="EntryCreate"
                    component={EntryCreate}
                />
                <Stack.Screen
                    name="EntryEdit"
                    component={EntryEdit}
                />
            </Stack.Navigator>
        </NavigationContainer>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default App;