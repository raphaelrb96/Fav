import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ItemSolicitacaoAgendamento from '../../components/ItemSolicitacaoAgendamento';


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        display: 'flex',
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
    list: {
        flex: 1,
    }
});

const listarAgendamentoComissoes = (listener) => {


    let ref = firestore()
        .collection('Pagamentos')
        .orderBy("timestampCreated", "desc");



    const unsubscribe = ref.onSnapshot(snap => {

        if (!snap) {
            listener(null);
            return;

        }

        let lista = [];

        if (snap != null && snap.size > 0) {

            snap.forEach(doc => {
                const objItem = doc.data();
                const andamento = (objItem.status !== 3 && objItem.status !== 5);
                if (andamento) {
                    lista.push(objItem);
                }
            });

        }

        listener(lista);

    }, error => {
        listener(null);
    });

    return unsubscribe;

};

function Content({ state, navigation }) {

    const { agendamentos, load } = state;

    if (load) return <Pb />;

    const detalhes = (item) => {
        navigation.navigate('Detalhes Agendamento', { item: item });
    };


    return (
        <FlatList
            style={styles.list}
            data={agendamentos}
            renderItem={({ item }) => <ItemSolicitacaoAgendamento solicitacao={item} click={() => detalhes(item)} />}
        />
    );
}

function BottomSheetComissoes({ refs, index, points, callback }) {

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

export default function Comissoes({ navigation }) {


    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        agendamentos: null,
        load: true
    });



    const snapPoints = useMemo(() => ['80%'], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.expand();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    useEffect(() => {

        const fetchData = () => {
            const listener = listarAgendamentoComissoes(list => {
                setState({
                    agendamentos: list,
                    load: false
                })
            });

            return listener;
        };

        return fetchData();

    }, []);

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>

                <Content
                    navigation={navigation}
                    state={state} />

                <BottomSheetComissoes
                    refs={bottomSheetModalRef}
                    index={index}
                    points={snapPoints}
                    callback={handleSheetChanges} />

            </View>
        </BottomSheetModalProvider>
    );
}