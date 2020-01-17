import React, { Component } from 'react';
import { Button, Grid, List, Container, Icon } from "semantic-ui-react";
import { SketchPicker } from 'react-color';

const styles =  require('./SettingPage.css') as any;

class AppearanceSetting extends Component {

    render() {
        return (
            <div className={styles.appearanceSetting}>
                <div className={styles.form}>
                    <span className={styles.label}></span>
                    <span>rgb(10, 10, 10)</span>
                    <span className={styles.btnEdit}><Icon name='edit' /></span>
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
                <Grid style={{height: 'calc(100% - 80px)'}}>
                    <Grid.Row columns={2}>
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
                    <Grid.Row>
                        <Container>
                            <Button disabled floated='right' primary>Apply</Button>
                        </Container>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}