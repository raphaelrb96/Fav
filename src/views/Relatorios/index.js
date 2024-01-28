import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, LogBox, Linking, YellowBox, SafeAreaView } from 'react-native';
import { List, FAB, Portal, Provider as PaperProvider, DefaultTheme, Dialog, TextInput, Button } from 'react-native-paper';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colorCinza, colorPrimary } from '../../constantes/cores';
import Pb from '../../components/Pb';
import HeaderVendas from '../../components/HeaderVendas/index.js';
import Detalhes from '../../components/DetalhesVenda';
import ItemVenda from '../../components/ItemVenda';
import HeaderRelatorio from '../../components/HeaderRelatorios';

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



async function getRevendas(produto, de, ate, listener) {

    let idProd = null;
    let uid = null;

    if(produto) {
        idProd = produto.idProdut;
    }

    

                        
    const getDados = (querySnapshot) => {
        console.log(querySnapshot.size)
            

            let lista = [];

            let faturamento = 0;
            let numVendas = 0;
            let comissoes = 0;
            let itens = 0;
            let cancelamentos = 0;

            let listVendedores = [];
            let listaDeProdutos = [];

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

                let vendedorNaLista = false;
                let admNaLista = false;

                if(statusPedido !== 3) {
                    //analisar vendas, exceto canceladas

                    if(idProd !== null) {
                        //filtro por produto
                        let itemIncluso = false;
                        
                        let quant = 0;
                        prods.forEach(p => {
                            const {quantidade, valorTotal} = p;
                            if(p.idProdut === idProd) {
                                //calcular itens
                                quant = quant + quantidade;

                                //calcular faturamento
                                faturamento = faturamento + valorTotal;

                                itemIncluso = true;
                            }
                        });
                        itens = itens + quant;

                        if(itemIncluso) {
                            //calcular vendas
                            numVendas++;

                            //calcular comissoes
                            if(existeAdm) {
                                comissoes = comissoes + 5;
                            }
                            comissoes = comissoes + comissaoDaVenda;
                        }

                    } else if (uid !== null) {

                    } else {
                        //calcular faturamento
                        faturamento = faturamento + totalPedido;

                        //calcular vendas
                        numVendas++;

                        //calcular comissoes
                        if(existeAdm) {
                            comissoes = comissoes + 5;
                        }
                        comissoes = comissoes + comissaoDaVenda;

                        //calcular itens
                        let quantidade = 0;
                        for (let i = 0; i < prods.length; i++) {
                            //prodRev
                            const element = prods[i];
                            quantidade = quantidade + element.quantidade;
                            
                            let topPrd = {
                                produtoName: element.produtoName,
                                caminhoImg: element.caminhoImg,
                                idProdut: element.idProdut,
                                quantidade: element.quantidade
                            };
                            
                            if(listaDeProdutos.length > 0) {
                                let produtoJaExiste = false;
                                for (let x = 0; x < listaDeProdutos.length; x++) {
                                    const itemListContagem = listaDeProdutos[x];
                                    if(element.idProdut === itemListContagem.idProdut) {
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
                                if(!produtoJaExiste) {
                                    listaDeProdutos.push(topPrd);
                                }
                            } else {
                                listaDeProdutos.push(topPrd);
                            }
                        }
                        itens = itens + quantidade;


                    }
                    

                } else {
                    //vendas canceladas

                    if(idProd !== null) {
                        let itemIncluso = false;
                        prods.forEach(p => {
                            const {idProdut} = p;
                            if(idProdut === idProd) {
                                itemIncluso = true;
                            }
                        });

                        if(itemIncluso) {
                            cancelamentos++;
                        }
                    } else {
                        cancelamentos++;
                    }

                    

                }


                if(idProd !== null) {


                    let itemIncluso = false;
                    prods.forEach(p => {
                        const {idProdut} = p;
                        if(idProdut === idProd) {
                            itemIncluso = true;
                            lista.push(obj);
                        }
                    });


                    if(itemIncluso) {

                        for (let i = 0; i < listVendedores.length; i++) {
                            const element = listVendedores[i];

                            if(element.id === uidVendedor) {

                                vendedorNaLista = true;

                                listVendedores[i] = {
                                    nome: nomeVendedor,
                                    id: element.id,
                                    num: element.num + 1
                                };

                                break;

                            }

                        }
                        if(!vendedorNaLista) {

                            let novoObj = {
                                nome: nomeVendedor,
                                id: uidVendedor,
                                num: 1
                            };

                            listVendedores.push(novoObj);

                        }

                    }


                    
                } else if(uid !== null) {

                } else {

                    for (let i = 0; i < listVendedores.length; i++) {
                        const element = listVendedores[i];

                        if(element.id === uidVendedor) {

                            vendedorNaLista = true;

                            listVendedores[i] = {
                                nome: nomeVendedor,
                                id: element.id,
                                num: element.num + 1
                            };

                            break;

                        }

                    }
                    if(!vendedorNaLista) {

                        let novoObj = {
                            nome: nomeVendedor,
                            id: uidVendedor,
                            num: 1
                        };

                        listVendedores.push(novoObj);

                    }
                    lista.push(obj);
                }
        

                


            });


        
            lista.sort((a,b) => a.hora - b.hora);
            lista.reverse();

            listVendedores.sort((a,b) => a.num - b.num);
            listVendedores.reverse();

            listaDeProdutos.sort((a,b) => a.quantidade - b.quantidade);
            listaDeProdutos.reverse();

            const object = {
                faturamento: faturamento,
                vendas: numVendas,
                itens: itens,
                comissoes: comissoes,
                cancelamentos: cancelamentos,
                listaVendedores: listVendedores,
                numVendedores: listVendedores ? listVendedores.length : 0,
                listaProdutos: listaDeProdutos,
                numProdutos: listaDeProdutos ? listaDeProdutos.length : 0
            };

            return listener({list: lista, obj: object, msg: null});
    };
    
    const errorLog = error => {
        return listener({list: null, obj: null, msg: error});
    };


    if(de && ate) {
        console.log(new Date(de), new Date(ate));
        await firestore().collection('Revendas').where('hora', '>', de).where('hora', '<', ate).onSnapshot(getDados).catch(errorLog);
    } else {
        let d = new Date();
        d.setHours(d.getHours() - 730);
        await firestore().collection('Revendas').where('hora', '>', d.getTime()).onSnapshot(getDados).catch(errorLog);
    }


}

export default function Relatorios({route, navigation}) {

    //LogBox.ignoreLogs([' EventEmitter.removeListener', 'Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.']);

    const { produto, de, ate, vendedor } = route.params;
    const [pb, setPb] = useState(true);
    const [revendasList, setRevendaList] = useState(null);
    const [resumo, setResumo] = useState(null);


    const [state, setState] = useState({ open: false });

    const { open } = state;

    const onStateChange = ({ open }) => setState({ open });

    const [itemDetalhe, setItemDetalhe] = useState(null);

    

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

    const clickItem = (item) => {
        navigation.navigate('Relatórios', { produto: item });
    };

    useEffect(() => {
        setPb(true);
        getRevendas(produto, de, ate, ({list, obj, msg}) => {
            if(list !== null) {
                setRevendaList(list);
                setResumo(obj);

            } else {
            }
            
            setPb(false);
        });

        
        
    }, [route]);

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
            <SafeAreaView style={styles.containerBottom}>

                <FlatList 
                    keyExtractor={item => item.idCompra}
                    data={revendasList}
                    ListHeaderComponent={() => <HeaderRelatorio faturamento={resumo.faturamento} vendas={resumo.vendas} itens={resumo.itens} comissoes={resumo.comissoes} cancelamentos={resumo.cancelamentos} list={resumo.listaVendedores} num2={resumo.numVendedores} list2={resumo.listaProdutos} num={resumo.numProdutos} click={clickItem} type={produto ? 2 : 1} />}
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
            </SafeAreaView>
        )

    }

    
}