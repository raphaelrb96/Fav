import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { colorCinza } from '../../constantes/cores';

const styles = StyleSheet.create({
    pb: {
        marginTop: 50,
    },
    containerpb: {
        height: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default function Pb() {
    return (
        <View style={styles.containerpb}>
            <Progress.Circle style={styles.pb} color={colorCinza} borderWidth={5} indeterminate={true} />
        </View>
        
    );
}