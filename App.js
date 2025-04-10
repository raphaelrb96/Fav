import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  LogBox,
  ScrollView
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { Avatar } from 'react-native-paper';

import RankingDetalhe from './src/views/RankingDetalhe';
import Menu from './src/views/Menu';
import { colorPrimary, colorPrimaryDark, colorSecondaryLight } from './src/constantes/cores';
import Analise from './src/views/Analise';
import Vendas from './src/views/Vendas';
import SearchVendedor from './src/views/SearchVendedor';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NovaVendas from './src/views/NovaVendas';
import Conversa from './src/views/Conversa';
import Cancelamento from './src/views/Cancelamento';
import Relatorios from './src/views/Relatorios';
import Historico from './src/views/Historico';
import ProdutosCentral from './src/views/ProdutosCentral';
import Feeds from './src/views/Feeds';
import Comissoes from './src/views/Comissoes';
import UsuariosCentral from './src/views/UsuariosCentral';
import ProdutoEditor from './src/views/ProdutoEditor';
import { firebase } from '@react-native-firebase/auth';
import EditarPedido from './src/views/EditarPedido';
import DetalhesAgendamento from './src/views/DetalhesAgendamento';
import DetalhesUsuario from './src/views/DetalhesUsuario';
import SaldoUsuario from './src/views/SaldoUsuario';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  sectionContainer: {
    height: 56,
    width: '100%',
    elevation: 0.5,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',

  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 25
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  itemIcon: {
    marginLeft: 0
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colorPrimary,
    textAlign: 'center',
    marginTop: 6

  },
  img: {
    width: 180,
    height: 36
  },
  cardItem: {
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: colorPrimary,
    backgroundColor: colorSecondaryLight,
    borderRadius: 12,
    paddingVertical: 5
  },
  logo: {
    marginBottom: 20
  },
  btHeader: {
    fontSize: 30
  },
  spacing: {
    padding: 30
  }
});

function IconeMenu(props) {
  return (
    <Card elevation={2} style={styles.cardItem}>
      <TouchableOpacity style={styles.item} onPress={() => props.nav.navigate(props.screen)}>
        <Icon style={styles.itemIcon} color={colorPrimary} size={45} name={props.icone} />
        <Text style={styles.itemText}>{props.name}</Text>
      </TouchableOpacity>
    </Card>

  );
}

function MiniMenu({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container} >

        <Avatar.Image style={styles.logo} size={110} source={require('./src/img/logo.png')} />


        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Central de Produtos" screen="Produtos" icone="shopping" />
          <IconeMenu nav={navigation} name="Gerenciador de Telas" screen="Telas e Feeds" icone="gesture-tap-box" />
        </View>
        <View style={styles.spacing} />
      </View>
    </ScrollView>

  )
};

function MenuProdutos({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container} >

        <Avatar.Image style={styles.logo} size={110} source={require('./src/img/logo.png')} />


        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Central de Produtos" screen="Produtos" icone="shopping" />
          <IconeMenu nav={navigation} name="Gerenciador de Telas" screen="Telas e Feeds" icone="gesture-tap-box" />
        </View>
        <View style={styles.spacing} />
      </View>
    </ScrollView>

  )
};

function MenuVendas({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container} >

        <Avatar.Image style={styles.logo} size={110} source={require('./src/img/logo.png')} />


        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Pedidos e Vendas" screen="Vendas" icone="cash-register" />
        </View>
        <View style={styles.spacing} />
      </View>
    </ScrollView>

  )
};

function MenuMain({ navigation }) {


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container} >

        <Avatar.Image style={styles.logo} size={110} source={require('./src/img/logo.png')} />

        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Pedidos e Vendas" screen="Vendas" icone="cash-register" />
          <IconeMenu nav={navigation} name="Analise de Informações" screen="Analise" icone="google-analytics" />
        </View>
        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Histórico de Vendas" screen="Histórico" icone="podium" />
          <IconeMenu nav={navigation} name="Procurar Vendedores" screen="Procurar Usuario" icone="account-search" />
        </View>
        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Central de Usuario" screen="Usuarios" icone="account-box" />
          <IconeMenu nav={navigation} name="Pagamento de Comissões" screen="Pagamentos" icone="wallet" />
        </View>
        <View style={styles.row}>
          <IconeMenu nav={navigation} name="Central de Produtos" screen="Produtos" icone="shopping" />
          <IconeMenu nav={navigation} name="Gerenciador de Telas" screen="Telas e Feeds" icone="gesture-tap-box" />
        </View>
        <View style={styles.spacing} />
      </View>
    </ScrollView>

  )
};



let App = () => {


  useEffect(() => {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Signed in
      } else {
        firebase.auth().signInAnonymously();
      }
    });


  }, []);


  return (

    <NavigationContainer>
      <StatusBar backgroundColor={colorPrimaryDark} barStyle="light-content" />

      <Stack.Navigator screenOptions={{ headerStyle: { elevation: 12, shadowColor: 'black' } }}>

        <Stack.Screen
          name="Home"
          //ALTERAR LINHA 265 'setAcess' (DetalhesVenda)
          //QUANDO A VERSAO FOR DIFERENTE DE ADMIN
          component={MenuVendas}
          //component={MenuProdutos}
          //component={MenuMain}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="Menu"
          component={Menu}
        />

        <Stack.Screen
          name="Histórico"
          options={{

          }}
          component={Historico} />

        <Stack.Screen
          name="RankingDetalhe"
          component={RankingDetalhe}
        />

        <Stack.Screen
          name="Analise"
          component={Analise}
        />

        <Stack.Screen
          name="Vendas"
          component={NovaVendas}

        />

        <Stack.Screen
          name="Procurar Usuario"
          component={SearchVendedor}
        />

        <Stack.Screen
          name="Saldo do Usuario"
          component={SaldoUsuario}
        />

        <Stack.Screen
          name="Conversa"
          component={Conversa}
        />

        <Stack.Screen
          name="Cancelamento"
          component={Cancelamento}
        />

        <Stack.Screen
          name="Relatórios"
          component={Relatorios}
        />

        <Stack.Screen
          name="Usuarios"
          component={UsuariosCentral}
        />

        <Stack.Screen
          name="Detalhes do Usuario"
          component={DetalhesUsuario}
        />

        <Stack.Screen
          name="Pagamentos"
          component={Comissoes}
        />

        <Stack.Screen
          name="Detalhes Agendamento"
          component={DetalhesAgendamento}
        />

        <Stack.Screen
          name="Produtos"
          component={ProdutosCentral}
        />

        <Stack.Screen
          name="Editor de Produto"
          component={ProdutoEditor}
        />

        <Stack.Screen
          name="Telas e Feeds"
          component={Feeds}
        />

        <Stack.Screen
          name="Editar Pedido"
          component={EditarPedido}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}

export default App;
