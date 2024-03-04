import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import ItemVenda from '../../components/ItemVenda';
import Pb from '../../components/Pb';
import Detalhes from '../../components/DetalhesVenda';
import ItemProduto from '../../components/ItemProduto';
import { Avatar, Caption, Card, DataTable, Headline, DefaultTheme, Button } from 'react-native-paper';
import { colorCinza } from '../../constantes/cores';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,

    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bottomSheet: {
        elevation: 18
    },
    sectionContainer: {
        marginTop: 16,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 14
    },
    spacing: {
        height: 16
    },
    center: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 24
    },
    centerText: {
        textAlign: 'center',

    },
    bold: {
        fontWeight: 'bold',
        color: '#000'
    },
    itemDados: {
        width: 125,

    },
    rowTable: {
        width: '100%',
        marginTop: 24,
        marginBottom: 24,
    },
    card: {
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 12,
        backgroundColor: '#fff',
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
        flex: 1,
        backgroundColor: '#FFF'
    },
    buttons: {
        display: 'flex',
        flex: 1,
        marginTop: 2,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
});

function renderIcon(source) {
    return (
        <Icon
            source={source}
            size={22}
            color={colorCinza}
        />
    )
}

const getListaProdutos = (prods, list) => {

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
};

const listarVendas = (uid, listener) => {


    const ref = firestore().collection('MinhasRevendas').doc('Usuario').collection(uid).limit(400);

    const onNext = snap => {

        if (!snap) {
            listener(null);
            return;

        }

        let lista = [];
        let produtos = [];

        if (snap != null && snap.size > 0) {

            snap.forEach(doc => {
                let objItem = doc.data();
                lista.push(objItem);
                let prods = objItem.listaDeProdutos;
                produtos = getListaProdutos(prods, produtos);
            });

            produtos.sort((a, b) => b.quantidade - a.quantidade);

        }

        listener(lista, produtos);

    };

    const onError = error => {
        listener(null);
    };

    const unsubscribe = ref.onSnapshot(onNext, onError);

    return unsubscribe;

};

function Header({ prods, state, usuario, navigation }) {

    const render = ({ item }) => {
        if (item === null || item === undefined) {
            return null;
        }
        return <ItemProduto path={item.caminhoImg} nome={`${item.quantidade} ${item.produtoName}`} />
    };

    const dataCadastro = `${new Date(usuario.primeiroLogin).toLocaleDateString()} às ${new Date(usuario.primeiroLogin).toLocaleTimeString()}`;
    const dataUltimoLogin = `${new Date(usuario.ultimoLogin).toLocaleDateString()} às ${new Date(usuario.ultimoLogin).toLocaleTimeString()}`;
    const userVip = ((usuario.uid === usuario.uidAdm) && usuario.vipDiamante);

    return (
        <View>
            <Card style={styles.card}>
                <View style={styles.center}>
                    <Avatar.Image size={130} source={{ uri: usuario.pathFoto }} />
                </View>

                <Headline style={[styles.centerText, styles.bold]}>{usuario.nome}</Headline>
                <Caption style={[styles.centerText, styles.bold]} >{`@${usuario.userName}`}</Caption>

                <DataTable style={styles.rowTable}>

                    {
                        userVip
                            ?
                            <DataTable.Row>
                                <DataTable.Cell>Vendedor</DataTable.Cell>
                                <DataTable.Cell numeric>Diamante</DataTable.Cell>
                            </DataTable.Row>
                            :
                            null
                    }
                    <DataTable.Row>
                        <DataTable.Cell>Contato</DataTable.Cell>
                        <DataTable.Cell numeric>{usuario.celular}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>E-mail</DataTable.Cell>
                        <DataTable.Cell numeric>{usuario.email}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Data de Cadastro</DataTable.Cell>
                        <DataTable.Cell numeric>{dataCadastro}</DataTable.Cell>
                    </DataTable.Row>

                </DataTable>

            </Card>

            <Card.Actions style={styles.buttons}>
                <Button mode="elevated" uppercase theme={theme} style={styles.botao} onPress={() => navigation.navigate('Saldo do Usuario', { usuario })} labelStyle={styles.bt}>
                    Saldo Total
                </Button>
            </Card.Actions>
            <Card.Actions style={styles.buttons}>
                <Button mode="elevated" uppercase theme={theme} style={styles.botao} onPress={() => {}} labelStyle={styles.bt}>
                    Historico Saques
                </Button>
            </Card.Actions>
            <Card.Actions style={styles.buttons}>
                <Button mode="elevated" uppercase theme={theme} style={[styles.botao]} onPress={() => navigation.navigate('Usuarios', { usuario })} labelStyle={styles.bt}>
                    Afiliados
                </Button>
            </Card.Actions>


            <View style={styles.spacing} />

            {
                state.historico?.length > 0
                    ?
                    <>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>
                                Historico de Vendas
                            </Text>
                        </View>

                        <FlatList
                            data={prods}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={render}
                            ListHeaderComponent={() => <View style={{ width: 14 }} />}
                            ListFooterComponent={() => <View style={{ width: 30 }} />}
                        />

                        <View style={styles.spacing} />
                    </>
                    :
                    null
            }




        </View>
    );

};



function Content({ state, setState, navigation, expand, usuario }) {

    const { historico, load } = state;

    if (load) return <Pb />;

    const detalhes = (item) => {
        //navigation.navigate('Detalhes Agendamento', { item: item });
        setState((prevState) => ({
            ...prevState,
            vendaSelected: item
        }));

        expand();
    };


    return (
        <FlatList
            style={styles.list}
            data={historico}
            ListHeaderComponent={() => <Header prods={state.produtos} usuario={usuario} state={state} navigation={navigation} />}
            renderItem={({ item }) => <ItemVenda item={item} click={() => detalhes(item)} />}
        />
    );
};

export default function DetalhesUsuario({ navigation, route }) {

    const usuario = route.params.usuario;

    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        historico: null,
        load: true,
        vendaSelected: null
    });

    const snapPoints = useMemo(() => ['80%'], []);

    const getTextoWhats = () => {
        return `Olá, ${state.vendaSelected.nomeCliente}\n\nSou do setor de suporte ao cliente aqui da empresa Favorita\n\nO motivo do meu contato é confirmar a compra do Produto:\n${state.vendaSelected.listaDeProdutos[0].produtoName.toUpperCase()}\n\nO motoboy vai entrar em contato por whatsapp ou ligação quando estiver próximo a sua residência\n\nPrazo de entrega de 1 a 3 horas\nSe tiver alguma observação sobre o tempo de entrega pode me avisar agora pra eu dá prioridade a sua entrega\n\nPAGAMENTO NO PIX É FEITO NO MOMENTO DA ENTREGA PELO QR CODE NA MÁQUININHA OU PELA CHAVE PIX OFICIAL:\n\ncomprafavoritaofc@gmail.com`;
    };

    const getFormaPagamento = (n) => {
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

    const close = () => useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const show = () => useCallback(() => {
        navigation.navigate('Conversa', { num: state.vendaSelected.phoneCliente, texto: getTextoWhats(), prod: state.vendaSelected.listaDeProdutos[0]?.produtoName.toUpperCase(), nom: state.vendaSelected.nomeCliente, pag: getFormaPagamento(state.vendaSelected.formaDePagar) });
    }, []);

    const cancel = () => useCallback(() => {
        close();
        navigation.navigate('Cancelamento', { item: state.vendaSelected });
    }, []);

    const editar = () => useCallback(() => {
        close();
        navigation.navigate('Editar Pedido', { produto: state.vendaSelected });
    }, []);

    const modalExpand = useCallback(() => {
        bottomSheetModalRef.current?.expand();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    useEffect(() => {

        setState((prevState) => ({
            ...prevState,
            load: true,

        }));

        const fetchData = () => {
            const listener = listarVendas(usuario.uid, (list, prods) => {
                //console.log('Listener Produto', list.length);
                setState((prevState) => ({
                    ...prevState,
                    load: false,
                    historico: list,
                    produtos: prods
                }));
            });

            return listener;
        };

        return fetchData();


    }, [usuario]);


    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>

                <Content
                    usuario={usuario}
                    navigation={navigation}
                    expand={modalExpand}
                    setState={setState}
                    state={state} />

                <BottomSheet
                    ref={bottomSheetModalRef}
                    index={index}
                    style={styles.bottomSheet}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}>
                    <BottomSheetScrollView>
                        <Detalhes
                            close={close}
                            show={show}
                            cancel={cancel}
                            editar={editar}
                            item={state.vendaSelected}
                        />
                    </BottomSheetScrollView>
                </BottomSheet>
            </View>
        </BottomSheetModalProvider>
    );
}