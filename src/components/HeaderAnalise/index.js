import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Card, Text } from 'react-native-paper';
import { colorCinza, colorPrimary } from '../../constantes/cores';
import ItemProduto from '../ItemProduto';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionContainer: {
        marginTop: 26,
        marginBottom: 12,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colorPrimary,
        marginTop: 0,
    },
    itemContainer: {
        flex: 1,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 4,
        marginBottom: 4,
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        marginLeft: 6,
        marginRight: 6,
    },
    title: {
        fontSize: 15
    },
    text: {
        fontSize: 10,
        letterSpacing: 0,
        lineHeight: 12,
    },
    spacing: {
        height: 10
    }
});

function formartar(v) {

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return formatter.format(v);

    return `R$ ${v.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default function HeaderAnalise({ produtos, total, ticket, ativos, comissoes, vendas, itens, dinheiro, pix, cartao, resumo, click }) {




    const render = ({ item }) => {
        if (item === null || item === undefined) {
            return null;
        }
        return <ItemProduto click={() => click(item)} path={item.caminhoImg} nome={`${item.quantidade} ${item.produtoName}`} />
    };



    return (
        <View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                    DETALHES DO FATURAMENTO
                </Text>
            </View>
            <View style={styles.row} >
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.total)}
                            subtitle="Total Previsto" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.dinheiro)}
                            subtitle="Dinheiro Previsto" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.pix)}
                            subtitle="Pix Previsto" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.cartao)}
                            subtitle="Cartão Previsto" />
                    </Card>
                </View>
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.totalConcluido)}
                            subtitle={`Total Concluido`} />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.dinheiroConcluido)}
                            subtitle="Dinheiro Concluido" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.pixConcluido)}
                            subtitle="Pix Concluido" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.cartaoConcluido)}
                            subtitle="Cartão Concluido" />
                    </Card>
                </View>
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.totalPendente)}
                            subtitle={`Total Pendente`} />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.dinheiroPendente)}
                            subtitle="Dinheiro Pendente" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.pixPendente)}
                            subtitle="Pix Pendente" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.cartaoPendente)}
                            subtitle="Cartão Pendente" />
                    </Card>
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                    RELATÓRIOS DE VENDAS
                </Text>
            </View>
            <View style={styles.row} >
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.ticket)}
                            subtitle="Ticket Médio" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={resumo.itens}
                            subtitle="Itens Totais" />
                    </Card>
                </View>
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.comissoes)}
                            subtitle="Comissões" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={resumo.vendas}
                            subtitle="Vendas Totais" />
                    </Card>
                </View>
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(resumo.totalCancelada)}
                            subtitle="Cancelamento" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={resumo.produtos.length}
                            subtitle="Produtos Totais" />
                    </Card>
                </View>
            </View>
            <View style={styles.spacing} />
            <FlatList
                data={produtos}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={render}
                ListHeaderComponent={() => <View style={{ width: 14 }} />}
                ListFooterComponent={() => <View style={{ width: 30 }} />}
            />
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                    RELATÓRIOS DE VENDEDORES
                </Text>
            </View>
            <View style={styles.spacing} />

        </View>
    );

    return (
        <View>
            <View style={styles.row} >
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(total)}
                            subtitle="Faturamento" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(ticket)}
                            subtitle="Ticket Médio" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(comissoes)}
                            subtitle="Comissões" />
                    </Card>
                </View>
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(dinheiro)}
                            subtitle="Dinheiro" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(pix)}
                            subtitle="Pix" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={formartar(cartao)}
                            subtitle="Cartão" />
                    </Card>
                </View>
                <View style={styles.container}>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={vendas}
                            subtitle="N° Vendas" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={itens}
                            subtitle="N° Itens" />
                    </Card>
                    <Card style={styles.itemContainer}>
                        <Card.Title
                            titleStyle={styles.title}
                            subtitleStyle={styles.text}
                            title={ativos}
                            subtitle="N° Vendedores" />
                    </Card>
                </View>

            </View>
            <FlatList
                data={produtos}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={render}
                ListHeaderComponent={() => <View style={{ width: 14 }} />}
                ListFooterComponent={() => <View style={{ width: 30 }} />}
            />
        </View>

    );
}