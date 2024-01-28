import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button, DefaultTheme, TextInput } from 'react-native-paper';
import { colorCinza, colorSecondaryLight } from '../../constantes/cores';

const theme = {
    ...DefaultTheme,
    colors: {
      primary: colorCinza,
      accent: colorCinza,
      background: colorSecondaryLight
    }
  };

const styles = StyleSheet.create({
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

  

export default function Conversa({route}) {

 const { prod, num, nom, pag } = route.params;
 const [strings, setStrings] = useState({
    nome: nom,
    numero: num,
    produto: prod,
    pagamento: pag
 });

 const getTextoWhats = () => {
    return `Olá, ${strings.nome}\n\nSou do setor de suporte ao cliente aqui da empresa Favorita\n\nO motivo do meu contato é confirmar a compra do Produto:\n${strings.produto}\n\nForma de Pagamento: ${strings.pagamento} \n\nO motoboy vai entrar em contato por whatsapp ou ligação quando estiver próximo a sua residência\n\nPrazo de entrega de 1 a 3 horas\nSe tiver alguma observação sobre o tempo de entrega pode me avisar agora pra eu dá prioridade ao seu pedido\n\nPAGAMENTO É FEITO NO MOMENTO DA ENTREGA`;
 };

 const abrirWhats = () => Linking.openURL(`https://api.whatsapp.com/send?phone=55${strings.numero}&text=${getTextoWhats()}`);

 return (
   <View style={styles.flex}>
        <TextInput 
            theme={theme} 
            defaultValue={strings.numero} 
            onChangeText={(value) => {
                setStrings((prevState) => ({
                    ...prevState,
                    numero: value,
                }));
            }}
            label="Número" 
            mode="outlined" 
            style={styles.inputRow} 
        />
       <TextInput 
            theme={theme} 
            defaultValue={strings.nome} 
            onChangeText={(value) => {
                setStrings((prevState) => ({
                    ...prevState,
                    nome: value,
                }));
            }}
            label="Nome" 
            mode="outlined" 
            style={styles.inputRow} 
        />
        <TextInput 
            theme={theme} 
            defaultValue={strings.produto} 
            onChangeText={(value) => {
                setStrings((prevState) => ({
                    ...prevState,
                    produto: value,
                }));
            }}
            label="Produto" 
            mode="outlined" 
            style={styles.inputRow} 
        />

        <TextInput 
            theme={theme} 
            defaultValue={strings.pagamento} 
            onChangeText={(value) => {
                setStrings((prevState) => ({
                    ...prevState,
                    pagamento: value,
                }));
            }}
            label="Pagamento" 
            mode="outlined" 
            style={styles.inputRow} 
        />

        <Button style={styles.bt} onPress={() => abrirWhats()} theme={theme} mode="contained" ><Text>Iniciar Conversa</Text></Button>
   </View>
  );
}