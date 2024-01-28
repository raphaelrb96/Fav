import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import { List } from 'react-native-paper';
import { colorCinza, colorSecondaryDark } from '../../constantes/cores';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: colorCinza,
        borderRadius: 6,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 2
    },
    containerIconCheck: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 10
    },
    containerImg: {
        width: 60,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 0,
    },
    imgCapa: {
        width: 28,
        height: 28
    }
});

export default function ListItem({nome, texto, icone, click}) {
    

    return (
        <TouchableOpacity onPress={click ? () => click() : null} style={styles.row}>
            <View style={styles.containerIconCheck}>
                <List.Icon style={styles.icon} icon={icone} />
            </View>
            <View style={styles.container}>
                <List.Item
                    title={nome}
                    titleNumberOfLines={2}
                    description={texto}
                    descriptionNumberOfLines={5}
                />
            </View>
            <View style={styles.containerIconCheck}>
                <List.Icon style={styles.icon} icon={'chevron-right-circle-outline'} />
            </View>
        </TouchableOpacity>
    );
}