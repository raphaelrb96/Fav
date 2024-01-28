import React, {useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { List, Card, Portal, Provider, DefaultTheme, Button, Headline } from 'react-native-paper';
import { colorCinza, colorPrimary, colorPrimaryDark } from '../../constantes/cores';
import Pb from '../../components/Pb';
import ItemVenda from '../../components/ItemVenda';
import firestore from '@react-native-firebase/firestore';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import ItemProdutoVenda from '../../components/ItemProdutoVenda';
import Detalhes from '../../components/DetalhesVenda';

const Tab = createMaterialTopTabNavigator();


const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,
        
    }
}

const styles = StyleSheet.create({
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

async function getVendas(listener) {

    let d = new Date();
    d.setHours(d.getHours() - 48);

    let refRevendas = firestore()
                        .collection('Revendas')
                        .where('hora', '>=', d.getTime())
                        .orderBy("hora", "desc");

    await refRevendas.get().then(querySnapshot => {
        console.log('then get vendas');
        let listVendas = [];
        querySnapshot.forEach(documentSnapshot => {
            let obj = documentSnapshot.data();
            listVendas.push(obj);
        });

        return listener(listVendas);
    }).catch(error => {
        console.log(error);
        return null;
    });

}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
}

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

function getStatus(s) {
    switch(s) {
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
    switch(n) {
        case 4:
            return 'Dinheiro';
        case 5: 
            return 'Pix';
        case 3:
            return 'Cartão Parcelado';
        default:
            return 'Cartão';
    }
}

function VendasList ({route}) {

    let {pb, list, tipo, refresh} = route.params;

    const [itemDetalhe, setItemDetalhe] = useState(null);

    const bottomSheetRef = useRef();
    const [index, setIndex] = useState(-1);


    const snapPoints = useMemo(() => ['80%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log('Show detalhe ', index);
        setIndex(index);
        
    }, []);

    

    let novaLista = [];
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (element.statusCompra === tipo) {
            novaLista.push(element);
        }
    }

    novaLista.sort((a,b) => a.hora - b.hora);
    novaLista.reverse();

    console.log('render list');

    let click = (item) => {
        
        console.log('click item');
        setItemDetalhe(item);
        if(bottomSheetRef.current !== undefined) {
            console.log('expand ');
            bottomSheetRef.current.expand();
        }
    };

    let titulo = '';

    if(itemDetalhe !== null) {
        titulo = `${itemDetalhe.userNomeRevendedor} vendeu ${itemDetalhe.listaDeProdutos[0].quantidade} ${itemDetalhe.listaDeProdutos[0].produtoName.toLowerCase()} \nBairro ${itemDetalhe.complemento}`;
    }
    

    let elemento = <Detalhes refresh={refresh} item={itemDetalhe} />;

    
    if(index === -1) {
        elemento = <Detalhes refresh={refresh} item={null} />;
    }
    

    return(
        <Provider style={styles.container}>
            <Portal>
                <FlatList data={novaLista} keyExtractor={item => item.idCompra} renderItem={({item}) =>  <ItemVenda click={click} key={item.idCompra} item={item} />}/>
                <View style={styles.containerBottom}>
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
            </Portal>
        </Provider>
        
    );
    
}

export default function Vendas({navigation}) {

    const [list, setList] = useState(new Array());
    const [pb, setPb] = useState(true);

    let funcao = () => {
        console.log('funcao chamada');
        getVendas((lista) => {
            console.log('lista ok');
            lista.sort((a,b) => a.hora - b.hora);
            lista.reverse();
            setList(lista);
            setPb(false);
        });
    }

    let refresh = () => {
        setPb(true);
        console.log('refresh ok');
    }

    useEffect(() => {
        console.log('efect ok');
        if (pb) {
            funcao(); 
        }

        navigation.setOptions({
            headerRight: () => (
                <Button
                  onPress={() => setPb(true)}
                  labelStyle={styles.bt}
                  color={colorPrimaryDark}
                  icon="refresh"
                />
              ),
        });
               
    }, [pb, navigation]);
    
    
    
    if(pb) {
        return <Pb/>;
    }

    console.log('render vendas ok');

    return (
        <Tab.Navigator 
            initialRouteName="Novas"
            backBehavior="none"
            screenListeners={({ navigation }) => ({
                state: (e) => {
                  // Do something with the state
                  console.log('state changed', e.data);
            
                  // Do something with the `navigation` object
                  if (!navigation.canGoBack()) {
                    console.log("we're on the initial screen");
                  }
                },
            })}
            
            screenOptions={{
                tabBarActiveTintColor: colorPrimary,
                tabBarInactiveTintColor: colorCinza,
                style: {
                    
                },
                labelStyle: {
                    textAlign: 'center',
                },
                indicatorStyle: {
                    borderBottomWidth: 1,
                    backgroundColor: colorPrimaryDark
                },
                tabBarScrollEnabled: true,
                tabBarItemStyle: { width: 140 },
                tabBarIndicatorStyle: {
                    backgroundColor: colorPrimary
                },
                
            }}
        >
            <Tab.Screen 
                name="Novas"  
                component={VendasList} 
                initialParams={{ pb: pb, list: list, tipo: 1, refresh: refresh }}
                
            />
            <Tab.Screen 
                name="Atrasadas"  
                component={VendasList} 
                initialParams={{ pb: pb, list: list, tipo: 2, refresh: refresh}}
            />
            <Tab.Screen 
                name="Em Rota"  
                component={VendasList} 
                initialParams={{ pb: pb, list: list, tipo: 4 , refresh: refresh}}
            />
            <Tab.Screen 
                name="Concluidas"  
                component={VendasList} 
                initialParams={{ pb: pb, list: list, tipo: 5 , refresh: refresh }}
            />
            <Tab.Screen 
                name="Canceladas"  
                component={VendasList} 
                initialParams={{ pb: pb, list: list, tipo: 3 , refresh: refresh }}
            />
        </Tab.Navigator>
    );
}