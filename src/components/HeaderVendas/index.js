import React from 'react';
import { View, Text, StyleSheet, FlatList, LogBox } from 'react-native';
import { Card } from 'react-native-paper';
import ItemProduto from '../ItemProduto';

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
    sectionContainer: {
        marginTop: 10,
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
    }
});

export default function HeaderVendas({prods, title, novas, atrasadas, maisAtrasada, emRota, canceladas, concluidas, classificar}) {
    const formatarAtraso = () => {
        if(maisAtrasada === 0) {
            return '00:00'
        } else {
            
            let diffMs  = (Date.now() - maisAtrasada);
            if(diffMs > 604800000) {
                return '+ 7 dias';
            } else if(diffMs > 172800000) {
                return '+ 2 dias';
            } else if(diffMs > 86400000) {
                return '+ de 24h';
            } else {
                let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                let diff = diffHrs + 'h ' + diffMins + 'm';
                return String(diff);
            }
            
        }
    };

    const render = ({ item }) => {
        if (item === null || item === undefined) {
            return null;
        }
        return <ItemProduto click={() => click(item)} path={item.caminhoImg} nome={`${item.quantidade} ${item.produtoName}`} />
    };

    const formatarNumero = n => {
        if(n === 0) {
            return '0'
        } else {
            return String(n);
        }
    };

    return (
        <View>
            <View style={styles.row} >
                <View style={styles.container}>
                        <Card onPress={() => classificar(2)} style={styles.itemContainer}>
                            <Card.Title
                                title={formatarAtraso()}
                                subtitle="De Atraso"/>
                        </Card>
                        <Card onPress={() => classificar(1)} style={styles.itemContainer}>
                            <Card.Title
                                title={formatarNumero(novas)}
                                subtitle="Novas"/>
                        </Card>
                        <Card onPress={() => classificar(5)} style={styles.itemContainer}>
                            <Card.Title
                                title={formatarNumero(concluidas)}
                                subtitle="Concluidas"/>
                        </Card>
                </View>
                <View style={styles.container}>
                        <Card onPress={() => classificar(2)} style={styles.itemContainer}>
                            <Card.Title
                                title={formatarNumero(atrasadas)}
                                subtitle="Atrasadas"/>
                        </Card>
                        <Card onPress={() => classificar(4)} style={styles.itemContainer}>
                            <Card.Title
                                title={formatarNumero(emRota)}
                                subtitle="Em Rota"/>
                        </Card>
                        <Card onPress={() => classificar(3)} style={styles.itemContainer}>
                            <Card.Title
                                title={formatarNumero(canceladas)}
                                subtitle="Canceladas"/>
                        </Card>
                </View>
            
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
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
        </View>
    );
}