import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Avatar, Button, Divider, Headline, List, DefaultTheme } from 'react-native-paper';
import { colorCinza } from '../../constantes/cores';
import { dateToYMD, formartarValorSmall } from '../../util/Formatar';
import Pb from '../../components/Pb';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';


const theme = {
    ...DefaultTheme,
    colors: {
        primary: '#fff',
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    content: {
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bottomSheet: {
        elevation: 18
    },
    subheader: {
        marginLeft: 8,
        marginRight: 20,
        marginTop: 0,
        marginBottom: 8
    },
    dados: {
        marginLeft: -8,
        paddingEnd: 32,
        paddingLeft: 0,
        paddingBottom: 0,
        paddingTop: 4
    },
    spacing: {
        height: 24
    },
    center: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 8,
        height: 'auto'
    },
    centerText: {
        textAlign: 'center',
        height: 'auto'
    },
    bold: {
        fontWeight: 'bold',
        color: '#00000090',
        fontSize: 36,
        lineHeight: 36,
        marginTop: 16
    },
    itemDados: {
        width: 125,

    },
    botaoSalvar: {
        marginStart: 26,
        marginRight: 26,
        marginTop: 40,
        marginBottom: 30,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#4F4F4F',
    },
    textBtao: {
        fontSize: 18,
        color: '#4F4F4F',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 32,
        color: colorCinza
    },
    btn: {
        margin: 10,
        marginTop: 22,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        flex: 1,
        alignContent: 'center',
        alignItems: 'center'
    },
    btnSalvarValores: {
        marginBottom: 26,
        marginHorizontal: 16,
        display: 'none'
    },
});

const convertTextAllCaps = (v) => {
    return String(v).toLocaleUpperCase();
};

const convertTextLow = (v) => {
    return String(v).toLocaleLowerCase();
};

async function zerarPainel(list1, list2, uid, id, total, callback) {

    const batch = firestore().batch();
    let numDocumentos = 0;

    const refVendasUsuario = firestore().collection('MinhasRevendas').doc('Usuario').collection(uid);
    const refVendasGeral = firestore().collection('Revendas');

    const refComissoesUser = firestore().collection('MinhasComissoesAfiliados').doc('Usuario').collection(uid);
    const refComissoesGeral = firestore().collection('ComissoesAfiliados');


    list1.forEach((item) => {
        let { id, pagamentoRecebido, statusComissao } = item;
        if (pagamentoRecebido !== null || pagamentoRecebido !== undefined) {
            if (statusComissao === 5 && !pagamentoRecebido) {

                let refGeral = refComissoesUser.doc(id);
                let refUser = refComissoesGeral.doc(id);
                batch.update(refGeral, 'pagamentoRecebido', true);
                batch.update(refUser, 'pagamentoRecebido', true);
                numDocumentos++;
            }
        }

    });

    list2.forEach((item, index) => {

        let { statusCompra, idCompra, pagamentoRecebido } = item;
        if (pagamentoRecebido !== null || pagamentoRecebido !== undefined) {
            if (statusCompra === 5 && !pagamentoRecebido) {
                let refGeral = refVendasGeral.doc(idCompra);
                let refUser = refVendasUsuario.doc(idCompra);
                batch.update(refGeral, 'pagamentoRecebido', true);
                batch.update(refUser, 'pagamentoRecebido', true);
                numDocumentos++;
            }
        }

    });

    const refCentral = firestore().collection('Pagamentos').doc(id);
    const refUsuario = firestore().collection('Pagamentos').doc('Usuario').collection(uid).doc(id);

    const solicitacaoObj = {
        status: 5,
        valorFinal: total,
        valorTemporario: total,
        timestampPay: Date.now()
    };

    batch.update(refCentral, solicitacaoObj);
    batch.update(refUsuario, solicitacaoObj);

    //console.log(`num docs: ${numDocumentos}`);

    //console.log('comit iniciado');

    batch.commit().then(() => {
        return callback(true);
    }).catch(error => {
        //console.log('ERROR: ');
        //console.log(error);

        return callback(false);
    })

}

async function getVendasAfiliados(uid, listener) {

    const afiliados = firestore().collection('MinhasComissoesAfiliados').doc('Usuario').collection(uid).where('pagamentoRecebido', '==', false);

    return afiliados.get().then(querySnapshot => {

        let aflOficiais = [];
        let comissoesAfiliados = 0;

        querySnapshot.forEach(documentSnapshot => {

            let obj = documentSnapshot.data();

            let status = obj.statusComissao;
            let cms = obj.comissao;

            if (status === 5) {
                aflOficiais.push(obj);
                comissoesAfiliados = comissoesAfiliados + cms;
            }

        });

        listener({ list: aflOficiais, value: comissoesAfiliados });
    }).catch(error => {
        listener({ list: [], value: 0 });
    });
};

async function getVendasUser(uid, listener) {

    const vendas = firestore().collection('MinhasRevendas').doc('Usuario').collection(uid).where('pagamentoRecebido', '==', false);

    return vendas.get().then(querySnapshot => {


        let vendasOficiais = [];

        let comissaoEmVendas = 0;

        querySnapshot.forEach(documentSnapshot => {
            let obj = documentSnapshot.data();
            let statusPedido = obj.statusCompra;
            let comissaoDaVenda = obj.comissaoTotal;
            if (statusPedido === 5) {
                vendasOficiais.push(obj);
                comissaoEmVendas = comissaoEmVendas + comissaoDaVenda;
            }
        });


        listener({ list: vendasOficiais, value: comissaoEmVendas });

    }).catch(error => {
        listener({ list: [], value: 0 });
    });

};

const definirPrevisao = (uid, id, previsao, callback) => {

    const batch = firestore().batch();

    const refCentral = firestore().collection('Pagamentos').doc(id);
    const refUsuario = firestore().collection('Pagamentos').doc('Usuario').collection(uid).doc(id);

    batch.update(refCentral, 'previsao', previsao);
    batch.update(refUsuario, 'previsao', previsao);

    batch.commit().then(() => {
        callback(true);
    }).catch(error => {
        console.log(error, uid, id)
        callback(false);
    });
};


function Content({ solicitacao, state, setState, navigation }) {

    const { bank, chave, id, titular, valorFinal, status, nome, foto, apelido, previsao, uid, timestampCreated } = solicitacao;
    const { pb, load, vendas, afls, cmsAfl, cmsVenda } = state;

    if (pb) return <Pb />;

    function ContentMain() {

        const zerar = () => {

            if(load) return;

            const vTotal = cmsAfl + cmsVenda;

            if(vTotal === 0) {
                Alert.alert('Impossivel continuar', 'A conta não tem valor nenhum disponivel pra saque');
                return;
            }

            setState((prevState) => ({
                ...prevState,
                load: true
            }));

            zerarPainel(afls, vendas, uid, id, vTotal, (sucess) => {
                if(sucess) {
                    navigation.goBack();
                } else {

                    Alert.alert('Erro ao zerar painel', 'Tente novamente');

                    setState((prevState) => ({
                        ...prevState,
                        load: false
                    }));
                }
            });
        };

        return (
            <>
                <View style={styles.center}>
                    <Avatar.Image theme={theme} size={70} source={{ uri: foto }} />
                </View>

                <Headline style={[styles.centerText, styles.bold]}>{formartarValorSmall((state.cmsVenda + state.cmsAfl))}</Headline>
                <Text style={[styles.centerText]}>Total a receber</Text>

                <Button style={styles.botaoSalvar} labelStyle={styles.label} loading={load} theme={theme} onPress={zerar} disabled={false} icon="cash-refund" mode="contained">
                    <Text style={styles.textBtao}>Zerar Painel</Text>
                </Button>

                <View style={styles.spacing} />
                <Divider />
                <View style={styles.spacing} />
            </>
        );
    };

    function ContentInfoUser() {
        return (
            <>
                <Headline style={styles.subheader}>Informações do Vendedor</Headline>

                <List.Item
                    style={styles.dados}
                    title={nome}
                    titleNumberOfLines={5}
                    description={'Nome do Vendedor'} />

                <List.Item
                    style={styles.dados}
                    title={'@' + convertTextLow(apelido)}
                    titleNumberOfLines={5}
                    description={'Apelido do Vendedor'} />

                <List.Item
                    style={styles.dados}
                    title={`${new Date(timestampCreated).toLocaleDateString()} às ${new Date(timestampCreated).toLocaleTimeString()}`}
                    titleNumberOfLines={5}
                    description={'Horario da Solicitação'} />

                <View style={styles.spacing} />
                <Divider />
                <View style={styles.spacing} />
            </>
        );
    };

    function ContentInfoBank() {
        return (
            <>
                <Headline style={styles.subheader}>Informações da Conta</Headline>

                <List.Item
                    style={styles.dados}
                    title={chave}
                    titleNumberOfLines={5}
                    description={'Chave Pix'} />

                <List.Item
                    style={styles.dados}
                    title={bank}
                    titleNumberOfLines={5}
                    description={'Nome do Banco'} />

                <List.Item
                    style={styles.dados}
                    title={titular}
                    titleNumberOfLines={5}
                    description={'Titular da Conta'} />

                <View style={styles.spacing} />
                <Divider />
                <View style={styles.spacing} />
            </>
        );
    };

    function ContentTimer() {

        const [inicio, setInicio] = useState(new Date(Date.now()));
        const [showInicial, setShowInicial] = useState(false);
        const [load, setLoad] = useState(false);

        const dataInicial = (inicio !== null) ? `DIA: ${dateToYMD(inicio)}` : "Selecionar Data Prevista";
        const prazoDefinido = previsao && previsao.length > 0;
        const prazo = prazoDefinido ? previsao : dataInicial;

        const click = () => {
            setShowInicial(true);
        };

        return (
            <>
                <Headline style={styles.subheader}>Previsão de Pagamento</Headline>

                {
                    load ?
                        <Pb />
                        :
                        <TouchableOpacity style={styles.btn} onPress={prazoDefinido ? null : click}>
                            <Text>{prazo}</Text>
                        </TouchableOpacity>
                }

                <DatePicker
                    modal
                    open={showInicial}
                    mode='date'
                    confirmText="Salvar"
                    cancelText='Voltar'
                    title={"Data Inicial"}
                    date={inicio}
                    onConfirm={(date) => {

                        setShowInicial(false);

                        if (date === null || date === undefined) {
                            return;
                        }

                        setLoad(true);

                        const novaData = dateToYMD(date);

                        definirPrevisao(uid, id, novaData, (sucess) => {
                            if(sucess) {
                                navigation.goBack();
                            } else {
                                setLoad(false);
                            }
                        });

                        
                    }}
                    onCancel={() => {
                        setShowInicial(false)
                    }}
                />

                <Button
                    compact
                    style={styles.btnSalvarValores}
                    buttonColor='#00000020'
                    mode='contained-tonal'>SALVAR</Button>

                <View style={styles.spacing} />
                <Divider />
                <View style={styles.spacing} />
            </>
        );
    };

    return (
        <ScrollView>
            <View style={styles.content}>
                <List.Section>

                    <ContentMain />

                    <ContentInfoUser />

                    <ContentInfoBank />

                    <ContentTimer />


                </List.Section>
            </View>
        </ScrollView>


    );
}

export default function DetalhesAgendamento({ navigation, route }) {

    const solicitacao = route.params.item;

    useLayoutEffect(() => {

        return;

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handlePresentModalPress}>
                    <Icon style={{ marginRight: 16 }} color={'#FFF'} size={24} name="plus" />
                </TouchableOpacity>
            )
        });

    }, []);

    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        pb: true,
        load: false,
        vendas: [],
        afls: [],
        cmsVenda: 0,
        cmsAfl: 0,
        load: false,
    })

    const snapPoints = useMemo(() => ['80%'], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.expand();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    useEffect(() => {

        const fetchData = () => {

            const listener = async () => {

                let vendasOficiais = [];
                let comissaoEmVendas = 0;
                let aflOficiais = [];
                let comissoesAfiliados = 0;

                await getVendasUser(solicitacao.uid, (resultVendas) => {
                    vendasOficiais = resultVendas?.list;
                    comissaoEmVendas = resultVendas?.value;
                    console.log(comissaoEmVendas)


                });

                await getVendasAfiliados(solicitacao.uid, (resultRecompensas) => {
                    aflOficiais = resultRecompensas?.list;
                    comissoesAfiliados = resultRecompensas?.value;
                    console.log(comissoesAfiliados)

                });


                console.log(comissaoEmVendas, comissoesAfiliados)


                setState((prevState) => ({
                    ...prevState,
                    pb: false,
                    vendas: vendasOficiais,
                    afls: aflOficiais,
                    cmsVenda: comissaoEmVendas,
                    cmsAfl: comissoesAfiliados,
                }));
            };

            listener();


        };

        return fetchData();

    }, [solicitacao]);


    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>

                <Content
                    state={state}
                    navigation={navigation}
                    setState={setState}
                    solicitacao={solicitacao} />

                <BottomSheet
                    ref={bottomSheetModalRef}
                    index={index}
                    style={styles.bottomSheet}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}>
                    <View style={styles.contentContainer}>
                        <Text>Aberto 🎉</Text>
                    </View>
                </BottomSheet>

            </View>
        </BottomSheetModalProvider>
    );
}