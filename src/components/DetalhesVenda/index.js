import Pb from "../Pb";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { List, Card, Portal, Provider, DefaultTheme, Button, Headline, Divider } from 'react-native-paper';
import { colorCinza, colorPrimary, colorPrimaryDark } from '../../constantes/cores';
import ItemProdutoVenda from "../ItemProdutoVenda";
import firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheet: {
        elevation: 8
    },
    spacing: {
        height: 20
    },
    detalhe: {
        paddingLeft: 20,
        paddingRight: 20
    },
    containerBottom: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 10,
        height: '100%',
        width: '100%',
    },
    buttons: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dados: {
        marginLeft: 0,
        paddingEnd: 32,
        padding: 0
    },
    spacing: {
        height: 16
    },
    divider: {
        height: 1.5
    },
    icone: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 14
    },
    bt: {
        fontSize: 25
    },
    botao: {
        margin: 6
    },
    subheader: {
        marginLeft: 8,
        marginRight: 20,
        marginTop: 0,
        marginBottom: 8
    },
});

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,

    }
}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

function getMotivoCancelamento(id) {
    switch (id) {
        case 1:
            return 'Produto está em falta no estoque e indisponivel no fornecedor';
        case 2:
            return 'Produto está em falta no estoque e não conseguimos pegar no fornecedor';
        case 3:
            return 'Produto era falta no estoque e não chegou no tempo que o cliente desejava';
        case 4:
            return 'O cliente desistiu por causa de um longo tempo de entrega';
        case 5:
            return 'O cliente desistiu por exigir que a entrega fosse imediata';
        case 6:
            return 'O cliente desistiu na hora da entrega por nao está de acordo com as caracteristicas do produto';
        case 7:
            return 'Venda cadastrada com informações ou quantidade erradas';
        case 8:
            return 'Cliente não respondeu, ou não atendeu o suporte';
        case 9:
            return 'Cliente desistiu da compra antes do pedido sair da loja';
        default:
            return 'Nenhum motivo declarado';
    }
}

function getStatus(s) {
    switch (s) {
        case 1:
            return 'Aguardando Confirmação';
        case 2:
            return 'Confirmada';
        case 3:
            return 'Cancelada';
        case 4:
            return 'Saiu para entrega';
        case 5:
            return 'Concluida';
    }
}

function getFormaPagamento(n) {
    switch (n) {
        case 4:
            return 'Dinheiro';
        case 5:
            return 'Pix';
        case 3:
            return 'Crédito Parcelado';
        case 1:
            return 'Cartão Débito';
        case 2:
            return 'Crédito Avista';
        default:
            return 'Cartão';
    }
};

async function updateVenda(state, item, callback) {

    const batch = firestore().batch();

    let rev1 = firestore().collection('Revendas').doc(item.idCompra);
    let rev2 = firestore().collection('MinhasRevendas').doc('Usuario').collection(item.uidUserRevendedor).doc(item.idCompra);

    batch.update(rev1, 'statusCompra', state);
    batch.update(rev2, 'statusCompra', state);

    if (state !== 3) {
        batch.update(rev1, 'idCancelamento', 0);
        batch.update(rev2, 'idCancelamento', 0);

        batch.update(rev1, 'detalheCancelamento', '');
        batch.update(rev2, 'detalheCancelamento', '');
    }

    if (item.existeComissaoAfiliados) {
        let afl1 = firestore().collection('ComissoesAfiliados').doc(item.idCompra);
        let afl2 = firestore().collection('MinhasComissoesAfiliados').doc('Usuario').collection(item.uidAdm).doc(item.idCompra);
        batch.update(afl1, 'statusComissao', state);
        batch.update(afl2, 'statusComissao', state);
    }

    await batch.commit().then(() => {
        return callback(true);
    }).catch(error => {
        return callback(false);
    });

}



export default function Detalhes({ item, close, show, cancel }) {

    const [pb, setPb] = useState(false);



    if (item === null || pb) {
        return <Pb />;
    }

    const { comissaoTotal, nomeCliente, phoneCliente, adress, estado, complemento, pagamentoFinal, parcelaFinal, cep, cidade, obs, entregaFinal, listaDeProdutos, idCompra, garantiaFinal, uidUserRevendedor, existeComissaoAfiliados } = item;


    let atualizar = (state) => {

        //setPb(true);
        close();
        updateVenda(state, item, (sucess) => {
            if (sucess) {
                //refresh();

            }
        });
    };



    // renders
    return (
        <View style={styles.detalhe}>
            <List.Section>

                <View style={styles.spacing} />
                <Headline style={styles.subheader}>Produtos do Pedido</Headline>

                {item.listaDeProdutos.map(obj => <ItemProdutoVenda style={styles.dados} key={obj.idProdut} path={obj.caminhoImg} title={`${obj.quantidade} ${obj.produtoName.toLowerCase()}`} produto={obj} description={`R$ ${(obj.valorUni * obj.quantidade)},00`} />)}

                <View style={styles.spacing} />
                <Divider style={styles.divider} />
                <View style={styles.spacing} />


                <Headline style={styles.subheader}>Informações do Pedido</Headline>
                <List.Item style={styles.dados} title={phoneCliente} titleNumberOfLines={5} description={'Numero pra Contato'} />
                <List.Item style={styles.dados} title={nomeCliente} titleNumberOfLines={5} description={'Nome do comprador'} />
                {obs ? <List.Item style={styles.dados} titleNumberOfLines={5} title={item.obs} description={'Observações'} /> : null}
                <List.Item style={styles.dados} title={adress} titleNumberOfLines={5} description={'Endereço e numero da casa'} />
                <List.Item style={styles.dados} title={complemento} titleNumberOfLines={5} description={'Bairro'} />
                {(cep) ? <List.Item style={styles.dados} title={cep} description={'CEP'} /> : null}
                {(cidade) ? <List.Item style={styles.dados} title={cidade} description={'Cidade'} /> : null}
                {(estado) ? <List.Item style={styles.dados} title={estado} description={'Estado'} /> : null}
                <List.Item style={styles.dados} title={pagamentoFinal ? pagamentoFinal.titulo : getFormaPagamento(item.formaDePagar)} description={'Forma de pagamento'} />
                {(parcelaFinal && (pagamentoFinal.id === 3 || pagamentoFinal.id === 2)) ? <List.Item style={styles.dados} title={parcelaFinal.titulo} description={parcelaFinal.valorString} /> : null}
                <List.Item style={styles.dados} title={formartar(item.valorTotal)} description={'Valor total a pagar'} />
                {entregaFinal ? <List.Item style={styles.dados} title={entregaFinal.valorString} description={entregaFinal.titulo} /> : null}
                {garantiaFinal ? <List.Item style={styles.dados} title={garantiaFinal.titulo + ': ' + garantiaFinal.valorString} descriptionNumberOfLines={4} description={garantiaFinal.descricao} /> : null}

                <View style={styles.spacing} />
                <Divider style={styles.divider} />
                <View style={styles.spacing} />

                <Headline style={styles.subheader}>Detalhes do Vendedor</Headline>
                <List.Item style={styles.dados} title={dateToYMD(new Date(item.hora))} description={'Data e hora da venda'} />
                <List.Item style={styles.dados} title={item.userNomeRevendedor} description={`${formartar(item.comissaoTotal)} de Comissão`} />
                <List.Item style={styles.dados} title={getStatus(item.statusCompra)} description={'Status da venda'} />

                {
                    //item.statusCompra === 3 && item.idCancelamento
                    item.idCancelamento !== 0
                        ?
                        <List.Item style={styles.dados} title={item.idCancelamento === -1 ? item.detalheCancelamento : getMotivoCancelamento(item.idCancelamento)} titleNumberOfLines={3} description={'Motivo do Cancelamento'} />
                        :
                        null
                }

            </List.Section>

            <View style={styles.spacing} />
            <Divider style={styles.divider} />
            <View style={styles.spacing} />

            <Card.Actions style={styles.buttons}>
                <Button mode="contained" onPress={() => atualizar(2)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="alert-circle-check" />
                <Button mode="contained" onPress={() => atualizar(4)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="rocket-launch" />
                <Button mode="contained" onPress={() => cancel(3)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="close-box" />
                <Button mode="contained" onPress={() => atualizar(5)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="shield-check" />

            </Card.Actions>

            <Card.Actions style={styles.buttons}>
                <Button onPress={() => show()} theme={theme} mode="outlined" ><Text>Abrir Whatsapp</Text></Button>

            </Card.Actions>

            <View style={styles.spacing} />
        </View>
    );
}