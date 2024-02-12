import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, List, Paragraph, Text, Title } from 'react-native-paper';

const styles = StyleSheet.create({
    img: {
        height: 140,
        width: 140,
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 12,
        borderRadius: 4
    },
    container: {
        marginTop: 20,
        padding: 0
    },
    text: {
        marginTop: 6,
        marginBottom: -6,
        marginRight: 16,
    },
    content: {
        flex: 1
    }
});

export default function ItemProdutoVenda({ title, description, path, style, produto }) {
    const { modoPreco } = produto;
    const stringModo = modoPreco ? modoPreco : 'Varejo';
    return (
        <>

            <List.Item
                left={() => <Image style={styles.img} source={{ uri: path }} />}
                style={style}
                title={() => (
                    <List.Item
                        title={String(title).toUpperCase()}
                        titleNumberOfLines={4}
                        style={style}
                        description={description + "\n" + stringModo}
                        descriptionNumberOfLines={4}
                    />
                )}
            />


        </>

    );
}