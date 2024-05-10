import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("home");
        return (
            <div id='home-container'>
                Home
            </div>
        );
    }
}

export default Home;