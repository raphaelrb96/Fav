import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, DefaultTheme, Divider } from 'react-native-paper';
import { colorCinza, colorPrimary, colorSecondaryLight } from '../../constantes/cores';

const theme = {
    ...DefaultTheme,
    color: {
        primary: '#000',

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorSecondaryLight,
        padding: 20,
    },
    description: {
        backgroundColor: colorSecondaryLight,
    },
    item: {
        backgroundColor: colorSecondaryLight,
    },
    spacing: {
        height: 22,
        backgroundColor: colorSecondaryLight,
    }
});

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default function ItemAnaliseUsuario({ dados }) {
    return (
        <View>
            <Divider />
            <List.Accordion
                theme={theme}
                style={styles.container}
                descriptionStyle={styles.description}
                titleStyle={{ color: colorCinza }}
                title={dados.nome}
                left={props => <List.Icon icon="account-details" />}>
                {
                    //
                }

                <List.Item style={styles.item} description="Média de comissoões" title={formartar((dados.totalComissaoVendas + dados.totalComissaoPorAfiliados))} />
                <List.Item style={styles.item} description="Total em Recompensas" title={formartar((dados.totalComissaoPorAfiliados))} />
                <List.Item style={styles.item} description="Total em Vendas" title={formartar((dados.totalComissaoVendas))} />
                <List.Item style={styles.item} title={`${dados.numVendas} vendas`} description="Comissão dos Produtos" />
                <List.Item style={styles.item} title={`${dados.numVendasAfiliados} vendas`} description="Recompensas e Bônus" />
                <List.Item style={styles.item} description="Faturamento pra Loja" title={formartar(dados.totalFaturado)} />
                <View style={styles.spacing} />
            </List.Accordion>
        </View>
    );
}