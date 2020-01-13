import React, { Component } from 'react';
import Header from './com/Header';
import PanelManager from './com/PanelManager';

export default class App extends Component {

    render() {
        return (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <Header />
                <PanelManager />
            </div>
        )
    }
}