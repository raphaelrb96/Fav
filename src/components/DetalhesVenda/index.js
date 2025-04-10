import Pb from "../Pb";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { List, Card, Portal, Provider, DefaultTheme, Button, Headline, Divider, Icon, TextInput } from 'react-native-paper';
import { colorCinza, colorPrimary, colorPrimaryDark, colorSecondaryDark, colorSecondaryLight } from '../../constantes/cores';
import ItemProdutoVenda from "../ItemProdutoVenda";
import firestore from '@react-native-firebase/firestore';
import Clipboard from '@react-native-clipboard/clipboard';

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
        display: 'flex',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    dados: {
        marginLeft: -8,
        paddingEnd: 32,
        paddingLeft: 0,
        paddingBottom: 0,
        paddingTop: 4
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
        fontSize: 14,
        padding: 0,
        margin: 0
    },
    botao: {
        marginHorizontal: 6,
        flex: 1
    },
    subheader: {
        marginLeft: 8,
        marginRight: 20,
        marginTop: 0,
        marginBottom: 8
    },
    btnMensagem: {
        left: 0,
        right: 0,
        flex: 1,
        marginTop: 16
    },
    spacingBottomEnd: {
        height: 120
    },
    titleBold: {
        fontWeight: 'bold',
        color: 'black'
    },
    input: {
        marginRight: 16,
        marginLeft: 16,
        paddingBottom: 0,
        marginBottom: 10,
        maxHeight: 250,
        backgroundColor: 'transparent'
    },
    iconInput: {
        marginTop: 6,
    },
    btnSalvarValores: {
        marginBottom: 6,
        marginHorizontal: 16,
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

function renderIcon(source) {
    return (
        <Icon
            source={source}
            size={22}
            color={colorCinza}
        />
    )
}

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



export default function Detalhes({ item, close, show, cancel, editar }) {

    const [pb, setPb] = useState(false);



    if (item === null || pb) {
        return <Pb />;
    }

    const { statusCompra, comissaoTotal, nomeCliente, phoneCliente, adress, estado, complemento, pagamentoFinal, parcelaFinal, cep, cidade, obs, entregaFinal, listaDeProdutos, idCompra, garantiaFinal, uidUserRevendedor, existeComissaoAfiliados } = item;


    let atualizar = (state) => {

        if (statusCompra === 3 || statusCompra === 5) {
            Alert.alert("Acesso negado", "Venda concluida ou cancelada so pode ser editada pelo gerente");
            return null;
        }

        const finalizar = () => {
            close();
            updateVenda(state, item, (sucess) => {
                if (sucess) {
                    //refresh();

                }
            });
        };


        finalizar();

    };

    const copiarInformacoes = () => {
        let stringClipCopy = String(`⏱️ ${new Date(item.hora).toLocaleString()} \n📱 ${phoneCliente} \n👨🏻‍💼 ${nomeCliente} \n🏠 ${complemento} \n💰 TOTAL: ${formartar(item.valorTotal)} \n${item.listaDeProdutos.map(obj => `📦 ${obj.quantidade} - ${obj.produtoName.toUpperCase()}\n`)}`).toLocaleUpperCase();
        Clipboard.setString(stringClipCopy);
    };

    function Actions() {

        //ATUALIZAR ACESS ABERTO = FALSE
        //QUANDO A VERSAO FOR DIFERENTE DO ADMIN
        const [acess, setAcess] = useState({
            login: '',
            senha: '',
            aberto: true
        });

        const setData = () => {
            setAcess((prevState) => ({
                ...prevState,

            }));
        };


        const liberar = () => {
            if (acess.login === '0senha' && acess.senha === '0login') {
                setAcess((prevState) => ({
                    ...prevState,
                    aberto: true
                }));
            }

        };

        const setLogin = (e) => {
            console.log(e)
            setAcess((prevState) => ({
                ...prevState,
                login: e
            }));
        };

        const setSenha = (e) => {
            setAcess((prevState) => ({
                ...prevState,
                senha: e
            }));
        };


        if ((item.statusCompra === 3 || item.statusCompra === 5) && !acess.aberto) {
            return (
                <>
                    <View style={styles.spacing} />
                    <Divider style={styles.divider} />
                    <View style={styles.spacing} />
                    <Headline style={styles.subheader}>Acesso bloquado a vendas concluidas e canceladas</Headline>
                    <View style={styles.spacing} />

                    <TextInput
                        theme={theme}
                        defaultValue={acess.login}
                        label="Login"
                        mode="outlined"
                        style={styles.input}
                        onChangeText={setLogin}
                    />

                    <TextInput
                        theme={theme}
                        defaultValue={acess.senha}
                        label="Senha"
                        mode="outlined"
                        style={styles.input}
                        onChangeText={setSenha}
                    />
                    <View style={styles.spacing} />
                    <View style={styles.spacing} />
                    <View style={styles.spacing} />

                    <Button
                        compact
                        style={styles.btnSalvarValores}
                        onPress={liberar}
                        buttonColor='#00000020'
                        mode='contained-tonal'>Liberar Acesso</Button>
                </>
            );
        }

        return (
            <View>
                <View style={styles.spacing} />
                <Divider style={styles.divider} />
                <View style={styles.spacing} />
                <View style={styles.spacing} />

                <Card.Actions style={styles.buttons}>
                    <Button mode="outlined" uppercase onPress={() => atualizar(2)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon={() => renderIcon("alert-circle-check")}>
                        Confirmar
                    </Button>
                    <Button mode="outlined" uppercase onPress={() => atualizar(4)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon={() => renderIcon("rocket-launch")}>
                        Liberar
                    </Button>

                </Card.Actions>

                <Card.Actions style={styles.buttons}>
                    <Button mode="outlined" uppercase onPress={() => cancel(3)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon={() => renderIcon("close-box")}>
                        Cancelar
                    </Button>
                    <Button mode="outlined" uppercase onPress={() => atualizar(5)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon={() => renderIcon("shield-check")}>
                        concluir
                    </Button>

                </Card.Actions>

                <Card.Actions style={styles.buttons}>
                    {
                        <Button uppercase onPress={() => editar()} theme={theme} style={styles.btnMensagem} icon={() => renderIcon("lock-outline")} mode="outlined" ><Text>Editar Informações</Text></Button>

                    }

                </Card.Actions>


            </View>
        );
    }


    // renders
    return (
        <View style={styles.detalhe}>
            <List.Section>

                <Headline style={styles.subheader}>Produtos do Pedido</Headline>

                {item.listaDeProdutos.map(obj => <ItemProdutoVenda style={styles.dados} key={obj.idProdut} path={obj.caminhoImg} title={`${obj.quantidade} ${obj.produtoName.toLowerCase()}`} produto={obj} description={`R$ ${(obj.valorUni * obj.quantidade)},00`} />)}

                <View style={styles.spacing} />
                <Divider style={styles.divider} />
                <View style={styles.spacing} />

                <Headline style={styles.subheader}>Informações do Pedido</Headline>
                <List.Item style={styles.dados} titleStyle={styles.titleBold} descriptionStyle={styles.titleBold} title={formartar(item.valorTotal)} description={'Valor total a pagar'} />
                <List.Item style={styles.dados} title={phoneCliente} titleNumberOfLines={5} description={nomeCliente} />
                {obs ? <List.Item style={styles.dados} titleNumberOfLines={5} title={item.obs} description={'Observações'} /> : null}
                <List.Item style={styles.dados} title={adress} titleNumberOfLines={5} description={complemento} />
                {(cidade && estado) ? <List.Item style={styles.dados} title={cidade} description={estado} /> : null}
                <List.Item style={styles.dados} title={pagamentoFinal ? pagamentoFinal.titulo : getFormaPagamento(item.formaDePagar)} description={(parcelaFinal && (pagamentoFinal.id === 3 || pagamentoFinal.id === 2)) ? parcelaFinal.titulo : 'Pagamento à vista'} />
                {(parcelaFinal && (pagamentoFinal.id === 3 || pagamentoFinal.id === 2)) ? <List.Item style={styles.dados} title={parcelaFinal.descricao} description={parcelaFinal.valorString} /> : null}
                {entregaFinal ? <List.Item style={styles.dados} title={entregaFinal.valorString} description={'Taxa de ' + entregaFinal.titulo} /> : null}
                {garantiaFinal ? <List.Item style={styles.dados} title={garantiaFinal.titulo + ': ' + garantiaFinal.valorString} descriptionNumberOfLines={4} description={garantiaFinal.descricao} /> : null}

                <Card.Actions style={styles.buttons}>
                    <Button uppercase onPress={() => copiarInformacoes()} theme={theme} style={styles.btnMensagem} mode="outlined" ><Text>Copiar Informações</Text></Button>
                </Card.Actions>

                <View style={styles.spacing} />
                <Divider style={styles.divider} />
                <View style={styles.spacing} />



                <Headline style={styles.subheader}>Detalhes do Vendedor</Headline>
                <List.Item style={styles.dados} title={dateToYMD(new Date(item.hora))} description={'Data e hora da venda'} />
                <List.Item style={styles.dados} title={item.userNomeRevendedor} description={`${formartar(item.comissaoTotal)} de Comissão`} />
                <List.Item style={styles.dados} title={getStatus(item.statusCompra)} description={'Status da venda'} />


                <View style={styles.spacing} />
                <Divider style={styles.divider} />
                <View style={styles.spacing} />
                <View style={styles.spacing} />

                <Headline style={styles.subheader}>Detalhes do Cliente</Headline>

                {
                    //item.statusCompra === 3 && item.idCancelamento
                    item.idCancelamento !== 0
                        ?
                        <List.Item style={styles.dados} title={item.idCancelamento === -1 ? item.detalheCancelamento : getMotivoCancelamento(item.idCancelamento)} titleNumberOfLines={3} description={'Motivo do Cancelamento'} />
                        :
                        null
                }

                <Card.Actions style={styles.buttons}>
                    <Button uppercase onPress={() => show()} theme={theme} style={styles.btnMensagem} mode="contained" ><Text>Abrir Whatsapp</Text></Button>

                </Card.Actions>



            </List.Section>



            <Actions />

            <View style={styles.spacingBottomEnd} />
        </View>
    );
}