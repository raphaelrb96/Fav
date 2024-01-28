import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ItemProdutoCentral from '../../components/ItemProdutoCentral';


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
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
    }
});

const listarProdutos = async (listener) => {


    let ref = firestore()
        .collection('produtos')
        .orderBy("timeUpdate", "desc")
        .limit(200);



    const unsubscribe = await ref.onSnapshot(snap => {

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

    }).catch(error => {
        listener(null);
    });

    return unsubscribe;

};

function Content({ state, click }) {

    const { list, load } = state;

    if (load) return <Pb />;

    return (
        <View style={styles.content}>
            <FlatList
                renderItem={({ item }) => <ItemProdutoCentral click={click} produto={item} />}
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
                <Text>Awesome 🎉</Text>
            </View>
        </BottomSheet>
    );
};

export default function ProdutosCentral({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handlePresentModalPress}>
                    <Icon style={{ marginRight: 16 }} color={'#FFF'} size={24} name="plus" />
                </TouchableOpacity>
            )
        });
    }, []);

    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        list: null,
        load: true
    });



    const snapPoints = useMemo(() => ['80%'], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    const openEditor = (item) => {
        navigation.navigate('Editor de Produto', { produto: item });
    };

    useEffect(async () => {

        const listener = await listarProdutos(list => {
            setState({
                list: list,
                load: false
            })
        });

        return listener;
    }, []);

    return (
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
    );
}