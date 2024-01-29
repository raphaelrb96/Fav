import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { List, DefaultTheme, Avatar, Subheading, Card, Button, Text, Paragraph, Caption, Divider } from 'react-native-paper';
import { colorCinza, colorCinzaClaro, colorPrimary, colorPrimaryDark, colorVermelho } from '../../constantes/cores';
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorPrimary
    }
};

const styles = StyleSheet.create({
    subheader: {
    },
    itemContainer: {
        flex: 1,
        margin: 0,
        padding: 0,
        paddingLeft: 16,
        paddingRight: 10
    },
    itemDescricao: {
        flex: 1
    },
    dados: {
        margin: 0,
        padding: 0
    },
    footer: {
        height: 20
    },
    iconeContainer: {
        height: '100%',
        padding: 0,
        margin: 0,
    },
    icone: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 14,
        marginLeft: 4,
        marginRight: 4
    },
    bt: {
        fontSize: 30
    },
    botao: {
        margin: 6
    },
    txt: {
        color: colorCinza,
        fontSize: 12,

    },
    txtCancelamento: {
        color: colorCinzaClaro,
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 14,
    },
    txtCliente: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    flex: {
        backgroundColor: colorPrimaryDark,
        display: 'flex',
        flex: 1,
    },
    alertaErro: {
        marginBottom: 16,
        marginTop: 16,
        marginRight: 16,
        marginLeft: 16,
        borderRadius: 16,
        borderColor: 'red',
        borderWidth: 2,
    },
    containerImgAlert: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'row'

    },
    imgAlert: {
        height: 30,
        width: 30,
        marginLeft: 8,
    },
    textAlert: {
        color: colorVermelho,
        textAlign: 'left',
        alignItems: 'flex-start',
        paddingLeft: 0,
        marginEnd: 16
    },
    btnAlert: {
        flex: 1,
        marginEnd: 16,
        marginTop: 12,
        marginBottom: 12,
        padding: 0
    }
});

const atualizarComissao = async (item, callback) => {
    const batch = firestore().batch();

    const { comissaoTotal, listaDeProdutos, idCompra, uidUserRevendedor, existeComissaoAfiliados } = item;

    let rev1 = firestore().collection('Revendas').doc(idCompra);
    let rev2 = firestore().collection('MinhasRevendas').doc('Usuario').collection(uidUserRevendedor).doc(idCompra);

    const v = getValorComissoes(listaDeProdutos);

    batch.update(rev1, 'comissaoTotal', v);
    batch.update(rev2, 'comissaoTotal', v);

    await batch.commit().then(() => {
        return callback(true);
    }).catch(error => {
        return callback(false);
    });

};

const dateToYMD = (date) => {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}
const getFormaPagamento = (n) => {
    switch (n) {
        case 4:
            return 'Dinheiro';
        default:
            return 'Cartão';
    }
}

const getMotivoCancelamento = (id) => {
    switch (id) {
        case 1:
            return 'Produto está em falta no estoque e indisponivel no fornecedor';
        case 2:
            return 'Produto está em falta no estoque e não conseguimos pegar no fornecedor';
        case 3:
            return 'Produto era falta no estoque e não chegou no tempo que o cliente desejava';
        case 4:
            return 'O cliente desistiu por causa de um longo tempo de entrega';
        case 5:
            return 'O cliente desistiu por exigir que a entrega fosse imediata';
        case 6:
            return 'O cliente desistiu na hora da entrega por nao está de acordo com as caracteristicas do produto';
        case 7:
            return 'Venda cadastrada com informações ou quantidade erradas';
        case 8:
            return 'Cliente não respondeu, ou não atendeu o suporte';
        case 9:
            return 'Cliente desistiu da compra antes do pedido sair da loja';
        default:
            return 'Nenhum motivo declarado';
    }
};

const isValueSucessComissoes = (v, list) => {
    if (!list || !v) return false;

    let total = 0;

    list.map(item => {
        const subtotal = item.quantidade * item.comissaoUnidade;
        total = total + subtotal;
    });

    return v === total;
};

const getValorComissoes = (list) => {
    if (!list) return 5;
    let total = 0;
    list.map(item => {
        const subtotal = item.quantidade * item.comissaoUnidade;
        total = total + subtotal;
    });

    return total;
};

function AlertaGrave({ show, click, load, setLoad }) {

    if (!show) return null;

    const onClick = () => {
        setLoad(true);
        click();
    };

    return (
        <View style={styles.alertaErro}>
            <View style={styles.containerImgAlert}>
                <List.Icon style={styles.imgAlert} color={colorVermelho} icon="alert" />
                <List.Subheader style={styles.textAlert}>Erro na Comissão</List.Subheader>
                <Button onPress={onClick} loading={load} color={colorVermelho} style={styles.btnAlert} mode='contained' theme={theme}>Corrigir</Button>
            </View>
        </View>
    );
};

function ItemProdutoVenda({ q, nome, path }) {
    return (
        <List.Item
            theme={theme}
            title={`${q} ${nome.slice(0, 20)}...`}
        />
    );
};

function Content({ detalhe, idCancelamento, detalheCancelamento, status, cliente }) {

    if (status !== 3) {
        return (
            <>
                <Text style={styles.txtCliente}>
                    {`${String(cliente).toLocaleUpperCase()}`}
                </Text>
                <Text style={styles.txt}>

                    {`\n${detalhe}`}
                </Text>
            </>
        )
    }

    let textCancelamento = detalheCancelamento ? `\n"${detalheCancelamento}"` : null;

    if (idCancelamento > 0) {
        textCancelamento = `\n\n"${getMotivoCancelamento(idCancelamento)}"`;
    }

    return (
        <>
            <Text style={styles.txtCliente}>
                {`${cliente}`}
            </Text>
            <Text style={styles.txt}>
                {`\n${detalhe}`}
            </Text>

            <Text style={styles.txtCancelamento}>
                {textCancelamento ? textCancelamento : null}
            </Text>

        </>
    )
};

export default function ItemVenda({ item, click }) {

    const [load, setLoad] = useState(false);

    let hoje = new Date().toLocaleDateString();
    let varDate = new Date(item.hora);
    let dataVenda = varDate.toLocaleDateString();
    let data = 'Hoje';

    if (dataVenda !== hoje) {
        //data = `${varDate.getUTCDate()}/${varDate.getMonth()}/${varDate.getFullYear()}`;
        data = dateToYMD(varDate);
    }

    const { comissaoTotal, listaDeProdutos } = item;

    const getIcone = () => {

        if (item.statusCompra === 3) {
            if (!item.idCancelamento) {
                return 'close-circle-outline';
            } else {
                return 'close-circle-multiple';
            }
        }

        if (item.statusCompra === 1) {
            return 'alert-octagram';
        }

        if (item.statusCompra === 4) {
            return 'motorbike';
        }

        if (item.statusCompra === 2) {
            return 'timer-sand';
        }

        if (item.statusCompra === 5) {
            return 'checkbox-multiple-marked-circle';
        }

        return "clipboard-list";
    };

    const corrigirComissao = () => {

        atualizarComissao(item, (sucess) => {
            setLoad(false);
            if(!sucess) {
                
            }
        });

    };

    const detalheTxt = `${String(item.complemento).toUpperCase()} \n${item.listaDeProdutos[0].quantidade} ${item.listaDeProdutos[0].produtoName.toLowerCase()} \n`;
    const comissaoSucess = isValueSucessComissoes(comissaoTotal, listaDeProdutos);

    return (
        <>
            <Divider />
            <TouchableWithoutFeedback onPress={() => click(item)}>

                <List.Item
                    theme={theme}
                    title={`${data} as ${new Date(item.hora).toLocaleTimeString()} \n${String(item.userNomeRevendedor).toLocaleUpperCase()}`}
                    titleNumberOfLines={3}
                    titleStyle={{ fontWeight: 'bold' }}
                    style={styles.itemContainer}
                    expanded={false}
                    descriptionStyle={styles.itemDescricao}
                    descriptionNumberOfLines={17}
                    description={<Content status={item.statusCompra} cliente={item.nomeCliente} detalhe={detalheTxt} idCancelamento={item.idCancelamento} detalheCancelamento={item.detalheCancelamento} />}
                    right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>}
                    left={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon={getIcone()} /></View>}>

                    <List.Section>
                        <List.Subheader style={styles.subheader}>Informações</List.Subheader>
                        <List.Item style={styles.dados} title={item.nomeCliente} description="Cliente" />
                        <List.Item style={styles.dados} title={item.phoneCliente} description="Contato" />
                        <List.Item style={styles.dados} title={item.complemento} description="Bairro" />
                        <List.Item style={styles.dados} title={item.adress} titleNumberOfLines={4} description="Endereço" />
                        <List.Item style={styles.dados} title={getFormaPagamento(item.formaDePagar)} description="Pagamento" />
                    </List.Section>

                    <List.Section>
                        <List.Subheader style={styles.subheader}>Produtos</List.Subheader>
                        {item.listaDeProdutos.map(obj => <List.Item key={obj.idProdut} style={styles.dados} title={`${obj.quantidade} ${obj.produtoName.toLowerCase().slice(0, 35)}`} description={`Total R$ ${obj.valorTotal},00`} />)}
                        <List.Item style={styles.dados} title={`R$ ${item.valorTotal}.00`} description="Total da Compra" />

                    </List.Section>


                    <Card.Actions>
                        <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="alert-circle-check" />
                        <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="rocket-launch" />
                        <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="close-box" />
                        <Button mode="outlined" theme={theme} style={styles.botao} labelStyle={styles.bt} icon="shield-check" />

                    </Card.Actions>

                    <View style={styles.footer} />

                </List.Item>

            </TouchableWithoutFeedback>

            <AlertaGrave 
                show={!comissaoSucess} 
                click={corrigirComissao} 
                setLoad={setLoad}
                load={load} />

            <Divider />
        </>

    );
}