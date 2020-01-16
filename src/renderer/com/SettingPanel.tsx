import React, { Component } from 'react';

import './SettingPanel.css'

export default class SettingPanel extends Component {

    render() {
        return (
            <div className='settings'>
                <div className='category-list'>
                    <div className='category'>Theme</div>
                    <div className='category'>Font</div>
                    <div className='category'>Plugins</div>
                </div>
                <div className='detail'>

                </div>
                <div>

                </div>
            </div>
        )
    }
}