import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    ScrollView
  } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
//import Clipboard from '@react-native-community/clipboard';
import Pb from '../../components/Pb';


const styles = StyleSheet.create({
    sectionContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        width: '100%',
        flex: 1
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 3
      },
      itemList: {
          flexDirection: 'row',
          margin: 10
      },
      textItem: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      list: {
          flex: 1,
          width: '100%'
      }
});

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
}

let renderItem = ({item}) => {

    return(
        <View style={styles.itemList}>
            <Text style={styles.textItem}> { `${item.nome ? item.nome.substring(0,16) : 'Sem Nome'}: ${item.vendas} vendas` }</Text>
        </View>
    );
}

let itemTop = (sizeListe) => {

    if(sizeListe === 0) {
        return(
            <Pb />
        );
    }

    return(
        <Text style={styles.sectionTitle} >Total de vendas: {sizeListe}</Text>
    );
};

function compare(a,b) {
    if (a.vendas < b.vendas)
       return 1;
    if (a.vendas > b.vendas)
      return -1;
    return 0;
  }

let RankingDetalhe = ({route}) => {

    let [sizeListe, setSizeList] = useState(0);
    let [pb, setPb] = useState(null);
    let [ranking, setRanking] = useState(null);

    function getVendas() {
        firestore()
                .collection('Revendas')
                .where('hora', '>', route.params.de)
                .where('hora', '<', route.params.ate)
                .get().then(querySnapshot => {

                    //setPb(null);

                    const docBonus = true;

                    let listaNova = Array();
                    let jaExiste = false;
                    let num = 0;

                    for(let i = 0; i < querySnapshot.size; i++) {
                        let doc = querySnapshot.docs[i].data();
                        let idPai = doc.uidUserRevendedor;

                        if(doc.statusCompra !== 3) {
                            num++;
                        }

                        jaExiste = false;
                        for(let y = 0; y < listaNova.length; y++) {
                            let idFilho = listaNova[y].uid;
                            if(idFilho === idPai) {
                                if(doc.statusCompra !== 3) {
                                    listaNova[y].vendas++;
                                    jaExiste = true;
                                }
                                break;
                            }
                        }

                        if(!jaExiste) {
                            let objt = {
                                uid: doc.uidUserRevendedor,
                                nome: doc.userNomeRevendedor,
                                vendas: 1
                            };
                            if(doc.statusCompra !== 3) {
                                listaNova.push(objt);
                                
                            }
                            
                        }

                        
                    }

                    listaNova.sort(compare);

                    

                    if(docBonus) {
                        
                        const bonusV3 = 3;
                        const bonusV6 = 6;
                        const bonusV10 = 10;
                        const bonusV12 = 12;

                        let stringClipCopy = `RESULTADO DO DIA \n${dateToYMD(new Date(route.params.de))}\n\n`;

                        for(let x = 0; x < listaNova.length; x++) {

                            const numDeVendasX = listaNova[x].vendas;

                            if(numDeVendasX >= bonusV12) {
                                let linha = `R$100 ${listaNova[x].nome}: ${numDeVendasX}\n`;
                                stringClipCopy = stringClipCopy + linha;
                            } else if(numDeVendasX >= bonusV10) {
                                let linha = `R$75 ${listaNova[x].nome}: ${numDeVendasX}\n`;
                                stringClipCopy = stringClipCopy + linha;
                            } else if(numDeVendasX >= bonusV6) {
                                let linha = `R$50 ${listaNova[x].nome}: ${numDeVendasX}\n`;
                                stringClipCopy = stringClipCopy + linha;
                            } else if(numDeVendasX >= bonusV3) {
                                let linha = `R$20 ${listaNova[x].nome}: ${numDeVendasX}\n`;
                                stringClipCopy = stringClipCopy + linha;
                            }

                        }

                        //Clipboard.setString(stringClipCopy);

                    } else {
                        let stringClipCopy = '';

                        for(let x = 0; x < listaNova.length; x++) {
                            let linha = `${listaNova[x].nome}: ${listaNova[x].vendas}\n`;
                            stringClipCopy = stringClipCopy + linha;
                        }
                        //Clipboard.setString(stringClipCopy);
                    }

                    

                    setSizeList(num);

                    return setRanking(listaNova);
                    

                });
    }

    function autenticar() {
        setPb(<ActivityIndicator/>);
        auth().signInAnonymously().then(() => {
            getVendas();
        });
    }



    useEffect(() => {
        autenticar();
    }, [sizeListe])

    

    return(
            <View style={styles.sectionContainer} >
                <FlatList
                style={styles.list}
                data={ranking}
                keyExtractor={item => item.uid}
                renderItem={renderItem}
                ListHeaderComponent={() => itemTop(sizeListe)}
                />
            </View>
    );
}

export default RankingDetalhe;