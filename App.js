import React from 'react';
import { StyleSheet, Text, View } from "react-native";
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
                    options={{ }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ }}
                />
                <Stack.Screen
                    name="Account"
                    component={Account}
                    options={{ }}
                />
                <Stack.Screen
                    name="AccountEdit"
                    component={AccountEdit}
                    options={{ }}
                />
                <Stack.Screen
                    name="Discover"
                    component={Discover}
                    options={{ }}
                />
                <Stack.Screen
                    name="Entry"
                    component={Entry}
                    options={{ }}
                />
                <Stack.Screen
                    name="EntryCreate"
                    component={EntryCreate}
                    options={{ }}
                />
                <Stack.Screen
                    name="EntryEdit"
                    component={EntryEdit}
                    options={{ }}
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