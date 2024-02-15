import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { List, DefaultTheme, Avatar, Subheading, Card, Button, Divider, Caption } from 'react-native-paper';
import { colorCinza } from '../../constantes/cores';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,
        accent: colorCinza
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 0.5,
        borderBottomColor: '#00000030',
        paddingBottom: 20,
        backgroundColor: 'white',
        marginBottom: 0
    },
    subheader: {
        marginLeft: -8,
        marginRight: 20
    },
    dados: {
        margin: 0,
        marginLeft: 16,
        marginBottom: 0,
        paddingBottom: 0
    },
    footer: {
        height: 20
    },
    iconeContainer: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 0,
        margin: 0,
    },
    icone: {

    },
    bt: {
        fontSize: 30
    },
    botao: {
        margin: 6
    },
    title: {
        color: colorCinza,
        fontWeight: 'bold'
    },
    caption: {
        marginLeft: 32,
        marginTop: 0,
        fontSize: 16
    },
    spacing: {
        height: 16
    },
    divider: {
    }
});


export default function ItemSolicitacaoAgendamento({ solicitacao, click }) {

    const { bank, chave, id, titular, valorFinal, status, nome, foto, apelido, uid, timestampCreated } = solicitacao;

    return (
        <TouchableOpacity style={styles.container} onPress={click}>
            <List.Section >
                <List.Item
                    theme={theme}
                    style={styles.dados}
                    title={`Solicitação de ${nome}`}
                    titleNumberOfLines={2}
                    titleStyle={styles.title}
                    descriptionNumberOfLines={8}
                    description={`${new Date(timestampCreated).toLocaleDateString()} às ${new Date(timestampCreated).toLocaleTimeString()}`}
                    right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>}
                />

                <Text style={styles.caption}>
                    {`VALOR APROXIMADO: R$${valorFinal.toFixed(0)}`}
                </Text>



            </List.Section>
        </TouchableOpacity>

    );
}