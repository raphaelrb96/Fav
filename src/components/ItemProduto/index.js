import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import { colorCinza, colorSecondaryDark } from '../../constantes/cores';

const styles = StyleSheet.create({
    
    grid:{
        flex: 1
    },
    footer: {
        height: 100
    },
    btItem:{
        margin: 0,
        padding: 0,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    labelBtItem: {
        fontSize: 12,
        color: colorCinza,
        padding: 0,
        margin: 0,
    },
    labelPrecoItem: {
        fontSize: 10,
        padding: 0,
        margin: 0
    },
    containerItem: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 10,
        flex: 1,
        width: 110
    },
});

export default function ItemProduto({path, nome, id, navigation, editor, produto, noClick, click}) {


    return (
        <TouchableWithoutFeedback activeOpacity={0.8} onPress={click} style={styles.containerItem}>
                <View>
                    <Card.Cover style={{height: 120, borderRadius: 6}} source={{ uri: path }} />
                    <View style={styles.btItem}>
                        <Text numberOfLines={2} style={styles.labelBtItem}>{String(nome).toUpperCase()}</Text>
                    </View>

                </View>
        </TouchableWithoutFeedback>
    );
}