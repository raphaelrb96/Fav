import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetFlatList, TouchableOpacity } from '@gorhom/bottom-sheet';
import { CATEGORIA_LIST } from '../../util/Categorias';
import { useCallback } from 'react';
import { Text } from 'react-native-paper';
import { colorCinza } from '../../constantes/cores';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
    },
    contentContainer: {
        backgroundColor: "white",
    },
    itemContainer: {
        padding: 16,
        margin: 0,
        borderBottomColor: colorCinza,
        borderBottomWidth: 0.5
    },
});

export default function BottomSheetCategorias({ setState }) {

    const click = (v) => {

        setState((prevState) => ({
            ...prevState,
            produto: {
                ...prevState.produto,
                categorias: {
                    [v]: true
                }
            },
            open: false,
        }));
    };

    const renderItem = useCallback(
        ({ item, index }) => (
            <TouchableOpacity onPress={() => click(index)} style={styles.itemContainer}>
                <Text>{`${index}   -   ${item}`}</Text>
            </TouchableOpacity>
        ),
        []
    );


    return (
        <BottomSheetFlatList
            data={CATEGORIA_LIST}
            keyExtractor={(item, i) => i}
            renderItem={renderItem}
            ListHeaderComponent={() => <View style={styles.itemContainer} />}
            contentContainerStyle={styles.contentContainer}
        />
    );
}