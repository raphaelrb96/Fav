import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Card, Colors, Divider, List } from 'react-native-paper';
import { formartarValor, formartarValorSmall } from '../../util/Formatar';
import { getListaPrecificacao } from '../../util/Calculos';

const styles = StyleSheet.create({
    img: {
        height: 140,
        width: 120,
        marginLeft: 8,
        marginTop: 6,
        marginBottom: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'gray',
    },
    grid: {
        flex: 1
    },
    card: {
    },
    footer: {
        height: 100
    },
    btItem: {
        flex: 1,
        marginLeft: 16,
        marginRight: 16,
        paddingTop: 10
    },
    labelName: {
        fontSize: 16,
        lineHeight: 20,
        height: 40
    },
    labelHora: {
        fontSize: 10,
        color: 'gray',
        paddingBottom: 4
    },
    labelPrecoItem: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 1,
        margin: 0
    },
    containerItem: {
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'row',
    },
    containerItemValor: {
        display: 'flex',
        flex: 1,
        alignContent: 'center',
        borderColor:'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 6,
        marginRight: 5,
        paddingVertical: 4
    },
    itemValor: {
        margin: 0,
        padding: 0,
    },
    txtItemValor: {
        margin: 0,
        padding: 0,
        lineHeight: 14,
        fontSize: 8,
        color: 'gray',

    },
    titleItemValor: {
        margin: 0,
        padding: 0,
        lineHeight: 14,
        fontSize: 12,
        color: 'gray',
        fontWeight: 'bold'
    },
    containerValores: {
        flexDirection: 'row',
        marginTop: 12
    },
    titleValor: {
        fontSize: 8,
        marginLeft: 8,
        marginTop: 4,
        color: 'gray',
    },
    containerVazio: {
        flex: 1,
        marginVertical: 6,
        marginRight: 8,
        paddingVertical: 4
    },
    mainContainer:{
        marginBottom: 6,
    }
});

const dateToYMD = (date) => {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
};

const getHora = (hora) => {
    const varDate = new Date(hora);
    const data = dateToYMD(varDate) + ` às ${varDate.toLocaleTimeString()}`;



    return data;
};

function ItemValor({ valor, comissao, title }) {
    return (
        <View style={styles.containerItemValor}>
            <Text style={styles.titleValor}>{title}</Text>
            <List.Item
                style={styles.itemValor}
                descriptionStyle={styles.txtItemValor}
                titleStyle={styles.titleItemValor}
                title={formartarValorSmall(valor)} />
        </View>
    );
};

function ContainerValores({ produto }) {
    const { comissao, prodValor, atacado } = produto;
    const listaDeValores = getListaPrecificacao(comissao, prodValor, atacado);
    return (
        <View style={styles.containerValores}>
            {listaDeValores.map(item => {
                return <ItemValor key={item.id} comissao={item.comissao} valor={item.valor} title={item.nome} />;
            })}
            {!atacado ? <View style={styles.containerVazio} /> : null}

        </View>
    );
};

export default function ItemProdutoCentral({ path, nome, id, navigation, editor, produto, noClick, click }) {

    const { imgCapa, prodName, comissao, categorias, timeUpdate, prodValor, idProduto, imagens } = produto;

    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={0.7} onPress={() => click(produto)}>
            <Divider />
            <Card style={styles.card}>
                <View style={styles.containerItem}>
                    <Image style={styles.img} source={{ uri: imgCapa }} />
                    <View style={styles.btItem}>
                        {timeUpdate ? <Text numberOfLines={6} style={styles.labelHora}>{getHora(timeUpdate)}</Text> : null}
                        <Text numberOfLines={2} style={styles.labelName}>{prodName}</Text>
                        <ContainerValores produto={produto} />
                    </View>

                </View>



            </Card>
            
            <Divider />
        </TouchableOpacity>
    );
}