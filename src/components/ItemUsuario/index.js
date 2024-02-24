import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { List, DefaultTheme, Divider } from 'react-native-paper';
import { colorCinza, colorPrimary, colorSecondaryLight } from '../../constantes/cores';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const theme = {
    ...DefaultTheme,
    color: {
        primary: '#000',

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorSecondaryLight,
        paddingLeft: 20,
        paddingRight: 6
    },
    description: {
        backgroundColor: colorSecondaryLight,
    },
    item: {
        backgroundColor: colorSecondaryLight,
    },
    spacing: {
        height: 22,
        backgroundColor: colorSecondaryLight,
    },
    iconeContainer: {
        height: '100%',
        padding: 0,
        margin: 0,
    },
    icone: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 6,
        marginLeft: 4,
        marginRight: 4
    },
    pathFoto: {
        width: 40,
        height: 40,
        borderRadius: 20
    }
});

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default function ItemUsuario({ dados, click }) {
    //console.log(dados)
    return (
        <TouchableWithoutFeedback onPress={click}>
            <Divider />
            <List.Item
                theme={theme}
                style={styles.container}
                descriptionStyle={styles.description}
                description={`${new Date(dados.primeiroLogin).toLocaleDateString()} - ${new Date(dados.primeiroLogin).toLocaleTimeString()}`}
                titleStyle={{ color: colorCinza }}
                title={dados?.nome}
                left={props => <View style={styles.iconeContainer} ><Image style={styles.pathFoto} source={{uri: dados.pathFoto}} /></View>}
                right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>} />
        </TouchableWithoutFeedback>
    );
}