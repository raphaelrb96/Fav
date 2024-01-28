import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { colorPrimaryDark, colorSecondaryDark, colorSecondaryLight } from '../../constantes/cores';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
        fontSize: 10,
        fontWeight: '500',
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
        width: 130,
        borderWidth: 1,
        borderColor: colorSecondaryDark,
        borderRadius: 6,
        padding: 6
    },
});

export default function ItemDinamicRelatorio({path, nome, value, id, click}) {


    return (
        <TouchableWithoutFeedback activeOpacity={0.8} onPress={click} style={styles.containerItem}>
                <View>
                    {path ? <Card.Cover style={{height: 120, borderRadius: 6}} source={{ uri: path }} /> : null}
                    
                    <View style={styles.btItem}>
                        <Text numberOfLines={1} style={styles.labelBtItem}>{nome}</Text>
                        <Text numberOfLines={1} style={styles.labelPrecoItem}>{value}</Text>
                    </View>

                </View>
        </TouchableWithoutFeedback>
    );
}