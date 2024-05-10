import {
    Link
} from 'react-router-native';
import React from 'react';
import { Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';

class BottomBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <Link to='/account'>
                    <PersonIcon/>
                    Account
                </Link>
                <Link to='/home'>
                    <HomeIcon/>
                    Home
                </Link>
                <Link to='/discover'>
                    <PlaceIcon/>
                    Discover
                </Link>
            </Paper>
        );
    }
}

export default BottomBar;