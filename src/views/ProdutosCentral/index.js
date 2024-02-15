import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ItemProdutoCentral from '../../components/ItemProdutoCentral';
import { FAB, PaperProvider, Searchbar } from 'react-native-paper';
import { colorPrimaryDark, colorSecondaryLight } from '../../constantes/cores';
import { CATEGORIA_LIST } from '../../util/Categorias';



const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1
    },
    contentContainer: {
        backgroundColor: '#fff'
    },
    row: {
        flexDirection: 'row'
    },
    bottomSheet: {
        elevation: 18
    },
    content: {
    },
    spacing: {
        marginTop: 6
    },
    toolbar: {
        borderRadius: 0,
        backgroundColor: colorSecondaryLight
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colorPrimaryDark,
        color: '#fff'
    },
    containerLoad: {
        height: 150
    },
    sectionHeaderContainer: {
        backgroundColor: "white",
        padding: 12,
    },
    itemContainer: {
        padding: 12,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    sectionHeaderContainerText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6
    },
    itemContainerText: {

    }
});

const definirRef = (type) => {

    let ref = firestore().collection('produtos').limit(50);

    switch (type) {
        case 991:
            ref = firestore().collection('produtos').orderBy("timeUpdate", "desc").limit(200);
            break;
        case 992:
            ref = firestore().collection('produtos').orderBy("timeUpdate", "asc").limit(200);
            break;
        case 993:
            ref = firestore().collection('produtos').orderBy("prodValor", "desc").limit(200);
            break;
        case 994:
            ref = firestore().collection('produtos').orderBy("prodValor", "asc").limit(200);
            break;
        case 995:
            ref = firestore().collection('produtos').orderBy("comissao", "desc").limit(200);
            break;
        case 996:
            ref = firestore().collection('produtos').orderBy("comissao", "asc").limit(200);
            break;
        case 881:
            ref = firestore().collection('produtos').where("atacado", "==", true).limit(200);
            break;
        case 882:
            ref = firestore().collection('produtos').where("disponivel", "==", true).limit(400);
            break;
        case 883:
            ref = firestore().collection('produtos').where("disponivel", "==", false).limit(400);
            break;
        default:
            ref = firestore().collection('produtos').where("categorias." + type, "==", true).limit(400);
            break;
    }

    return ref;

};

const listarProdutos = (filterType, listener) => {


    const ref = definirRef(filterType);

    const onNext = snap => {

        if (!snap) {
            listener(null);
            return;

        }

        let lista = [];

        if (snap != null && snap.size > 0) {

            snap.forEach(doc => {
                let objItem = doc.data();
                lista.push(objItem);
            });

        }

        listener(lista);

    };

    const onError = error => {
        listener(null);
    };

    const unsubscribe = ref.onSnapshot(onNext, onError);

    return unsubscribe;

};

const pesquisarProduto = (text, listener) => {
    const ref = firestore().collection('produtos').where(`tag.${text}`, '==', true).limit(200);

    const onNext = snap => {

        if (!snap) {
            listener(null);
            return;

        }

        let lista = [];

        if (snap != null && snap.size > 0) {

            snap.forEach(doc => {
                let objItem = doc.data();
                lista.push(objItem);
            });

        }

        listener(lista);

    };

    const onError = error => {
        listener(null);
    };

    const unsubscribe = ref.onSnapshot(onNext, onError);

    return unsubscribe;
};

const switchDisponibilidade = (produto, setState, list, index) => {
    const disp = !produto.disponivel;
    const referencedb = firestore().collection('produtos').doc(produto.idProduto);
    let novaLista = list;
    
    novaLista[index].disponivel = disp;
    setState((prevState) => ({
        ...prevState,
        list: novaLista,
    }));

    referencedb.update({ disponivel: disp });
};

function Content({ state, click, setState }) {

    const { list, load } = state;

    if (load) return (
        <View style={styles.content}>
            <Pb />
        </View>
    );

    return (
        <View style={styles.content}>
            <FlatList
                renderItem={({ item, index }) => <ItemProdutoCentral click={click} produto={item} switc={() => switchDisponibilidade(item, setState, list, index)} />}
                ListHeaderComponent={() => <View style={styles.spacing} />}
                data={list} />
        </View>

    );
}

function BottomSheetProdutos({ refs, index, points, callback, filter }) {

    const filtros = [
        {
            title: 'Classificar por:',
            data: [
                { nome: 'Mais Recentes', id: 991 },
                { nome: 'Mais Antigos', id: 992 },
                { nome: 'Valores maiores', id: 993 },
                { nome: 'Valores menores', id: 994 },
                { nome: 'Comissões maiores', id: 995 },
                { nome: 'Comissões menores', id: 996 },
            ]
        },
        {
            title: 'Filtrar por:',
            data: [
                { nome: 'Produto em Atacado', id: 881 },
                { nome: 'Produto disponivel', id: 882 },
                { nome: 'Produto indisponivel', id: 883 },
            ]
        },
        {
            title: 'Listar por categoria:',
            data: [
                ...CATEGORIA_LIST,
            ]
        },
    ];

    const renderSectionHeader = useCallback(
        ({ section }) => (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderContainerText}>{section.title}</Text>
            </View>
        ),
        []
    );

    const renderItem = useCallback(
        ({ item, index }) => (
            <TouchableOpacity onPress={() => filter(item.id ? item.id : index)} style={styles.itemContainer}>
                <Text style={styles.itemContainerText}>{item.nome ? item.nome : item}</Text>
            </TouchableOpacity>
        ),
        []
    );

    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            {...props}
            opacity={0.4}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    ), []);

    return (
        <BottomSheet
            ref={refs}
            index={index}
            style={styles.bottomSheet}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            snapPoints={points}
            onChange={callback}>
            <BottomSheetSectionList
                sections={filtros}
                keyExtractor={(i, index) => i.id ? i.id : index}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
                contentContainerStyle={styles.contentContainer}
            />
        </BottomSheet>
    );
};

export default function ProdutosCentral({ navigation }) {

    //LogBox.ignoreAllLogs();


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.row}>
                    <TouchableOpacity onPress={handlePresentModalPress}>
                        <Icon style={{ marginRight: 16 }} color={'#000'} size={24} name="magnify" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clickFilter}>
                        <Icon style={{ marginRight: 16 }} color={'#000'} size={24} name="filter" />
                    </TouchableOpacity>
                </View>

            )
        });
    }, []);



    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        list: null,
        load: true,
        searchMode: false,
        searchText: '',
        filterType: 991
    });

    const { searchText, searchMode, filterType } = state;

    useLayoutEffect(() => {
        if (!searchMode) return;

        const blur = () => {

            setState((prevState) => ({
                ...prevState,
                load: true,
                list: [],
            }));

            const fetchData = () => {
                const listener = pesquisarProduto(String(searchText).toLowerCase(), list => {

                    setState((prevState) => ({
                        ...prevState,
                        list: list,
                        load: false
                    }));
                });

                return listener;
            };

            return fetchData();

        };

        navigation.setOptions({
            header: () => (
                <Searchbar
                    style={styles.toolbar}
                    onIconPress={() => navigation.goBack()}
                    icon="arrow-left"
                    mode='bar'
                    autoFocus
                    elevation={5}
                    placeholder="Pesquisar por palavre chave"
                    onChangeText={text => setState((prevState) => ({
                        ...prevState,
                        searchText: text
                    }))}
                    defaultValue={searchText}
                    onBlur={blur}
                />
            )
        });

    }, [navigation, state]);

    const snapPoints = useMemo(() => ['80%'], []);

    const handlePresentModalPress = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            searchMode: true
        }));
    }, []);

    const clickFilter = useCallback(() => {

        if (bottomSheetModalRef.current !== undefined) {
            bottomSheetModalRef.current.expand();
        }

    }, []);


    const handlerFilterChanges = useCallback((type) => {

        if (bottomSheetModalRef.current !== undefined) {
            bottomSheetModalRef.current.close();
        }

        setState((prevState) => ({
            ...prevState,
            filterType: type
        }));
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    const openEditor = (item) => {
        navigation.navigate('Editor de Produto', { produto: item });
    };



    useEffect(() => {

        setState((prevState) => ({
            ...prevState,
            load: true,
        }));

        const fetchData = () => {
            const listener = listarProdutos(filterType, list => {
                console.log('Listener Produto', list.length);
                setState((prevState) => ({
                    ...prevState,
                    list: list,
                    load: false,
                    searchMode: false,
                    searchText: ''
                }));
            });

            return listener;
        };

        return fetchData();


    }, [filterType]);

    return (
        <PaperProvider>


            <BottomSheetModalProvider>
                <View style={styles.container}>

                    <Content
                        click={openEditor}
                        setState={setState}
                        state={state} />

                    <FAB
                        icon="plus"
                        label='NOVO PRODUTO'
                        color='#fff'
                        style={styles.fab}
                        onPress={() => navigation.navigate('Editor de Produto')}
                    />

                    <BottomSheetProdutos
                        refs={bottomSheetModalRef}
                        index={index}
                        points={snapPoints}
                        filter={handlerFilterChanges}
                        callback={handleSheetChanges} />



                </View>
            </BottomSheetModalProvider>

        </PaperProvider>

    );
}