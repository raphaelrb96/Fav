import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, DefaultTheme, Divider } from 'react-native-paper';
import { colorCinza, colorPrimary } from '../../constantes/cores';

const theme = {
    ...DefaultTheme,
    color: {
        primary: '#000',

    }
}

function formartar(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export default function ItemAnaliseUsuario({ dados }) {
    return (
        <View>
            <Divider />
            <List.Accordion
                theme={theme}
                titleStyle={{ color: colorCinza }}
                title={dados.nome}
                left={props => <List.Icon icon="account-details" />}>
                <List.Item description="Faturamento pra Loja" title={formartar(dados.totalFaturado)} />
                <List.Item description="Média de comissoões" title={formartar((dados.totalComissaoVendas + dados.totalComissaoPorAfiliados))} />
                <List.Item title={`${dados.numVendas} vendas`} description="Revenda Propria" />
                <List.Item title={`${dados.numVendasAfiliados} vendas`} description="Revenda de afiliados" />
            </List.Accordion>
        </View>
    );
}