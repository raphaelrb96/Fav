import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { List, DefaultTheme, Avatar, Subheading, Card, Button, Divider, Caption } from 'react-native-paper';
import { colorCinza, colorCinzaClaro } from '../../constantes/cores';

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
    content: {
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        padding: 0,
        margin: 0,
        marginLeft: 6
    },
    icone: {
        marginTop: 4
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
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        fontSize: 14,
        color: colorCinzaClaro
    },
    spacing: {
        height: 16
    },
    divider: {
    }, 
    mTop: {
        marginTop: 12
    }
});


export default function ItemSolicitacaoAgendamento({ solicitacao, click }) {

    const { bank, chave, id, titular, valorFinal, status, nome, foto, apelido, uid, previsao, timestampCreated } = solicitacao;

    function Right() {
        return (
            <View style={styles.iconeContainer}>
                <List.Icon style={styles.icone} icon={previsao ? "check-decagram" : "check-decagram-outline"} />
            </View>
        );
    };

    function Description() {
        return (
            <>

                <Text>
                    {`${new Date(timestampCreated).toLocaleDateString()} às ${new Date(timestampCreated).toLocaleTimeString()}`}
                </Text>

                <Text style={[styles.caption, styles.mTop]}>
                    {`Valor aproximado: R$${valorFinal.toFixed(0)}`}
                </Text>

                {
                    previsao
                        ?
                        <Text style={styles.caption}>
                            {`Agendado para o dia ${previsao}`}
                        </Text>

                        :
                        null
                }

            </>
        );
    }

    return (
        <TouchableOpacity style={styles.container} onPress={click}>
            <List.Section style={styles.content}>
                <List.Item
                    theme={theme}
                    style={styles.dados}
                    title={`Solicitação de ${nome}`}
                    titleNumberOfLines={2}
                    titleStyle={styles.title}
                    descriptionNumberOfLines={8}
                    description={() => <Description />}
                    right={props => <Right />}
                />



            </List.Section>
        </TouchableOpacity>

    );
}