import React from 'react';
import { StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { colorCinza } from '../../constantes/cores';

const styles = StyleSheet.create({
    pb: {
        marginTop: 50,
        alignContent: 'center',
        alignItems: 'center'
    }
});

export default function Pb() {
    return (
        <Progress.Circle style={styles.pb} color={colorCinza} borderWidth={5} indeterminate={true} />
    );
}