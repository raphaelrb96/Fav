import React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, DefaultTheme, TextInput, Title } from 'react-native-paper';
import ListItem from '../../components/ListItem';
import { colorCinza, colorSecondaryLight } from '../../constantes/cores';
import firestore from '@react-native-firebase/firestore';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 10,
        marginRight: 10
    },
    spacing:{
        height: 40
    },
    inputRow: {
        marginRight: 10,
        marginLeft: 10,
        marginTop: 16,
        marginBottom: 8,
    },
    flex: {
        flex:1,

    },
    bt:{
        margin: 30
    }
});

const theme = {
    ...DefaultTheme,
    colors: {
      primary: colorCinza,
      accent: colorCinza,
      background: colorSecondaryLight
    }
  };

function Lista({show, cancelar}) {
 return (
   <ScrollView>
       <Title style={styles.title}>
            Qual motivo do cancelamento ?
       </Title>
       <ListItem 
            nome={'Produto Esgotado'}
            texto={'Produto está em falta no estoque e indisponivel no fornecedor'}
            icone={'numeric-1-circle-outline'}
            click={() => cancelar(1, '')}
       />
       <ListItem 
            nome={'Produto em Falta'}
            texto={'Produto está em falta no estoque e não conseguimos pegar no fornecedor'}
            icone={'numeric-2-circle-outline'}
            click={() => cancelar(2, '')}

       />
       <ListItem 
            nome={'Atraso por Falta'}
            texto={'Produto era falta no estoque e não chegou no tempo que o cliente desejava'}
            click={() => cancelar(3, '')}
            icone={'numeric-3-circle-outline'}
       />
       <ListItem 
            nome={'Desistiu por Atraso'}
            texto={'O cliente desistiu por causa de um longo tempo de entrega'}
            click={() => cancelar(4, '')}
            icone={'numeric-4-circle-outline'}
       />
       <ListItem 
            nome={'Prazo muito Curto'}
            texto={'O cliente desistiu por exigir que a entrega fosse imediata'}
            click={() => cancelar(5, '')}
            icone={'numeric-5-circle-outline'}
       />
       <ListItem 
            nome={'Desistiu na Entrega'}
            texto={'O cliente desistiu na hora da entrega por nao está de acordo com as caracteristicas do produto'}
            click={() => cancelar(6, '')}
            icone={'numeric-6-circle-outline'}
       />
       <ListItem 
            nome={'Informações Erradas'}
            texto={'Venda cadastrada com informações ou quantidade erradas'}
            click={() => cancelar(7, '')}
            icone={'numeric-7-circle-outline'}
       />
       <ListItem 
            nome={'Sem Resposta'}
            texto={'Cliente não respondeu, ou não atendeu o suporte'}
            click={() => cancelar(8, '')}
            icone={'numeric-8-circle-outline'}
       />
       <ListItem 
            nome={'Cancelamento Antecipado'}
            texto={'Cliente desistiu da compra antes do pedido sair da loja'}
            click={() => cancelar(9, '')}
            icone={'numeric-9-circle-outline'}
       />
       <ListItem 
            nome={'Outro Motivo'}
            texto={''}
            icone={'circle-double'}
            click={() => show()}
       />
       <View 
            style={styles.spacing}
       />
   </ScrollView>
  );
}

function Input({cancelar}) {
    const [motivo, setMotivo] = useState('');
 return (
   <View>
       <Title style={styles.title}>
            Insira o motivo do cancelamento
       </Title>
       <TextInput 
            theme={theme} 
            defaultValue={motivo} 
            onChangeText={(value) => {
                setMotivo(value);
            }}
            label="Detalhes do Cancelamento" 
            mode="outlined" 
            style={styles.inputRow} 
        />

        <Button style={styles.bt} onPress={() => cancelar(-1, motivo)} theme={theme} mode="contained" ><Text>Concluir Cancelamento</Text></Button>
   </View>
  );
}

export default function Cancelamento({route, navigation}) {

    const { item } = route.params;
    const [visible, setVisible] = useState(false);


    function updateVendaCancelamento(id, motivo, callback) {

        const state = 3;


        const batch = firestore().batch();
    
        let rev1 = firestore().collection('Revendas').doc(item.idCompra);
        let rev2 = firestore().collection('MinhasRevendas').doc('Usuario').collection(item.uidUserRevendedor).doc(item.idCompra);
    
        batch.update(rev1, 'statusCompra', state);
        batch.update(rev2, 'statusCompra', state);

        batch.update(rev1, 'idCancelamento', id);
        batch.update(rev2, 'idCancelamento', id);

        batch.update(rev1, 'detalheCancelamento', motivo);
        batch.update(rev2, 'detalheCancelamento', motivo);
    
        if(item.existeComissaoAfiliados) {
            let afl1 = firestore().collection('ComissoesAfiliados').doc(item.idCompra);
            let afl2 = firestore().collection('MinhasComissoesAfiliados').doc('Usuario').collection(item.uidAdm).doc(item.idCompra);
            batch.update(afl1, 'statusComissao', state);
            batch.update(afl2, 'statusComissao', state);
        }
    
        batch.commit().then(() => {
            return callback(true);
        }).catch(error => {
            return callback(false);
        });

        navigation.goBack();
    
    }

    if(visible) {
        return <Input cancelar={updateVendaCancelamento} />;
    }

    return (
        <Lista cancelar={updateVendaCancelamento} show={() => setVisible(true)} />
    );
}