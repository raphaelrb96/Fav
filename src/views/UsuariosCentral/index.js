
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Pb from '../../components/Pb';
import ItemUsuario from '../../components/ItemUsuario';
import { Subheading } from 'react-native-paper';


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
    spacing: {
        marginTop: 0
    },
});

const listarUsuarios = (userRecrutador, listener) => {


    const ref = firestore().collection('Usuario').orderBy("primeiroLogin", "desc").limit(400);
    const refFinal = userRecrutador ? firestore().collection('Usuario').where('uidAdm', '==', userRecrutador?.uid).limit(400) : ref;

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


        lista.sort((a, b) => b.primeiroLogin - a.primeiroLogin);

        listener(lista);

    };

    const onError = error => {
        listener(null);
    };

    const unsubscribe = refFinal.onSnapshot(onNext, onError);

    return unsubscribe;

};

export default function UsuariosCentral({ navigation, route }) {

    const usuario = route.params?.usuario;

    useLayoutEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Procurar Usuario')}>
                    <Icon style={{ marginRight: 16 }} color={'#000'} size={24} name="magnify" />
                </TouchableOpacity>
            )
        });
        
    }, []);

    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);

    const [state, setState] = useState({
        usuarios: null,
        load: true,
    });

    const snapPoints = useMemo(() => ['80%'], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.expand();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    const click = useCallback((item) => {

        navigation.navigate('Detalhes do Usuario', { usuario: item });
        
    }, []);

    useEffect(() => {

        setState((prevState) => ({
            ...prevState,
            load: true,

        }));

        const fetchData = () => {
            const listener = listarUsuarios(usuario, list => {
                //console.log('Listener Produto', list.length);
                setState((prevState) => ({
                    ...prevState,
                    load: false,
                    usuarios: list
                }));
            });

            return listener;
        };

        return fetchData();


    }, []);

    if (state.load) {
        return <Pb />
    }

    function HeaderCentral() {

        if(!usuario) return <View style={styles.spacing} />

        return(
            <Subheading style={styles.spacing}>
                Afiliados de {usuario.nome}
            </Subheading>
        );
    }

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>

                <FlatList
                    renderItem={({ item, index }) => <ItemUsuario dados={item} click={() => click(item)} />}
                    ListHeaderComponent={() => <HeaderCentral />}
                    data={state.usuarios} />

                <BottomSheet
                    ref={bottomSheetModalRef}
                    index={index}
                    style={styles.bottomSheet}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}>
                    <View style={styles.contentContainer}>
                        <Text>Awesome 🎉</Text>
                    </View>
                </BottomSheet>
            </View>
        </BottomSheetModalProvider>
    );
}