import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, LogBox, Linking, YellowBox } from 'react-native';
import { List, FAB, Portal, Provider as PaperProvider, DefaultTheme, Dialog, TextInput, Button } from 'react-native-paper';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colorCinza, colorPrimary, colorSecondary, colorSecondaryLight } from '../../constantes/cores';
import Pb from '../../components/Pb';
import HeaderVendas from '../../components/HeaderVendas/index.js';
import Detalhes from '../../components/DetalhesVenda';
import ItemVenda from '../../components/ItemVenda';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorSecondaryLight,
        accent: colorCinza,
        background: colorSecondary
    }
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: colorSecondaryLight
    },
    container: {
        flex: 1,
    },
    bottomSheet: {
        elevation: 16,
    },
    footer: {
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
        height: '100%',
        width: '100%',
    },
    buttons: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputDialog: {
        marginTop: 16
    },
    dados: {
        marginLeft: 0,
        padding: 0
    },
    footer: {
        height: 35
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

function getListaProdutos(prods, list) {

    let listaDeProdutos = list;

    for (let i = 0; i < prods.length; i++) {
        //prodRev
        const element = prods[i];

        let topPrd = {
            produtoName: element.produtoName,
            caminhoImg: element.caminhoImg,
            idProdut: element.idProdut,
            quantidade: element.quantidade
        };

        if (listaDeProdutos.length > 0) {
            let produtoJaExiste = false;
            for (let x = 0; x < listaDeProdutos.length; x++) {
                const itemListContagem = listaDeProdutos[x];
                if (element.idProdut === itemListContagem.idProdut) {
                    produtoJaExiste = true;
                    let newTopPrd = {
                        produtoName: itemListContagem.produtoName,
                        caminhoImg: itemListContagem.caminhoImg,
                        idProdut: itemListContagem.idProdut,
                        quantidade: itemListContagem.quantidade + element.quantidade
                    };

                    listaDeProdutos[x] = newTopPrd;

                    break;
                }
            }
            if (!produtoJaExiste) {
                listaDeProdutos.push(topPrd);
            }
        } else {
            listaDeProdutos.push(topPrd);
        }
    }

    return listaDeProdutos;
}

async function getRevendas(filtro, listener) {


    let refRevendas = firestore()
        .collection('Revendas')
        .where('hora', '>=', filtro.getTime())
        .orderBy("hora", "desc");



    await refRevendas.onSnapshot(querySnapshot => {

        let listaDeProdutos = [];
        let lista = [];

        let canceladas = 0;
        let atrasadas = 0;
        let novas = 0;
        let concluidas = 0;
        let emRota = 0;
        let tempoDemora = 0;

        let lista1 = [];
        let lista2 = [];
        let lista3 = [];
        let lista4 = [];
        let lista5 = [];

        let produtos1 = [];
        let produtos2 = [];
        let produtos3 = [];
        let produtos4 = [];
        let produtos5 = [];

        let listaErros = [];

        querySnapshot.forEach(documentSnapshot => {
            let obj = documentSnapshot.data();

            //dados da venda no banco de dados
            let uidVendedor = obj.uidUserRevendedor;
            let nomeVendedor = obj.userNomeRevendedor;
            let uidAdm = obj.uidAdm;
            let totalPedido = obj.valorTotal;
            let comissaoDaVenda = obj.comissaoTotal;
            let existeAdm = obj.existeComissaoAfiliados;
            let statusPedido = obj.statusCompra;
            let prods = obj.listaDeProdutos;

            lista.push(obj);
            listaDeProdutos = getListaProdutos(prods, listaDeProdutos);


            switch (statusPedido) {
                case 1:
                    novas++;
                    lista1.push(obj);
                    produtos1 = getListaProdutos(prods, produtos1);
                    break;
                case 2:
                    atrasadas++;
                    lista2.push(obj);
                    produtos2 = getListaProdutos(prods, produtos2);
                    break;
                case 3:
                    canceladas++;
                    lista3.push(obj);
                    produtos3 = getListaProdutos(prods, produtos3);
                    break;
                case 4:
                    emRota++;
                    lista4.push(obj);
                    produtos4 = getListaProdutos(prods, produtos4);
                    break;
                default:
                    concluidas++;
                    lista5.push(obj);
                    produtos5 = getListaProdutos(prods, produtos5);
                    break;
            }



        });

        lista1.sort((a, b) => a.hora - b.hora);
        lista1.reverse();
        lista2.sort((a, b) => a.hora - b.hora);
        lista2.reverse();
        lista3.sort((a, b) => a.hora - b.hora);
        lista3.reverse();
        lista4.sort((a, b) => a.hora - b.hora);
        lista4.reverse();
        lista5.sort((a, b) => a.hora - b.hora);
        lista5.reverse();
        lista.sort((a, b) => a.hora - b.hora);
        lista.reverse();

        listaDeProdutos.sort((a, b) => b.quantidade - a.quantidade);
        produtos1.sort((a, b) => b.quantidade - a.quantidade);
        produtos2.sort((a, b) => b.quantidade - a.quantidade);
        produtos3.sort((a, b) => b.quantidade - a.quantidade);
        produtos4.sort((a, b) => b.quantidade - a.quantidade);
        produtos5.sort((a, b) => b.quantidade - a.quantidade);



        if (lista2.length > 0) {
            tempoDemora = lista2[lista2.length - 1].hora;
        }

        const resumo = {
            numAtrasadas: atrasadas,
            numEmRota: emRota,
            numConcluidas: concluidas,
            numNovas: novas,
            numCanceladas: canceladas,
            maisAtrasada: tempoDemora,
            listAtrasadas: lista2,
            listNovas: lista1,
            listEmRota: lista4,
            listCanceladas: lista3,
            listConcluidas: lista5,
            lista: lista,
            produtosNovas: produtos1,
            produtosAtrasadas: produtos2,
            produtosCanceladas: produtos3,
            produtosEmRotas: produtos4,
            produtosConcluidas: produtos5,
            produtos: listaDeProdutos
        };

        return listener(resumo);

    }).catch(error => {
        return listener(null);
    });

}

export default function NovaVendas({ navigation }) {

    LogBox.ignoreAllLogs();


    const [pb, setPb] = useState(true);
    const [resumo, setResumo] = useState(null);
    const [status, setStatus] = useState(0);

    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    const [filtro, setFiltro] = useState(d);

    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }) => setState({ open });


    const changeFiltro = (tipo) => {
        let d = new Date();
        switch (tipo) {
            case 1:
                // 24h
                d = new Date();
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d.setMilliseconds(0);
                setFiltro(d);
                break;
            case 2:
                // 48h
                d = new Date();
                d.setHours(d.getHours() - 48);
                setFiltro(d);
                break;
            case 3:
                // 1semana
                d = new Date();
                d.setHours(d.getHours() - 168);
                setFiltro(d);
                break;
            case 4:
                // 1mes
                d = new Date();
                d.setHours(d.getHours() - 730);
                setFiltro(d);
                break;
        }
    };

    const { open } = state;

    const [itemDetalhe, setItemDetalhe] = useState(null);

    const bottomSheetRef = useRef();
    const [index, setIndex] = useState(-1);


    const snapPoints = useMemo(() => ['95%'], []);

    const [visible, setVisible] = useState(false);
    const [nmrWhats, setNmrWhats] = useState('');

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log('Show detalhe ', index);
        setIndex(index);

    }, []);



    let close = () => {
        if (bottomSheetRef.current !== undefined) {
            bottomSheetRef.current.close();
        }
    };

    let classificar = (sts) => {
        setStatus(sts);
    };

    let titulo = '';

    if (itemDetalhe !== null) {
        titulo = `${itemDetalhe.userNomeRevendedor} vendeu ${itemDetalhe.listaDeProdutos[0].quantidade} ${itemDetalhe.listaDeProdutos[0].produtoName.toLowerCase()} \nBairro ${itemDetalhe.complemento}`;
    }

    const DetalheFragment = ({ data }) => {
        return (
            <Detalhes
                close={close}
                show={() => {
                    //showDialog();
                    navigation.navigate('Conversa', { num: itemDetalhe.phoneCliente, texto: getTextoWhats(), prod: itemDetalhe.listaDeProdutos[0].produtoName.toUpperCase(), nom: itemDetalhe.nomeCliente, pag: getFormaPagamento(itemDetalhe.formaDePagar) });
                }}
                cancel={() => {
                    close();
                    navigation.navigate('Cancelamento', { item: itemDetalhe });
                }}
                item={data}
            />
        );
    };


    const elemento = <DetalheFragment data={index === -1 ? null : itemDetalhe} />;


    const click = useCallback((item) => {

        console.log('click item');
        setItemDetalhe(item);

        if (bottomSheetRef.current !== undefined) {
            console.log('expand ');
            bottomSheetRef.current.expand();
        }
    }, []);


    useEffect(() => {
        setPb(true);
        getRevendas(filtro, (objResumo) => {
            if (!objResumo) {
                setResumo(null);
                setPb(true);
            }
            setResumo(objResumo);
            setPb(false);
        });

        return () => {
            setResumo(null);
            setPb(true);
        };

    }, [filtro]);

    if (pb) {
        return <Pb />;
    }

    let DATA_LIST = [];
    let TITULO_LIST = 'Todas as Vendas';
    let PRODS = resumo.produtos;

    switch (status) {
        case 1:
            DATA_LIST = resumo.listNovas;
            TITULO_LIST = 'Vendas Novas';
            PRODS = resumo.produtosNovas;
            break;
        case 2:
            DATA_LIST = resumo.listAtrasadas;
            TITULO_LIST = 'Vendas Atrasadas';
            PRODS = resumo.produtosAtrasadas;
            break;
        case 3:
            DATA_LIST = resumo.listCanceladas;
            TITULO_LIST = 'Vendas Canceladas';
            PRODS = resumo.produtosCanceladas;
            break;
        case 4:
            DATA_LIST = resumo.listEmRota;
            TITULO_LIST = 'Vendas Em Rota';
            PRODS = resumo.produtosEmRotas;
            break;
        case 5:
            DATA_LIST = resumo.listConcluidas;
            TITULO_LIST = 'Vendas Concluidas';
            PRODS = resumo.produtosConcluidas;
            break;
        default:
            DATA_LIST = resumo.lista;
            TITULO_LIST = 'Todas as Vendas';
            PRODS = resumo.produtos;
            break;
    }

    const getTextoWhats = () => {
        return `Olá, ${itemDetalhe.nomeCliente}\n\nSou do setor de suporte ao cliente aqui da empresa Favorita\n\nO motivo do meu contato é confirmar a compra do Produto:\n${itemDetalhe.listaDeProdutos[0].produtoName.toUpperCase()}\n\nO motoboy vai entrar em contato por whatsapp ou ligação quando estiver próximo a sua residência\n\nPrazo de entrega de 1 a 3 horas\nSe tiver alguma observação sobre o tempo de entrega pode me avisar agora pra eu dá prioridade a sua entrega\n\nPAGAMENTO NO PIX É FEITO NO MOMENTO DA ENTREGA PELO QR CODE NA MÁQUININHA OU PELA CHAVE PIX OFICIAL:\n\ncomprafavoritaofc@gmail.com`;
    };

    const abrirWhats = (nmr) => Linking.openURL(`https://api.whatsapp.com/send?phone=55${nmr}&text=${getTextoWhats()}`);

    return (
        <PaperProvider style={styles.container}>
            <Portal>

                <View style={styles.containerBottom}>
                    <FlatList
                        keyExtractor={item => item.idCompra}
                        data={DATA_LIST}
                        ListHeaderComponent={() => <HeaderVendas resumo={resumo} prods={PRODS} classificar={classificar} title={TITULO_LIST} maisAtrasada={resumo.maisAtrasada} canceladas={resumo.numCanceladas} concluidas={resumo.numConcluidas} emRota={resumo.numEmRota} atrasadas={resumo.numAtrasadas} novas={resumo.numNovas} />}
                        renderItem={({ item }) => <ItemVenda click={click} key={item.idCompra} item={item} />}
                    />
                    <BottomSheet
                        style={styles.bottomSheet}
                        ref={bottomSheetRef}
                        index={index}
                        enablePanDownToClose={true}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}>
                        <BottomSheetScrollView>
                            {elemento}
                        </BottomSheetScrollView>
                    </BottomSheet>
                </View>


                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Verificar Numero</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Exemplo: 92991344773</Text>
                        <TextInput
                            style={styles.inputDialog}
                            defaultValue={nmrWhats}
                            onChangeText={(value) => {
                                setNmrWhats(value);
                            }}
                            label="Numero"
                            mode='outlined'
                            theme={theme}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button theme={theme} onPress={() => abrirWhats(nmrWhats)}>Iniciar Conversa</Button>
                    </Dialog.Actions>
                </Dialog>


                <FAB.Group
                    theme={theme}
                    fabStyle={styles.fab}
                    open={open}
                    icon={'filter'}
                    backdropColor='#00000070'
                    actions={[
                        {
                            icon: 'calendar-month',
                            label: '1 mês',
                            containerStyle: styles.fab,
                            style: styles.fab,
                            onPress: () => changeFiltro(4),
                        },
                        {
                            icon: 'calendar-week',
                            label: '1 semana',
                            containerStyle: styles.fab,
                            style: styles.fab,
                            onPress: () => changeFiltro(3),
                        },
                        {
                            icon: 'calendar-today',
                            label: '48 horas',
                            containerStyle: styles.fab,
                            style: styles.fab,
                            onPress: () => changeFiltro(2),
                        },
                        {
                            icon: 'calendar-clock',
                            label: 'Hoje',
                            containerStyle: styles.fab,
                            style: styles.fab,
                            onPress: () => changeFiltro(1),
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>
        </PaperProvider>
    );
}