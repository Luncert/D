import React, { Component } from 'react';
import { Button, Grid, List, Container } from "semantic-ui-react";
import { ChromePicker } from 'react-color';
import ColorPicker from './ColorPicker';

const styles =  require('./SettingPage.css') as any;

interface AppearanceSettingState {
    showColorPicker: boolean
}

class AppearanceSetting extends Component<any, AppearanceSettingState> {

    constructor(props: any) {
        super(props)
        this.state = {
            showColorPicker: false
        }
    }

    onColorPick(color: string, c: any) {
        console.log(color, c)
    }

    render() {
        const { showColorPicker } = this.state

        return (
            <div className={styles.appearanceSetting}>
                <div className={styles.form}>
                    <div className={styles.formField}>
                        <span className={styles.label}>Theme Color</span>
                        <span onClick={() => this.setState({showColorPicker: true})}
                            style={{
                                display: 'inline-block',
                                boxSizing: 'border-box',
                                marginTop: 2,
                                marginLeft: 8,
                                width: 16, height: 16,
                                borderRadius: '50%',
                                border: '2px solid white',
                                cursor: 'pointer',
                                backgroundColor: 'rgb(34, 36, 53)',
                            }}></span>
                        <span style={{ color: 'rgb(160, 160, 160)', marginLeft: 5}}>(Click to pick color)</span>
                        <ColorPicker color={'rgb(34, 36, 53)'} onChange={null} onCancel={null} onSubmit={null} />
                    </div>

                    <div className={styles.formField}>
                        <span className={styles.label}>Font Color</span>
                        <span onClick={() => this.setState({showColorPicker: true})}
                            style={{
                                display: 'inline-block',
                                boxSizing: 'border-box',
                                marginTop: 2,
                                marginLeft: 8,
                                width: 16, height: 16,
                                borderRadius: '50%',
                                border: '2px solid white',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                            }}></span>
                        <span style={{ color: 'rgb(160, 160, 160)', marginLeft: 5}}>(Click to pick color)</span>
                        <ColorPicker color={'rgb(34, 36, 53)'} onChange={null} onCancel={null} onSubmit={null} />
                    </div>
                    
                    <div className={styles.formField}>
                        <span className={styles.label}>Font Family</span>
                    </div>

                </div>
                <div style={{ position: 'absolute', right: 10, bottom: 10 }}>
                    <Button disabled floated='right' primary>Apply</Button>
                </div>
            </div>
        )
    }
}

class PluginSetting extends Component {
    
    render() {
        return (
            <div>

            </div>
        )
    }
}

const SETTINGS = [<AppearanceSetting />, <PluginSetting />]

interface SettingPanelState {
    activeCategoryIdx: number
}

export default class SettingPanel extends Component<any, SettingPanelState> {

    constructor(props: any) {
        super(props)
        this.state = {
            activeCategoryIdx: 0
        }
    }

    render() {
        const { activeCategoryIdx } = this.state
        let categoryList = ['Appearance', 'Plugin']
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <div className={styles.titleRadius}></div>
                        Settings
                        <div className={styles.titleRadius}></div>
                    </div>
                </div>
                <Grid style={{height: 'calc(100% - 30px)'}}>
                    <Grid.Row columns={2} style={{height: '100%'}}>
                        <Grid.Column width={3}>
                            <List>
                                { categoryList.map((item, idx) =>
                                    <List.Item key={idx}
                                        className={styles.category + (idx == activeCategoryIdx ? ' ' + styles.activeCategory : '')}
                                        onClick={() => this.setState({activeCategoryIdx: idx})}>
                                        {item}
                                    </List.Item>)}
                            </List>
                        </Grid.Column>
                        <Grid.Column width={13}>{SETTINGS[activeCategoryIdx]}</Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}