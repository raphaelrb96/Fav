import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';


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

export default function Tamplate({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handlePresentModalPress}>
                    <Icon style={{ marginRight: 16 }} color={'#000'} size={24} name="plus" />
                </TouchableOpacity>
            )
        });
    }, []);

    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(0);

    const snapPoints = useMemo(() => ['80%'], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.expand();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        setIndex(index);
    }, []);

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>

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