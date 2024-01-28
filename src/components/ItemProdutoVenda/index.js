import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, List, Paragraph, Text, Title } from 'react-native-paper';

const styles = StyleSheet.create({
    img: {
        height: 200,
        width: 200,
        marginLeft: 8,
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
        marginBottom: -6
    },
    content: {
        flex: 1
    }
});

export default function ItemProdutoVenda({ title, description, path, style, produto }) {
    const { modoPreco } = produto;
    return (
        <>

            <List.Item
                title={String(title).toUpperCase()}
                titleNumberOfLines={4}
                style={style}
                description={description}
            />
            <List.Item
                title={modoPreco ? modoPreco : 'Varejo'}
                titleNumberOfLines={4}
                style={style}
                description={'Modelo de Preço'}
            />
            <Image style={styles.img} source={{ uri: path }} />

        </>

    );
}