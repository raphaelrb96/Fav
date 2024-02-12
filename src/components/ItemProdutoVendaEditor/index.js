import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, List, Paragraph, Text, Title, DefaultTheme, TextInput, Icon, Headline, Button } from 'react-native-paper';
import { colorCinza, colorSecondaryLight } from '../../constantes/cores';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,
        background: colorSecondaryLight,
        accent: colorCinza
    }
};

const styles = StyleSheet.create({
    img: {
        height: 80,
        width: 80,
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 0,
        borderRadius: 4
    },
    container: {
        margin: 0,
        padding: 0,
    },
    text: {
        marginTop: 6,
        marginBottom: -6,
        marginRight: 16,
    },
    content: {
        flex: 1,

    },
    iconeContainer: {
        height: '100%',
        padding: 0,
        margin: 0,
        marginRight: -10
    },
    icone: {
        justifyContent: 'flex-end',
        marginTop: 14,
        marginLeft: 4,
    },
    input: {
        marginRight: 16,
        marginLeft: 16,
        paddingBottom: 0,
        marginTop: 6,
        marginBottom: 26,
        maxHeight: 250,
        backgroundColor: 'transparent'
    },
    inputRow: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 6,
        backgroundColor: 'transparent'

    },
    flexRow: {
        flexDirection: 'row',
        marginTop: -16,
        marginBottom: 26,
        marginRight: 16,
        marginLeft: 16,
    },
    iconInput: {
        marginTop: 6,
    },
    subheader: {
        marginLeft: 8,
        marginRight: 20,
        marginTop: 0,
        marginBottom: 8
    },
    btnSalvarValores: {
        marginBottom: 26,
        marginHorizontal: 16,
        display: 'none'
    },
    containerBotoes: {
        width: 40,
        marginTop: 12
    },
    contentBotao: {
    },
    botao: {
        width: 40,
        height: 40,
        margin: 0,
        padding: 0
    },
});

function Botoes ({aumentar, diminuir}) {

    const AUMENTAR = true;
    const DIMINUIR = false;

    return(
        <View style={styles.containerBotoes}>
            <TouchableOpacity onPress={aumentar} style={styles.contentBotao}>
                <List.Icon color={colorCinza} icon="plus-circle" style={styles.botao}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={diminuir} style={styles.contentBotao}>
                <List.Icon color={colorCinza} icon="minus-circle" style={styles.botao}/>
            </TouchableOpacity>
        </View>
    );
}

export default function ItemProdutoVendaEditor({ title, description, path, style, produto, index, aumentar, diminuir, alterarValor, alterarModo }) {
    
    const { modoPreco, valorUni, comissaoUnidade, quantidade, idModoPreco } = produto;
    const stringModo = modoPreco ? modoPreco : 'Varejo';
    
    return (
        <View style={styles.container}>

            <Headline style={styles.subheader}>Editar Item</Headline>

            <List.Item
                left={() => <Image style={styles.img} source={{ uri: path }} />}
                right={props => <Botoes aumentar={() => aumentar(produto, index)} diminuir={() => diminuir(produto, index)} />}
                style={styles.container}
                title={() => (
                    <List.Item
                        title={String(title).toUpperCase()}
                        style={styles.content}
                        titleNumberOfLines={4}
                    />
                )}
            />

            <TextInput
                theme={theme}
                value={stringModo}
                editable={false}
                onChangeText={(value) => {}}
                label="Opção de Preço"
                mode="outlined"
                style={styles.input}
                right={<TextInput.Icon style={styles.iconInput} onPress={() => alterarModo(index, valorUni, comissaoUnidade, idModoPreco)} size={20} icon={'sync'} />}

            />

            <View style={styles.flexRow}>
                <TextInput
                    editable={false}
                    theme={theme}
                    value={String(comissaoUnidade * quantidade)}
                    label={"Comissão"}
                    disabled
                    mode="outlined"
                    style={styles.inputRow}

                />
                <View style={{ width: 16 }} />
                <TextInput
                    keyboardType="decimal-pad"
                    editable={false}
                    theme={theme}
                    value={String(valorUni * quantidade)}
                    label={"Valor Total"}
                    disabled
                    mode="outlined"
                    style={[styles.inputRow, {flex: 1.5}]}
                />
            </View>

            <Button
                compact
                style={styles.btnSalvarValores}
                buttonColor='#00000020'
                mode='contained-tonal'>Salvar</Button>

        </View>

    );
}