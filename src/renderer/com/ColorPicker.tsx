import React, { Component } from 'react';

const styles = require('./ColorPicker.css') as any;

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
    onCancel: () => void
    onSubmit: () => void
}

export default class ColorPicker extends Component<ColorPickerProps> {

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.pickArea} style={{backgroundColor: 'rgb(0, 0, 255)'}}>
                        <div className={styles.pickAreaCover}></div>
                    </div>
                    <div className={styles.pickPoint}></div>
                    <div className={styles.slideArea}></div>
                    <div className={styles.slideCursor}></div>
                </div>
            </div>
        )
    }

}