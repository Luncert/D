import React, { Component } from 'react';
import ShellPanel from './ShellPanel';

import './PanelManager.css';

interface PanelProps {

}

class Panel extends Component<PanelProps> {

    render() {
        return (
            <div className='panel'>
                {this.props.children}
            </div>
        )
    }
}

export default class PanelManager extends Component {

    render() {
        return (
            <div style={{
                width: '100%', height: 'calc(100% - 30px)',
                backgroundColor: 'rgb(34, 36, 53)'
            }}>
                <Panel>
                    <ShellPanel />
                </Panel>
            </div>
        )
    }
}