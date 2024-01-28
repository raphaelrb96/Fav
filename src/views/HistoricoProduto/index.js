import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, LogBox, Linking, YellowBox } from 'react-native';
import { List, FAB, Portal, Provider as PaperProvider, DefaultTheme, Dialog, TextInput, Button } from 'react-native-paper';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colorCinza, colorPrimary } from '../../constantes/cores';
import Pb from '../../components/Pb';
import HeaderVendas from '../../components/HeaderVendas/index.js';
import Detalhes from '../../components/DetalhesVenda';
import ItemVenda from '../../components/ItemVenda';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorPrimary,
        accent: colorCinza,
    }
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: colorPrimary
    },
    container: {
        flex: 1,
    },
    bottomSheet: {
        elevation: 8
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
    switch(n) {
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

async function getRevendas(filtro, idProd, listener) {
    

    let refRevendas = firestore()
                        .collection('Revendas')
                        .where('hora', '>=', filtro.getTime())
                        .orderBy("hora", "desc");

    

    await refRevendas.onSnapshot(querySnapshot => {


        let lista = [];

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

            prods.forEach(p => {

                //console.log(JSON.stringify(p));

                if(p.idProdut === idProd) {
                    lista.push(obj);
                }

            });

            //lista.push(obj);


        });

        console.log(lista.length);

    
        lista.sort((a,b) => a.hora - b.hora);
        lista.reverse();

        return listener({list: lista, msg: null});
        
    }).catch(error => {
        return listener({list: null, msg: error});
    });

}

export default function HistoricoProduto({route}) {
    const { produto } = route.params;
    const [pb, setPb] = useState(true);
    const [revendasList, setRevendaList] = useState(null);


    const [state, setState] = useState({ open: false });

    const { open } = state;

    const onStateChange = ({ open }) => setState({ open });

    const [itemDetalhe, setItemDetalhe] = useState(null);

    let d = new Date();
    d.setHours(d.getHours() - 730);

    const bottomSheetRef = useRef();
    const [index, setIndex] = useState(-1);


    const snapPoints = useMemo(() => ['80%'], []);

    let click = (item) => {
        
        setItemDetalhe(item);
        if(bottomSheetRef.current !== undefined) {
            bottomSheetRef.current.expand();
        }
    };

    let close = () => {
        if(bottomSheetRef.current !== undefined) {
            bottomSheetRef.current.close();
        }
    };

    const handleSheetChanges = useCallback((index) => {
        console.log('Show detalhe ', index);
        setIndex(index);
        
    }, []);

    useEffect(() => {
        setPb(true);
        getRevendas(d, produto.idProdut, ({list, msg}) => {
            if(list !== null) {
                setRevendaList(list);
                console.log(list.lenght);
                

            } else {
                console.log('erro');
            }
            
            setPb(false);
        });

        return () => {
            setPb(true);
        };
        
    }, []);

    let elemento = <Detalhes 
                        close={close} 
                        show={() => {
                            //showDialog();
                            navigation.navigate('Conversa', {num: itemDetalhe.phoneCliente, texto: getTextoWhats(), prod: itemDetalhe.listaDeProdutos[0].produtoName.toUpperCase(), nom: itemDetalhe.nomeCliente, pag: getFormaPagamento(itemDetalhe.formaDePagar)});
                        }} 
                        cancel={() => {
                            close();
                            navigation.navigate('Cancelamento', {item: itemDetalhe});
                        }}
                        item={itemDetalhe}
                    />;

    
    if(index === -1) {
        elemento = <Detalhes close={close} item={null} />;
    }

    if(pb) {
        return <Pb/>;
    }

    if(revendasList === null) {
        return (
            <View>
                <Text>{JSON.stringify(produto)}</Text>
            </View>
        );
    } else {

        return(
            <View style={styles.containerBottom}>

                <FlatList 
                    keyExtractor={item => item.idCompra}
                    data={revendasList}
                    renderItem={({item}) =>  <ItemVenda click={click} key={item.idCompra} item={item} />}
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
        )

    }

    
}