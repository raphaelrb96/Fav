import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, DefaultTheme, Searchbar, Avatar, Headline, Caption, Text, List, Button } from 'react-native-paper';
import { colorCinza, colorPrimary, colorPrimaryDark, colorSecondaryLight } from '../../constantes/cores';
import Pb from '../../components/Pb';
import firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        alignContent: 'center',
        alignItems: 'center',
    },
    toolbar: {
        height: 60,
        borderRadius: 0,
        backgroundColor: colorSecondaryLight
    },
    row: {
        flexDirection: 'row',
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
    },
    input: {
        margin: 10,
        borderColor: colorPrimaryDark
    },
    center: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 8
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
    }
});

const thema = {
    ...DefaultTheme,
    colors: {
        primary: '#fff',
    }
}

async function zerarPainel(list1, list2, uid, callback) {

    console.log(uid);

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

    console.log(`num docs: ${numDocumentos}`);

    console.log('comit iniciado');

    batch.commit().then(() => {
        return callback(true);
    }).catch(error => {
        console.log('ERROR: ');
        console.log(error);

        return callback(false);
    })

}

async function getVendasAfiliados(uid, callback) {
    let afiliados = firestore().collection('MinhasComissoesAfiliados').doc('Usuario').collection(uid).where('pagamentoRecebido', '==', false);

    await afiliados.get().then(querySnapshot => {

        let aflOficiais = Array();
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

        return callback(aflOficiais, comissoesAfiliados);
    }).catch(error => {
        return null;
    });
}

async function getVendasUser(uid, callback) {
    let vendas = firestore().collection('MinhasRevendas').doc('Usuario').collection(uid).where('pagamentoRecebido', '==', false);

    await vendas.get().then(querySnapshot => {

        let vendasOficiais = Array();

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

        return callback(vendasOficiais, comissaoEmVendas);

    }).catch(error => {
        return null;
    });
}

async function getUser(text, callback) {
    let usuario = firestore().collection('Usuario').where('userName', '==', text);
    await usuario.get().then(querySnapshot => {
        let element = querySnapshot.docs[0].data();
        return callback(element);
    }).catch(error => {
        return null;
    });
}

async function pesquisar(text, listener) {

    let userOficial = null;

    let vendasOficiais = null;
    let comissaoEmVendas = 0;

    let aflOficiais = null;
    let comissoesAfiliados = 0;

    await getUser(text, user => {
        userOficial = user;
    });

    await getVendasUser(userOficial.uid, (list, value) => {
        vendasOficiais = list;
        comissaoEmVendas = value;
    });

    await getVendasAfiliados(userOficial.uid, (list, value) => {
        aflOficiais = list;
        comissoesAfiliados = value;
    });


    console.log(comissoesAfiliados);
    console.log('Total: ' + (comissoesAfiliados + comissaoEmVendas));

    return listener(userOficial, vendasOficiais, aflOficiais, comissaoEmVendas, comissoesAfiliados);

}

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default function SearchVendedor({ navigation }) {

    const [text, setText] = useState('');
    const [pb, setPb] = useState(false);
    const [state, setState] = useState(null);
    const [zerando, setZerando] = useState(false);

    let click = () => {
        if (zerando) {
            return;
        }

        setZerando(true);

    }

    let blur = () => {
        setPb(true);
        pesquisar(text, (user, vendas, afls, cmsVenda, cmsAfl) => {
            let { celular, pathFoto, nome, uid, userName, uidAdm, usernameAdm } = user;

            setState({
                user: {
                    celular,
                    pathFoto,
                    nome,
                    uid,
                    userName,
                    uidAdm,
                    usernameAdm
                },
                vendas: vendas,
                afls: afls,
                cmsVenda: cmsVenda,
                cmsAfl: cmsAfl
            });

            setText('');
            setPb(false);

        });

    }

    useEffect(() => {

        if (zerando) {
            zerarPainel(state.afls, state.vendas, state.user.uid, (sucess) => {
                if (sucess) {
                    console.log('tudo certo');
                    navigation.goBack();
                } else {
                    setZerando(false);
                }

            });
        }

    }, [zerando]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Searchbar
                    style={styles.toolbar}
                    onIconPress={() => navigation.goBack()}
                    icon="arrow-left"
                    placeholder="Pesquisar por apelido"
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                    onBlur={blur}
                />
            )
        });
    }, [navigation, text]);

    if (pb) {
        return <Pb />
    }

    if (state !== null) {
        return (
            <View style={styles.container}>
                <View style={styles.center}>
                    <Avatar.Image theme={thema} size={60} source={{ uri: state.user.pathFoto }} />
                </View>

                <Headline style={[styles.centerText, styles.bold]}>{state.user.nome}</Headline>
                <Caption style={[styles.centerText, styles.bold]} >{`@${state.user.userName}`}</Caption>
                <View style={styles.row}>
                    <List.Item style={[styles.itemDados, styles.centerText,]} title={formartar(state.cmsAfl)} description={`${state.afls.length} revendas`} />
                    <List.Item style={[styles.itemDados, styles.centerText,]} title={formartar(state.cmsVenda)} description={`${state.vendas.length} vendas`} />

                </View>

                <Headline style={[styles.centerText]}>{formartar((state.cmsVenda + state.cmsAfl))}</Headline>
                <Text style={[styles.centerText]}>Total a receber</Text>
                <Button style={styles.botaoSalvar} labelStyle={styles.label} loading={zerando} theme={thema} onPress={click} disabled={false} icon="cash-refund" mode="contained">
                    <Text style={styles.textBtao}>Zerar Painel</Text>
                </Button>
            </View>
        );
    }

    return null;
}