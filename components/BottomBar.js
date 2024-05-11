import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';

const BottomBar = () => {
    return (
        <View style={styles.container}>
            <Text>Bottom Bar</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default BottomBar;