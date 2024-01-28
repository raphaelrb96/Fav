import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, DefaultTheme, Headline, List, Subheading } from 'react-native-paper';
import { colorCinza, colorPrimary } from '../../Cores';
import { getFormaPagamento, getStatusCompra } from '../../Objects/Compra';
import { cancelar, concluir, confirmar, liberar } from '../../services/GerenciadorServices';


let theme = {
    ...DefaultTheme,
    colors: {
        primary: '#fff',
        
    }
}

const styles = StyleSheet.create({
    subheader: {
        marginLeft: 8,
        marginRight: 20,
        marginTop: 16,
        marginBottom: 16,
        fontSize: 16,
        fontWeight: 'bold'
    },
    dados: {
        margin: 0,
        padding: 0
    },
    footer: {
        height: 20
    },
    icone: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginTop: 14
    },
    bt: {
        fontSize: 30
    },
    botao: {
        margin: 8,
    },
    card: {
        marginRight: 16,
        marginLeft: 16,
        marginBottom: 6,
        marginTop: 16,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8
    },
    img: {
        height: 60,
        width: 60,
        margin: 0,
        borderRadius: 4
    },
    itemProdutoVenda: {
        marginTop: 8
    },
    containerBts: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    let hora = date.getHours();
    let min = date.getMinutes();
    if (String(d).toString().length === 1) {
        d = `0${d}`;
    }
    if(String(m).toString().length === 1) {
        m = `0${m}`;
    }
    
    if(String(hora).toString().length === 1) {
        hora = `0${hora}`;
    }
    if(String(min).toString().length === 1) {
        min = `0${min}`;
    }
    return `As ${hora}:${min} do dia ${d}/${m}/${y}`;
}

function MiniFicha() {

}

function ItemProdutoVenda({title, description, path}) {
    return (
            <List.Item
                title={title}
                style={styles.itemProdutoVenda}
                titleNumberOfLines={1}
                description={description}
                left={props => <Image style={styles.img} source={{uri: path}} />}
            />
    );
}

function isPay(pago, status) {
    if(status === 5) {
        if(pago) {
            return 'PAGAMENTO CONCLUIDO';
        } else {
            return 'COMISSÃO A RECEBER';
        }
    }

    if(status === 3) {
        return 'CANCELADO'
    }

    return 'COMISSÃO A RECEBER';
    
}

function FichaPadrao({item}) {

    let {itensCompra, hora, nomeVendedor, endereco, contatoCliente, nomeCliente, total} = item;
    let hoje = new Date().toLocaleDateString();
    let varDate = new Date(hora);
    let dataVenda = varDate.toLocaleDateString();
    let data = `Hoje as ${new Date(hora).toLocaleTimeString()}`;

    if(dataVenda !== hoje) {
        //data = `${varDate.getUTCDate()}/${varDate.getMonth()}/${varDate.getFullYear()}`;
        data = dateToYMD(varDate);
    }

    return(
        <Card style={styles.card}>
            <List.Section>
                <Subheading style={styles.subheader}>{`R$ ${parseFloat(item.comissao).toFixed(2)} ${isPay(item.comissaoPaga, item.status)}`}</Subheading>
                
                <List.Item style={styles.dados} title={data}  description={`${getStatusCompra(item.status)}`} />
                <List.Item style={styles.dados} title={item.nomeCliente} description={item.contatoCliente} />
                <List.Item style={styles.dados} title={item.endereco.bairro} description={`${item.endereco.rua} - N°${item.endereco.numero}`} />
                <List.Item style={styles.dados} title={`R$ ${parseFloat(item.total).toFixed(2)}`} description={`Pagamento no ${getFormaPagamento(item.formaDePagar)}`} />

                {item.itensCompra.map(obj => <ItemProdutoVenda title={obj.nome} description={`R$ ${parseFloat(obj.valor).toFixed(2)}`} path={obj.fotoPrincipal} />)}
            </List.Section>
        </Card>
    );
}

function FichaCliente({item}) {

    let {itensCompra, hora, nomeVendedor, endereco, contatoCliente, nomeCliente, total} = item;
    let hoje = new Date().toLocaleDateString();
    let varDate = new Date(hora);
    let dataVenda = varDate.toLocaleDateString();
    let data = `Hoje as ${new Date(hora).toLocaleTimeString()}`;

    if(dataVenda !== hoje) {
        //data = `${varDate.getUTCDate()}/${varDate.getMonth()}/${varDate.getFullYear()}`;
        data = dateToYMD(varDate);
    }
    return(
        <Card style={styles.card}>
            <List.Section>
                
                <List.Item style={styles.dados} title={<Subheading style={styles.subheader}>{`${data}`}</Subheading>}  description={`${getStatusCompra(item.status)}`} />
                <List.Item style={styles.dados} title={item.nomeCliente} description={item.contatoCliente} />
                <List.Item style={styles.dados} title={item.endereco.bairro} description={`${item.endereco.rua} - N°${item.endereco.numero}`} />
                <List.Item style={styles.dados} title={`R$ ${parseFloat(item.total).toFixed(2)}`} description={`Pagamento no ${getFormaPagamento(item.formaDePagar)}`} />

                {item.itensCompra.map(obj => <ItemProdutoVenda title={obj.nome} description={`R$ ${parseFloat(obj.valor).toFixed(2)}`} path={obj.fotoPrincipal} />)}
            </List.Section>
        </Card>
    );
}

function FichaAdm({item}) {

    let {itensCompra, hora, nomeVendedor, endereco, contatoCliente, nomeCliente, total} = item;

    let {bairro, rua, numero} = endereco;

    let hoje = new Date().toLocaleDateString();
    let varDate = new Date(hora);
    let dataVenda = varDate.toLocaleDateString();
    let data = `Hoje as ${new Date(hora).toLocaleTimeString()}`;

    if(dataVenda !== hoje) {
        //data = `${varDate.getUTCDate()}/${varDate.getMonth()}/${varDate.getFullYear()}`;
        data = dateToYMD(varDate);
    }

    
    return(
        <Card style={styles.card}>
            <List.Section>
                <Subheading style={styles.subheader}>{`${data} \n${getStatusCompra(item.status)}`}</Subheading>
                <List.Item style={styles.dados} title={item.nomeCliente} description={item.contatoCliente} />
                <List.Item style={styles.dados} title={item.endereco.bairro} description={`${item.endereco.rua} - N°${item.endereco.numero}`} />
                <List.Item style={styles.dados} title={`R$ ${parseFloat(item.total).toFixed(2)}`} description={`Pagamento no ${getFormaPagamento(item.formaDePagar)}`} />

                {item.itensCompra.map(obj => <ItemProdutoVenda key={obj.idItem} title={obj.nome} description={`R$ ${parseFloat(obj.valor).toFixed(2)}`} path={obj.fotoPrincipal} />)}
            </List.Section>

            <Card.Actions style={styles.containerBts}>
                <Button mode="contained" onPress={() => confirmar(item)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="alert-circle-check"/>
                <Button mode="contained" onPress={() => liberar(item)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="rocket-launch"/>
                <Button mode="contained" onPress={() => cancelar(item)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="close-box"/>
                <Button mode="contained" onPress={() => concluir(item)} theme={theme} style={styles.botao} labelStyle={styles.bt} icon="shield-check"/>
            </Card.Actions>
        </Card>
    );
}

export default function Ficha({adm, item, cliente}) {
    if(adm) {
        return <FichaAdm item={item} />
    }

    if(cliente) {
        return <FichaCliente item={item} />;
    }

    return (
        <FichaPadrao item={item} />
    );
}