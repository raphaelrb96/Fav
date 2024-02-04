import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, Card, Colors, Divider, List, Switch } from 'react-native-paper';
import { formartarValor, formartarValorSmall } from '../../util/Formatar';
import { getListaPrecificacao } from '../../util/Calculos';
import { colorCinza, colorPrimary, colorPrimaryDark, colorSecondaryLight } from '../../constantes/cores';

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
        backgroundColor: colorSecondaryLight,
        borderRadius: 0,
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
        height: 40,
        color: colorCinza
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
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 6,
        marginRight: 5,
        paddingVertical: 4
    },
    itemValor: {

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
        fontWeight: 'bold',
        marginLeft: 8,
        marginTop: 4,
        paddingBottom: 5
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
    mainContainer: {
        marginBottom: 6,
    },
    switch: {
        flex: 1,
        margin: 0,
        padding: 0,
        marginTop: -6,
        marginBottom: 4
    },
    row: {
        flexDirection: 'row'
    },
    btn: {
        marginTop: 6,
        marginBottom: 16,
        marginHorizontal: 32,
        borderColor: colorPrimaryDark,
        color: colorPrimaryDark
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
            <Text style={styles.titleItemValor}>{formartarValorSmall(valor)}</Text>

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

export default function ItemProdutoCentral({ path, nome, id, navigation, editor, produto, noClick, click, switc }) {

    const { imgCapa, prodName, comissao, categorias, timeUpdate, prodValor, disponivel, idProduto, imagens } = produto;

    const [disp, setDisp] = useState(disponivel);

    const onSwith = () => {
        setDisp(disp ? false : true);
        switc(produto);
    };

    return (
        <View style={styles.mainContainer}>
            <Divider />
            <Card style={styles.card}>
                <View style={styles.containerItem}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => click(produto)}>
                        <Image style={styles.img} source={{ uri: imgCapa }} />
                    </TouchableOpacity>

                    <View style={styles.btItem}>
                        {
                            timeUpdate ?
                                <View style={styles.row}>
                                    <Text numberOfLines={6} style={styles.labelHora}>
                                        {getHora(timeUpdate)}
                                    </Text>
                                    <Switch color={disp ? colorPrimary : colorCinza} value={disp} style={styles.switch} onValueChange={onSwith} />
                                </View>
                                :
                                null
                        }
                        <Text numberOfLines={2} style={styles.labelName}>{String(prodName).toUpperCase()}</Text>
                        <ContainerValores produto={produto} />
                    </View>

                </View>



            </Card>

            <Divider />
        </View>
    );
}