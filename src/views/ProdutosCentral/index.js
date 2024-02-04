import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ItemProdutoCentral from '../../components/ItemProdutoCentral';
import { FAB, PaperProvider, Searchbar } from 'react-native-paper';
import { colorPrimaryDark, colorSecondaryLight } from '../../constantes/cores';


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
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
});

const listarProdutos = (listener) => {


    const ref = firestore().collection('produtos').orderBy("timeUpdate", "desc").limit(50);

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

const switchDisponibilidade = (produto) => {
    const disp = !produto.disponivel;
    const referencedb = firestore().collection('produtos').doc(produto.idProduto);
    referencedb.update({disponivel: disp});
};

function Content({ state, click }) {

    const { list, load } = state;

    if (load) return <Pb />;

    return (
        <View style={styles.content}>
            <FlatList
                renderItem={({ item }) => <ItemProdutoCentral click={click} produto={item} switc={switchDisponibilidade} />}
                ListHeaderComponent={() => <View style={styles.spacing} />}
                data={list} />
        </View>

    );
}

function BottomSheetProdutos({ refs, index, points, callback }) {


    return (
        <BottomSheet
            ref={refs}
            index={index}
            style={styles.bottomSheet}
            enablePanDownToClose={true}
            snapPoints={points}
            onChange={callback}>
            <View style={styles.contentContainer}>

            </View>
        </BottomSheet>
    );
};

export default function ProdutosCentral({ navigation }) {

    //LogBox.ignoreAllLogs();


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handlePresentModalPress}>
                    <Icon style={{ marginRight: 16 }} color={'#000'} size={24} name="magnify" />
                </TouchableOpacity>
            )
        });
    }, []);



    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        list: null,
        load: true,
        searchMode: false,
        searchText: ''
    });

    const { searchText, searchMode } = state;

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

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    const openEditor = (item) => {
        navigation.navigate('Editor de Produto', { produto: item });
    };

    useEffect(() => {

        const fetchData = () => {
            const listener = listarProdutos(list => {

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


    }, []);

    return (
        <PaperProvider>
            <BottomSheetModalProvider>
                <View style={styles.container}>

                    <Content
                        click={openEditor}
                        state={state} />

                    <BottomSheetProdutos
                        refs={bottomSheetModalRef}
                        index={index}
                        points={snapPoints}
                        callback={handleSheetChanges} />



                </View>
            </BottomSheetModalProvider>
            <FAB
                icon="plus"
                label='NOVO PRODUTO'
                color='#fff'
                style={styles.fab}
                onPress={() => navigation.navigate('Editor de Produto')}
            />
        </PaperProvider>

    );
}