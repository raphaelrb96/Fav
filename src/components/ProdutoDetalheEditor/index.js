import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StatusBar, StyleSheet, ScrollView, Text, Image, Alert } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Card, Title, List, Avatar, TextInput, DefaultTheme, Checkbox, Chip, Button, Divider, Icon } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState } from 'react';

import {
    TouchableOpacity,
} from '@gorhom/bottom-sheet';
import { colorCinza, colorPrimary, colorSecondary, colorSecondaryLight } from '../../constantes/cores';
import { getListaPrecificacao } from '../../util/Calculos';
import { CATEGORIA_LIST } from '../../util/Categorias';

const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,
        background: colorSecondaryLight,
        accent: colorCinza
    }
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: colorSecondaryLight,
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 10,
        height: '100%',
        width: '100%',
    },
    title: {
        marginLeft: 16,
        marginTop: 18,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    bottomSheet: {
        elevation: 8
    },
    containerBottom: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 10,
        height: '100%',
        width: '100%',
    },
    sectionHeaderContainer: {
        backgroundColor: "white",
        padding: 6,
    },
    containerFotos: {
        height: 250,
        flex: 1,
        borderBottomColor: colorCinza,
        borderBottomWidth: 0.8,
        backgroundColor: colorSecondary
    },
    containerDefault: {
        flex: 1,
        borderBottomColor: colorCinza,
        borderBottomWidth: 0.8,
        backgroundColor: colorSecondary
    },
    containerInfor: {
        paddingBottom: 24,
        paddingTop: 6,
        borderBottomColor: colorCinza,
        borderBottomWidth: 0.8,
        backgroundColor: colorSecondaryLight
    },
    input: {
        marginRight: 16,
        marginLeft: 16,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 6,
        maxHeight: 250
    },
    iconInput: {
        marginTop: 6,
    },
    inputRow: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 6
    },
    inputRowMini: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 6
    },
    item: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: '#4F4F4F',
        borderRadius: 6,
        padding: 6,
    },
    itemIcon: {
        marginLeft: 0
    },
    itemText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4F4F4F',
        paddingHorizontal: 6,
        paddingTop: 6,
        textAlign: 'center'
    },
    sectionTiles: {
        fontSize: 20,
        marginLeft: 6
    },
    cardItem: {
        marginRight: 8,
        marginLeft: 8,
        width: 150,
        height: 150,
        marginBottom: 12,
        marginTop: 12,
        backgroundColor: colorSecondaryLight
    }, img: {
        width: 150,
        height: 150,
        borderWidth: 0.8,
        borderColor: '#4F4F4F',
        borderRadius: 6,
    },
    flexRow: {
        flexDirection: 'row',
        paddingBottom: 6,
        paddingTop: 6,
        marginRight: 16,
        marginLeft: 16,
    },
    areaCategoria: {
        paddingBottom: 10,
    },
    checkbox: {
        width: '100%',
    },
    checkboxContainer: {
        marginTop: 20,
    },
    botaoVariante: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 6,
        borderWidth: 2,

        borderColor: '#4F4F4F',
        marginTop: 6,

    },
    labelCheckbox: {
        fontSize: 20,
        textAlign: 'left',
        paddingStart: 6
    },
    textBtao: {
        fontSize: 15,
        color: '#4F4F4F',
        fontWeight: 'bold',
        marginLeft: 12,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    label: {
        fontSize: 15,
        color: colorCinza
    },
    chipVariante: {
        marginRight: 8,
        marginLeft: 8,
        marginTop: 10,
    },
    contentContainer: {
        backgroundColor: "white",
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
    btnSalvar: {
        marginLeft: 26,
        marginRight: 26,
        marginTop: 32,
        marginBottom: 16,

    },
    labelButton: {
        fontSize: 20,
        padding: 0,
        paddingTop: 4,
        paddingBottom: 0,
        marginVertical: 16,
        textAlign: 'justify',
    }
});





function InputImagens({ fotos, setState }) {


    const option = {
        mediaType: 'photo',
    };

    function setFotos(listaDeFotos) {


        const imagemCapa = listaDeFotos[0].uri ? listaDeFotos[0].uri : listaDeFotos[0];

        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                imagens: listaDeFotos,
                imgCapa: imagemCapa
            }

        }));
    };

    const listener = (response) => {
        console.log(JSON.stringify(response))

        if (response?.assets != null) {
            let newDados = fotos ? fotos : [];
            response.assets.forEach(asset => {
                newDados.unshift(asset);
            });
            //setFotos([...newDados]);

            let listaDeFotos = [...newDados];

            if (listaDeFotos !== null && listaDeFotos > 0) {



            }

            return newDados;


        }
    };

    function ItemHeader({ click }) {
        return (
            <Card elevation={8} style={[styles.cardItem, { marginLeft: 16 }]}>
                <TouchableOpacity onPress={click} style={styles.item} >
                    <Icon style={styles.itemIcon} color="#4F4F4F" size={35} source="image-search" />
                    <Text style={styles.itemText}>Adicionar Imagem</Text>
                </TouchableOpacity>
            </Card>

        );
    }

    function ItemFoto({ path, remove, uriLocal }) {
        if (uriLocal) console.log('Novo arquivo local render')
        //console.log(path);
        return (
            <Card onLongPress={remove} elevation={8} style={styles.cardItem}>
                <View style={styles.item} >
                    <Image source={{ uri: path }} style={styles.img} />
                </View>
            </Card>

        );
    }

    const addImg = async () => {
        const response = await launchImageLibrary(option);
        const imgsList = listener(response);
        if (imgsList && imgsList.length > 0) {
            setFotos(imgsList);
        }

    };

    return (
        <View>

            <View style={styles.containerFotos}>
                <Title style={styles.title}>Imagens do Produto</Title>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    ListHeaderComponent={(item) => <ItemHeader click={addImg} />}
                    ListFooterComponent={() => <View style={{ width: 8 }} />}
                    renderItem={({ item, index }) => (
                        <ItemFoto
                            uriLocal={item.uri}
                            path={(item.uri == null) ? item : item.uri}
                            remove={() => {
                                console.log('remove: ' + index);
                                let newDados = fotos;
                                newDados.splice(index, 1);
                                setFotos([...newDados]);
                            }}
                        />
                    )}
                    keyExtractor={(item, index) => index}
                    data={fotos}
                />
            </View>

        </View>
    );


};

function InputInformacoes({ state, setState }) {

    const { produto } = state;

    const { imgCapa, imagens } = produto;
    const { idProduto, prodName, prodValor, quantidade, comissao } = produto;
    const { descr, disponivel, fabricante, tag, timeUpdate, cores, atacado } = produto;


    const onCheckDisponivel = (value) => {

        if (!disponivel) {
            setDisponivel(true);
        } else {
            setDisponivel(false);
        }

    };

    const setNome = (v) => {

        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                prodName: v
            }

        }));
    };

    const setFab = (v) => {
        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                fabricante: v
            }

        }));
    };

    const setDesc = (v) => {

        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                descr: v
            }

        }));
    };

    const setDisponivel = (is) => {

        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                disponivel: is
            }

        }));
    };

    return (
        <View>

            <View style={styles.containerInfor}>

                <Title style={styles.title}>Informações Principais</Title>

                <TextInput
                    theme={theme}
                    value={prodName}
                    onChangeText={(value) => setNome(value)}
                    label="Nome do produto"
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    theme={theme}
                    value={fabricante}
                    onChangeText={(value) => setFab(value)}
                    label="Fabricante"
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    theme={theme}
                    value={descr}
                    onChangeText={(value) => setDesc(value)}
                    label="Descrição"
                    mode="outlined"
                    multiline
                    style={styles.input}
                />

                <View style={styles.checkboxContainer}>
                    <Checkbox.Item
                        label={disponivel ? 'Disponível' : 'Indisponível'}
                        status={disponivel ? 'checked' : 'unchecked'}
                        position={'leading'}
                        labelStyle={styles.labelCheckbox}
                        onPress={onCheckDisponivel}
                        theme={theme}
                        style={styles.checkbox}
                    />
                </View>


            </View>

            <Divider />

        </View>
    );
};

function InputValores({ state, setState }) {

    const { produto } = state;
    const { comissao, prodValor, atacado } = produto;

    let listaDeValores = getListaPrecificacao(comissao, prodValor, atacado);

    const setValorVarejo = (v) => {


        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                prodValor: Number(v)
            }

        }));
    };

    const setComissaoVarejo = (v) => {


        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                comissao: Number(v)
            }

        }));
    };

    const setAtacado = (is) => {

        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                atacado: is
            }

        }));
    };

    const onCheckAtacado = (value) => {

        if (!atacado) {
            setAtacado(true);
        } else {
            setAtacado(false);
        }

    };

    return (
        <View>

            <View style={styles.containerInfor}>

                <Title style={styles.title}>Valores e Comissões</Title>

                {listaDeValores.map(item => {
                    const valor = item.id === 0 ? prodValor : item.valor;
                    const cmss = item.id === 0 ? comissao : item.comissao;
                    const enabled = item.id === 0;
                    const nome = item.nome;

                    return (
                        <View key={item.id} style={styles.flexRow}>
                            <TextInput
                                keyboardType="decimal-pad"
                                theme={theme}
                                value={String(valor)}
                                onChangeText={(enabled) ? (value) => setValorVarejo(value) : null}
                                disabled={!enabled}
                                label={"Valor " + nome}
                                mode="outlined"
                                style={styles.inputRow}
                            />
                            <View style={{ width: 16 }} />
                            <TextInput
                                theme={theme}
                                value={String(cmss)}
                                disabled={!enabled}
                                onChangeText={(enabled) ? (value) => setComissaoVarejo(value) : null}
                                label={"Comissão"}
                                mode="outlined"
                                style={styles.inputRow}
                            />
                        </View>
                    );

                })}


                <View style={styles.checkboxContainer}>
                    <Checkbox.Item
                        label={atacado ? 'Vende no Atacado' : 'Não vende no Atacado'}
                        status={atacado ? 'checked' : 'unchecked'}
                        position={'leading'}
                        labelStyle={styles.labelCheckbox}
                        onPress={onCheckAtacado}
                        theme={theme}
                        style={styles.checkbox}
                    />
                </View>

            </View>
        </View>
    );
};

function ContainerCategorias({ state, setState, open }) {

    const { categorias } = state.produto;

    let getNameCategoria = () => {
        if (categorias) {
            const idCateg = Number(Object.getOwnPropertyNames(categorias));
            const nomeCateg = CATEGORIA_LIST[idCateg];
            return nomeCateg;
        }

        return 'Variedades';
    };

    const categName = getNameCategoria();

    return (
        <View>
            <View style={styles.containerInfor}>
                <Title style={styles.title}>Categoria do Produto</Title>
                <TextInput
                    theme={theme}
                    value={categName}
                    label="Categoria do Produto"
                    mode="outlined"
                    right={<TextInput.Icon style={styles.iconInput} onPress={() => open()} size={28} icon={'shape-plus'} />}
                    editable={false}
                    style={styles.input}
                />
            </View>

        </View>
    );
};

function ContainerVariantes({ state, setState }) {

    const [text, setText] = useState('');

    const { cores } = state.produto;

    let adicionar = () => {
        if (text.length < 1) return;
        let nova = cores;
        nova.push(text);
        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                cores: nova
            }

        }));
        setText('')

    };

    let remover = index => {
        let nova = cores;
        nova.splice(index, 1);
        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                cores: [...nova]
            }

        }));
    };

    return (
        <View>
            <View style={styles.containerInfor}>
                <Title style={styles.title}>Variações e Modelos</Title>
                <TextInput
                    theme={theme}
                    value={text}
                    returnKeyType="done"
                    onSubmitEditing={adicionar}
                    onChangeText={(value) => {
                        setText(value);
                    }}
                    label={'Variantes do Produto'}
                    mode="outlined"
                    style={styles.input}
                />


                <FlatList
                    style={styles.chipVariante}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <Chip theme={theme} mode='outlined' onClose={() => remover(index)} style={styles.chipVariante} >{item}</Chip>
                    )}
                    keyExtractor={(item, index) => index}
                    data={cores}
                />
            </View>

        </View>
    );
};

function ContainerButton({ click, state }) {

    function IconeBtn() {
        return (
            <Icon source={"inbox-arrow-up"} size={28} color={colorSecondaryLight} />
        );
    };

    const { loadSave } = state;

    return (
        <View>
            <View style={styles.containerInfor}>
                <Button
                    mode='contained'
                    loading={loadSave}
                    disabled={loadSave}
                    uppercase
                    onPress={click}
                    icon={() => <IconeBtn />}
                    labelStyle={styles.labelButton}
                    style={styles.btnSalvar}>
                    Salvar Produto
                </Button>
            </View>
        </View>
    )
}


function CheckboxPreVenda({ prevenda, setProdObj }) {

    const [checked, setChecked] = React.useState('checked');

    useEffect(() => {
        if (prevenda) {
            setChecked('checked');
        } else {
            setChecked('unchecked');
        }
    }, []);

    const onchek = value => {

        console.log(value);

        if (checked !== 'checked') {
            setChecked('checked');
            setProdObj((prevState) => ({
                ...prevState,
                prevenda: true
            }));
        } else {
            setChecked('unchecked');
            setProdObj((prevState) => ({
                ...prevState,
                prevenda: false
            }));
        }

    };

    return (
        <View style={styles.checkboxContainer}>
            <Checkbox.Item
                label={'Pré Venda'}
                status={checked}
                position={'leading'}
                labelStyle={{ fontSize: 20 }}
                onPress={onchek}
                theme={theme}
                style={styles.checkbox}
            />
        </View>
    );
}

function InputMedidas({ peso, altura, largura, comprimento, setProdObj }) {
    return (
        <View>

            <View style={styles.containerInfor}>

                <Title style={styles.title}>Medidas do produto</Title>

                <View style={styles.flexRow}>
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={peso.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                peso: value
                            }));
                        }}
                        label="Peso"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                    <View style={{ width: 16 }} />
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={altura.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                altura: value
                            }));
                        }}
                        label="Altura"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                </View>

                <View style={styles.flexRow}>
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={largura.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                largura: value
                            }));
                        }}
                        label="Largura"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                    <View style={{ width: 16 }} />
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={comprimento.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                comprimento: value
                            }));
                        }}
                        label="Comprimento"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                </View>

            </View>

        </View>
    );
}




export default function ProdutoDetalheEditor({ state, setState, salvar }) {


    const { produto } = state;

    const { imgCapa, imagens, categorias } = produto;
    const { idProduto, prodName, prodValor, quantidade, comissao } = produto;
    const { descr, disponivel, fabricante, tag, timeUpdate, cores } = produto;



    const openSheet = () => {
        setState((prevState) => ({
            ...prevState,
            open: true,
            modoGaveta: 1
        }));
    };

    return (
        <ScrollView showsHorizontalScrollIndicator={false}>

            <InputImagens
                fotos={imagens}
                capa={imgCapa}
                setState={setState}
            />

            <InputInformacoes
                state={state}
                setState={setState}
            />

            <InputValores
                state={state}
                setState={setState} />

            <ContainerCategorias
                open={openSheet}
                state={state}
                setState={setState} />

            <ContainerVariantes
                state={state}
                setState={setState} />

            <ContainerButton
                state={state}
                click={salvar} />

        </ScrollView>
    );
}