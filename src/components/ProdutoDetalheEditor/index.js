import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StatusBar, StyleSheet, ScrollView, Text, Image, Alert } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Card, Title, List, Avatar, TextInput, DefaultTheme, Checkbox, Chip, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState } from 'react';

import {
    TouchableOpacity,
} from '@gorhom/bottom-sheet';
import { colorCinza, colorSecondary, colorSecondaryLight } from '../../constantes/cores';

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
    containerInfor: {

    },
    input: {
        marginRight: 16,
        marginLeft: 16,
        paddingTop: 6,
        paddingBottom: 6,
    },
    inputRow: {
        flex: 1

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
        textAlign: 'center'
    },
    sectionTiles: {
        fontSize: 20,
        marginLeft: 6
    },
    cardItem: {
        marginRight: 8,
        marginLeft: 16,
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
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 6,
        paddingTop: 6,
    },
    areaCategoria: {
        paddingBottom: 10,
    },
    checkbox: {
        width: 200
    },
    checkboxContainer: {
        marginTop: 20
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
        marginRight: 16,
        marginLeft: 16,
        marginTop: 12
    },
    contentContainer: {
        backgroundColor: "white",
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
});





function InputImagens({ fotos, setFotos }) {


    const option = {
        mediaType: 'photo',
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
            <Card elevation={8} style={styles.cardItem}>
                <TouchableOpacity onPress={click} style={styles.item} >
                    <Icon style={styles.itemIcon} color="#4F4F4F" size={35} name="image-search" />
                    <Text style={styles.itemText}>Add Imagem</Text>
                </TouchableOpacity>
            </Card>

        );
    }

    function ItemFoto({ path, remove, uriLocal }) {
        if(uriLocal) console.log('Novo arquivo local render')
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
        setFotos(imgsList);
    };

    console.log(JSON.stringify('render lista fotos'))

    return (
        <View>

            <View style={styles.containerFotos}>
                <Title style={styles.title}>Imagens do Produto</Title>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    ListHeaderComponent={(item) => <ItemHeader click={addImg} />}
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


}

function InputInformacoes({ nome, fabricante, descricao, valor, garantia, comissao, cashback, disponivel, setProdObj }) {

    const [checked, setChecked] = React.useState('checked');
    const [title, setTitle] = useState('Disponivel');

    useEffect(() => {
        if (disponivel) {
            setChecked('checked');
        } else {
            setChecked('unchecked');
        }
    }, []);

    const onchek = value => {

        console.log(value)

        if (checked !== 'checked') {
            setTitle('Disponivel');
            setChecked('checked');
            setProdObj((prevState) => ({
                ...prevState,
                disponivel: true
            }));
        } else {
            setTitle('Indisponivel');
            setChecked('unchecked');
            setProdObj((prevState) => ({
                ...prevState,
                disponivel: false
            }));
        }

    };

    return (
        <View>

            <View style={styles.containerInfor}>

                <Title style={styles.title}>Informações Principais</Title>

                <TextInput
                    theme={theme}
                    value={nome}
                    onChangeText={(value) => {
                        setProdObj((prevState) => ({
                            ...prevState,
                            nome: value
                        }));
                    }}
                    label="Nome do produto"
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    theme={theme}
                    value={fabricante}
                    onChangeText={(value) => {
                        setProdObj((prevState) => ({
                            ...prevState,
                            fabricante: value
                        }));
                    }}
                    label="Fabricante"
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    theme={theme}
                    value={descricao}
                    onChangeText={(value) => {
                        setProdObj((prevState) => ({
                            ...prevState,
                            desc: value
                        }));
                    }}
                    label="Descrição"
                    mode="outlined"
                    style={styles.input}
                />

                <View style={styles.flexRow}>
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={valor.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                valor: value
                            }));
                        }}
                        label="Preço"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                    <View style={{ width: 16 }} />
                    <TextInput
                        theme={theme}
                        value={garantia}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                garantia: value
                            }));
                        }}
                        label="Garantia"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                </View>

                <View style={styles.flexRow}>
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={comissao?.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                comissao: value
                            }));
                        }}
                        label="Comissão"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                    <View style={{ width: 16 }} />
                    <TextInput
                        keyboardType="decimal-pad"
                        theme={theme}
                        value={cashback?.toString()}
                        onChangeText={(value) => {
                            setProdObj((prevState) => ({
                                ...prevState,
                                cashback: value
                            }));
                        }}
                        label="Cashback"
                        mode="outlined"
                        style={styles.inputRow}
                    />
                </View>

                <View style={styles.checkboxContainer}>
                    <Checkbox.Item
                        label={title}
                        status={checked}
                        position={'leading'}
                        labelStyle={{ fontSize: 20 }}
                        onPress={onchek}
                        theme={theme}
                        style={styles.checkbox}
                    />
                </View>

            </View>

        </View>
    );
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

function ContainerCategorias({ categoria, setProdObj }) {

    return (
        <View style={styles.areaCategoria}>
            <Title style={styles.title}>Categoria do produto</Title>

            <ScrollingButtonMenu
                items={categorias}
                activeBackgroundColor={colorCinza}

                selected={categoria}
                onPress={(e) => {
                    setProdObj((prevState) => ({
                        ...prevState,
                        categoria: e.id
                    }));
                }}
            />
        </View>
    );
}

function ContainerColecoes({ lista, setLista, open }) {

    let pegarColecoesList = () => {

        if (lista === null || lista === undefined) return;

        let listaNova = [];

        for (let i = 0; i < COLECOES_LIST.length; i++) {
            const colec = COLECOES_LIST[i];

            for (let x = 0; x < lista.length; x++) {
                const colecSelect = lista[x];

                if (colecSelect === colec.id) {
                    listaNova.push(colec.name);
                }

            }
        }

        return listaNova;
    }

    const [selecionadas, setSelecionadas] = useState([]);

    useEffect(() => {
        let l = pegarColecoesList();
        setSelecionadas(l);
    }, []);

    let remover = index => {
        if (lista.length === 1) {
            setLista(new Array());
            return;
        }
        let nova = lista;
        nova.splice(index, 1);
        setLista([...nova]);
    };



    return (
        <View>
            <Title style={styles.title}>Coleções</Title>
            <View style={styles.flexRow}>
                <Button theme={theme} icon="more" mode="outlined" onPress={() => open()}>
                    Adicionar Coleções
                </Button>

            </View>

            <FlatList
                style={styles.chipVariante}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({ item, index }) => (
                    <Chip onClose={() => remover(index)} style={{ marginRight: 10 }} >{item}</Chip>
                )}
                keyExtractor={(item, index) => index}
                data={pegarColecoesList(lista)}
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

function ContainerVariantes({ title, lista, setLista }) {

    const [text, setText] = useState('');

    let adicionar = () => {
        if (text.length < 1) return;
        let nova = lista;
        nova.push(text);
        setLista(nova);
        setText('')

    };

    let remover = index => {
        let nova = lista;
        nova.splice(index, 1);
        setLista([...nova]);
    };

    return (
        <View>
            <Title style={styles.title}>{title}</Title>
            <View style={styles.flexRow}>
                <TextInput
                    theme={theme}
                    value={text}
                    returnKeyType="done"
                    onSubmitEditing={adicionar}
                    onChangeText={(value) => {
                        setText(value);
                    }}
                    label={title}
                    mode="outlined"
                    style={styles.inputRow}
                />

            </View>

            <FlatList
                style={styles.chipVariante}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({ item, index }) => (
                    <Chip onClose={() => remover(index)} style={{ marginRight: 10 }} >{item}</Chip>
                )}
                keyExtractor={(item, index) => index}
                data={lista}
            />

        </View>
    );
}


export default function ProdutoDetalheEditor({ state, setState }) {


    const { imgCapa, imagens } = state.produto;



    


    return (
        <ScrollView showsHorizontalScrollIndicator={false}>
            <InputImagens
                fotos={imagens}
                capa={imgCapa}
                setFotos={setState}
            />
        </ScrollView>
    );
}