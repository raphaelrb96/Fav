import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, LogBox, Alert } from 'react-native';
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ProdutoDetalheEditor from '../../components/ProdutoDetalheEditor';
import BottomSheetCategorias from '../../components/BottomSheetCategorias';
import { getNewProdutoDoc, getProdutoDoc, salvarProdutoFirestore } from '../../util/Produto';


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
});


function Content({ state, setState, salvar }) {

    const { produto, load } = state;


    if (load) return <Pb />;

    return (
        <ProdutoDetalheEditor
            salvar={salvar}
            setState={setState}
            state={state} />
    );
}

function BottomSheetProdutoEditor({ refs, index, points, callback, state, setState }) {

    const { modoGaveta } = state;

    const getContent = () => {
        switch (modoGaveta) {
            default:
                return <Pb />;
            case 1:
                return <BottomSheetCategorias setState={setState} />;
        }
    };


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

            {getContent()}

        </BottomSheet>
    );
};

export default function ProdutoEditor({ navigation, route }) {

    LogBox.ignoreAllLogs();


    const bottomSheetModalRef = useRef();
    const snapPoints = useMemo(() => ['90%'], []);
    const startProd = route.params.produto ? route.params.produto : getNewProdutoDoc();
    const [state, setState] = useState({
        produto: startProd,
        load: false,
        open: false,
        modoGaveta: 0,
        index: -1,
        loadSave: false
    });

    const { index } = state;

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.expand();
    }, [bottomSheetModalRef]);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setState((prevState) => ({
            ...prevState,
            open: !(index === -1),
            index: index
        }));
    }, []);

    useEffect(() => {
        if (bottomSheetModalRef) {
            if (state.open) {
                handlePresentModalPress();
            } else {
                bottomSheetModalRef.current?.close();
            }
        }


    }, [state.open]);



    const salvarProdutoDocument = async () => {

        setState((prevState) => ({
            ...prevState,
            loadSave: true
        }));

        const { sucess, error } = await salvarProdutoFirestore(state.produto);

        if (!sucess) {

            Alert.alert("Error ao Salvar", error.toString())
            setState((prevState) => ({
                ...prevState,
                loadSave: false
            }));
        } else {
            navigation.goBack();
        }

    };


    return (
        <BottomSheetModalProvider>
            <GestureHandlerRootView style={styles.container}>

                <Content
                    salvar={salvarProdutoDocument}
                    setState={setState}
                    state={state} />

                <BottomSheetProdutoEditor
                    refs={bottomSheetModalRef}
                    index={index}
                    points={snapPoints}
                    setState={setState}
                    state={state}
                    callback={handleSheetChanges} />

            </GestureHandlerRootView>
        </BottomSheetModalProvider>
    );
}