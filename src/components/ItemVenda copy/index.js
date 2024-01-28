import React from 'react';
import { TouchableOpacity, View, StyleSheet} from 'react-native';
import { List, DefaultTheme, Avatar, Subheading, Card, Button } from 'react-native-paper';
import { colorCinza, colorPrimary } from '../../Cores';
import {getFormaPagamento} from '../../Objects/Compra';
import Ficha from '../Ficha';

let theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,
        accent: colorCinza
    }
}

const styles = StyleSheet.create({
    subheader: {
        marginLeft: -8,
        marginRight: 20
    },
    dados: {
        margin: 0,
        padding: 0
    },
    footer: {
        height: 20
    },
    icone: {
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        marginTop: 1,
    },
    bt: {
        fontSize: 30
    },
    botao: {
        margin: 6
    }
});

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
}

export default function ItemVenda({item}) {
    let {itensCompra, hora, nomeVendedor, endereco, contatoCliente, nomeCliente, total} = item;

    let {bairro, rua, numero} = endereco;

    let hoje = new Date().toLocaleDateString();
    let varDate = new Date(hora);
    let dataVenda = varDate.toLocaleDateString();
    let data = 'Hoje';

    if(dataVenda !== hoje) {
        //data = `${varDate.getUTCDate()}/${varDate.getMonth()}/${varDate.getFullYear()}`;
        data = dateToYMD(varDate);
    }

    return (
        <View>
            <List.Accordion
                expanded={true}
                theme={theme}
                title={`${data} as ${new Date(hora).toLocaleTimeString()}`}
                titleStyle={{color: colorCinza, fontWeight: 'bold'}}
                descriptionNumberOfLines={6}
                
                description={`${nomeVendedor} vendeu ${itensCompra[0].quantidade} ${itensCompra[0].nome.toLowerCase()} \nEndereço: ${rua} \nCasa N°${numero} \nBairro: ${bairro} \nTotal: R$${total} no ${getFormaPagamento(item.formaDePagamento)}`}
            >


                <List.Section>
                    <Ficha item={item} />
                </List.Section>


                <Card.Actions>
                    <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="alert-circle-check"/>
                    <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="rocket-launch"/>
                    <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="close-box"/>
                    <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="shield-check"/>

                </Card.Actions>

                <View style={styles.footer} />
                        
            </List.Accordion>
        </View>
    );
}