import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ProdutoDetalheEditor from '../../components/ProdutoDetalheEditor';


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


function Content({ state, setState }) {

    const { produto, load } = state;

    if (load) return <Pb />;

    return (
        <ProdutoDetalheEditor
            setState={setState}
            state={state} />
    );
}

function BottomSheetProdutoEditor({ refs, index, points, callback }) {

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

export default function ProdutoEditor({ navigation, route }) {


    const bottomSheetModalRef = useRef();
    const snapPoints = useMemo(() => ['80%'], []);
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        produto: route.params,
        load: false
    });


    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);


    return (
        <BottomSheetModalProvider>
            <GestureHandlerRootView style={styles.container}>

                <Content
                    setState={setState}
                    state={state} />

                <BottomSheetProdutoEditor
                    refs={bottomSheetModalRef}
                    index={index}
                    points={snapPoints}
                    callback={handleSheetChanges} />

            </GestureHandlerRootView>
        </BottomSheetModalProvider>
    );
}