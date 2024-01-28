import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import { colorCinza } from '../../constantes/cores';
import ItemProduto from '../ItemProduto';
import ItemDinamicRelatorio from '../ItemDinamicRelatorio';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 6,
        marginBottom: 6
    },
    row: {
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        marginBottom: 20
    },
    espaco: {
        height: 16
    }
});

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default function HeaderRelatorio({list, faturamento, itens, vendas, cancelamentos, comissoes, num, list2, num2, click, type}) {

    //type 1 = vendedor
    //type 2 = produto
    

    const render = ({item}) => {
        if(item === null || item === undefined) {
            return null;
        }
        console.log(item.nome)
        return <ItemDinamicRelatorio nome={`${item.nome}`} value={item.num} path={item.path ? item.path : null} />
    };

    const renderProd = ({item}) => {
        if(item === null || item === undefined) {
            return null;
        }
        return <ItemProduto click={() => click(item)} path={item.caminhoImg} nome={`${item.quantidade} ${item.produtoName}`} />
    };


    //list.sort((a,b) => a.quantidade - b.quantidade);
    //list.reverse();

    return (
        <View>
            <View style={styles.row} >
                <View style={styles.container}>
                        <Card style={styles.itemContainer}>
                            <Card.Title
                                title={formartar(faturamento)}
                                subtitle="Faturamento"/>
                        </Card>
                        <Card style={styles.itemContainer}>
                            <Card.Title
                                title={itens}
                                subtitle="Itens"/>
                        </Card>
                        <Card style={styles.itemContainer}>
                            <Card.Title
                                title={cancelamentos !== 0 ? cancelamentos : 0}
                                subtitle="Cancelamentos"/>
                        </Card>
                </View>
                <View style={styles.container}>
                        <Card style={styles.itemContainer}>
                            <Card.Title
                                title={vendas}
                                subtitle="Vendas"/>
                        </Card>
                        <Card style={styles.itemContainer}>
                            <Card.Title
                                title={formartar(comissoes)}
                                subtitle="Comissões"/>
                        </Card>
                        <Card style={styles.itemContainer}>
                            <Card.Title
                                title={type == 1 ? `${num}` : `${num2}`}
                                subtitle={type == 1 ? "Produtos" : "Vendedores"} />
                        </Card>
                </View>
            
            </View>
            <FlatList
                    data={list}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={render}
                    ListHeaderComponent={() => <View style={{width: 14}} />}
                    ListFooterComponent={() => <View style={{width: 30}} />}
            />

            <View style={styles.espaco} />

            {
                list2 
                ? 
                    <FlatList
                        data={list2}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderProd}
                        ListHeaderComponent={() => <View style={{width: 14}} />}
                        ListFooterComponent={() => <View style={{width: 30}} />}
                    />
                :
                    null
            }
            
        </View>
        
    );
}