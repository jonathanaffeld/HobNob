import React from 'react';

class Account extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("acount");
        return (
            <div id='account-container'>
                Account
            </div>
        );
    }
}

export default Account;