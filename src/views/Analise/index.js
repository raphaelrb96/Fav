import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, LogBox } from 'react-native';
import { List, FAB, Portal, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colorCinza, colorPrimary } from '../../constantes/cores';
import Pb from '../../components/Pb';
import ItemAnaliseUsuario from '../../components/ItemAnaliseUsuario';
import HeaderAnalise from '../../components/HeaderAnalise';


const theme = {
    ...DefaultTheme,
    color: {
        primary: colorPrimary,

    }
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: colorPrimary
    }
});

function getFormaPagamento(n) {
    switch (n) {
        case 4:
            return 'Dinheiro';
        case 5:
            return 'Pix';
        case 3:
            return 'Crédito Parcelado';
        case 1:
            return 'Cartão Débito';
        case 2:
            return 'Crédito Avista';
        default:
            return 'Cartão';
    }
};

function getStatus(s) {
    switch (s) {
        case 1:
            return 'Aguardando Confirmação';
        case 2:
            return 'Confirmada';
        case 3:
            return 'Cancelada';
        case 4:
            return 'Saiu para entrega';
        case 5:
            return 'Concluida';
    }
}

async function getRevendas(filtro, listener) {


    let refRevendas = firestore()
        .collection('Revendas')
        .where('hora', '>=', filtro.getTime())
        .orderBy("hora", "desc");



    await refRevendas.get().then(querySnapshot => {

        let listVendedores = Array();
        let listaDeProdutos = [];

        
        let numVendas = 0;
        let comissoes = 0;
        let itens = 0;

        let faturamento = 0;
        let totalConcluido = 0;
        let totalPendente = 0;
        let totalCancelada = 0;

        let totalDinheiro = 0;
        let totalDinheiroConcluido = 0;
        let totalDinheiroPendente = 0;

        let totalCartao = 0;
        let totalCartaoConcluido = 0;
        let totalCartaoPendente = 0;

        let totalPix = 0;
        let totalPixConcluido = 0;
        let totalPixPendente = 0;

        let totalParcelado = 0;

        let listDinheiro = [];
        let listPix = [];
        let listCartao = [];
        let listParcelado = [];

        querySnapshot.forEach(documentSnapshot => {
            let obj = documentSnapshot.data();

            //dados da venda no banco de dados
            let uidVendedor = obj.uidUserRevendedor;
            let nomeVendedor = obj.userNomeRevendedor;
            let uidAdm = obj.uidAdm;
            let totalPedido = obj.valorTotal;
            let comissaoDaVenda = obj.comissaoTotal;
            let existeAdm = obj.existeComissaoAfiliados;
            let statusPedido = obj.statusCompra;
            let prods = obj.listaDeProdutos;
            let { formaDePagar } = obj;

            //variaveis da funcao
            let vendedorNaLista = false;
            let admNaLista = false;

            if (statusPedido !== 3) {

                //nao vamos analisar vendas canceladas

                //calcular faturamento
                faturamento = faturamento + totalPedido;
                if(statusPedido === 5) {
                    totalConcluido = totalConcluido + totalPedido;
                } else {
                    totalPendente = totalPendente + totalPedido;
                }

                //calcular vendas
                numVendas++;

                //calcular comissoes
                if (existeAdm) {
                    comissoes = comissoes + 5;
                }
                comissoes = comissoes + comissaoDaVenda;

                //calcular itens
                let quantidade = 0;
                for (let i = 0; i < prods.length; i++) {
                    //prodRev
                    const element = prods[i];
                    quantidade = quantidade + element.quantidade;

                    let topPrd = {
                        produtoName: element.produtoName,
                        caminhoImg: element.caminhoImg,
                        idProdut: element.idProdut,
                        quantidade: element.quantidade
                    };

                    if (listaDeProdutos.length > 0) {
                        let produtoJaExiste = false;
                        for (let x = 0; x < listaDeProdutos.length; x++) {
                            const itemListContagem = listaDeProdutos[x];
                            if (element.idProdut === itemListContagem.idProdut) {
                                produtoJaExiste = true;
                                let newTopPrd = {
                                    produtoName: itemListContagem.produtoName,
                                    caminhoImg: itemListContagem.caminhoImg,
                                    idProdut: itemListContagem.idProdut,
                                    quantidade: itemListContagem.quantidade + element.quantidade
                                };

                                listaDeProdutos[x] = newTopPrd;

                                break;
                            }
                        }
                        if (!produtoJaExiste) {
                            listaDeProdutos.push(topPrd);
                        }
                    } else {
                        listaDeProdutos.push(topPrd);
                    }
                }
                itens = itens + quantidade;



                //coletando dados sobre vendedores

                //verificar se o vendedor ja ta na lista
                for (let i = 0; i < listVendedores.length; i++) {
                    const element = listVendedores[i];

                    if (element.uid === uidVendedor) {

                        vendedorNaLista = true;

                        listVendedores[i] = {
                            nome: nomeVendedor,
                            uid: element.uid,
                            numVendas: element.numVendas + 1,
                            totalFaturado: element.totalFaturado + totalPedido,
                            totalComissaoVendas: element.totalComissaoVendas + comissaoDaVenda,
                            numVendasAfiliados: element.numVendasAfiliados,
                            totalFaturadoAfiliados: element.totalFaturadoAfiliados,
                            totalComissaoPorAfiliados: element.totalComissaoPorAfiliados
                        };

                        break;

                    }

                }
                if (!vendedorNaLista) {

                    let novoObj = {
                        nome: nomeVendedor,
                        uid: uidVendedor,
                        numVendas: 1,
                        totalFaturado: totalPedido,
                        totalComissaoVendas: comissaoDaVenda,
                        numVendasAfiliados: 0,
                        totalFaturadoAfiliados: 0,
                        totalComissaoPorAfiliados: 0
                    };

                    listVendedores.push(novoObj);

                }

                //verificar se o adm ja ta na lista
                for (let index = 0; index < listVendedores.length; index++) {
                    const element = listVendedores[index];

                    if (element.uid === uidAdm) {

                        admNaLista = true;

                        listVendedores[index] = {
                            nome: element.nome,
                            uid: element.uid,
                            numVendas: element.numVendas,
                            totalFaturado: element.totalFaturado,
                            totalComissaoVendas: element.totalComissaoVendas,
                            numVendasAfiliados: element.numVendasAfiliados + 1,
                            totalFaturadoAfiliados: element.totalFaturadoAfiliados + totalPedido,
                            totalComissaoPorAfiliados: element.totalComissaoPorAfiliados + 5
                        };

                        break;
                    }

                }
                if (!admNaLista) {
                    let novoObj = {
                        nome: '',
                        uid: uidAdm,
                        numVendas: 0,
                        totalFaturado: 0,
                        totalComissaoVendas: 0,
                        numVendasAfiliados: 1,
                        totalFaturadoAfiliados: totalPedido,
                        totalComissaoPorAfiliados: 5
                    };

                    listVendedores.push(novoObj);
                }


                //classificar formas de pagamento
                switch (formaDePagar ? formaDePagar : 0) {
                    case 1:
                        totalCartao = totalCartao + totalPedido;
                        if(statusPedido === 5) {
                            totalCartaoConcluido = totalCartaoConcluido + totalPedido;
                        } else {
                            totalCartaoPendente = totalCartaoPendente + totalPedido;
                        } 
                        break;
                    case 2:
                        totalCartao = totalCartao + totalPedido;
                        if(statusPedido === 5) {
                            totalCartaoConcluido = totalCartaoConcluido + totalPedido;
                        } else {
                            totalCartaoPendente = totalCartaoPendente + totalPedido;
                        } 
                        break;
                    case 3:
                        totalCartao = totalCartao + totalPedido;
                        if(statusPedido === 5) {
                            totalCartaoConcluido = totalCartaoConcluido + totalPedido;
                        } else {
                            totalCartaoPendente = totalCartaoPendente + totalPedido;
                        } 
                        break;
                    case 4:
                        totalDinheiro = totalDinheiro + totalPedido;
                        if(statusPedido === 5) {
                            totalDinheiroConcluido = totalDinheiroConcluido + totalPedido;
                        } else {
                            totalDinheiroPendente = totalDinheiroPendente + totalPedido;
                        } 
                        break;
                    case 5:
                        totalPix = totalPix + totalPedido;
                        if(statusPedido === 5) {
                            totalPixConcluido = totalPixConcluido + totalPedido;
                        } else {
                            totalPixPendente = totalPixPendente + totalPedido;
                        } 
                        break;
                    default:
                        break;
                }


            } else {
                totalCancelada = totalCancelada + totalPedido;
            }

            //console.log(obj);
        });

        //contar Vendedores

        let numVendedores = 0;

        for (let i = 0; i < listVendedores.length; i++) {
            const item = listVendedores[i];
            if (item.nome !== '') {
                numVendedores++;
            }

        }
        listVendedores.sort((a, b) => b.numVendas - a.numVendas);
        listaDeProdutos.sort((a, b) => b.quantidade - a.quantidade);

        //contar vendedores

        let objResumo = {
            total: faturamento,
            totalConcluido,
            totalCancelada,
            totalPendente,
            vendas: numVendas,
            ticket: (faturamento / numVendas),
            comissoes: comissoes,
            itens: itens,
            ativos: numVendedores,
            produtos: listaDeProdutos,
            dinheiro: totalDinheiro,
            dinheiroConcluido: totalDinheiroConcluido,
            dinheiroPendente: totalDinheiroPendente,
            pix: totalPix,
            pixConcluido: totalPixConcluido,
            pixPendente: totalPixPendente,
            cartao: totalCartao,
            cartaoConcluido: totalCartaoConcluido,
            cartaoPendente: totalCartaoPendente
        };

        return listener(listVendedores, objResumo);

    }).catch(error => {
        return null;
    });

}

export default function Analise({ navigation }) {

    const [list, setList] = useState(new Array());
    const [pb, setPb] = useState(true);
    const [resumo, setResumo] = useState(null);

    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    const [filtro, setFiltro] = useState(d);

    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }) => setState({ open });

    const changeFiltro = (tipo) => {
        let d = new Date();
        switch (tipo) {
            case 1:
                // 24h
                d = new Date();
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d.setMilliseconds(0);
                setFiltro(d);
                break;
            case 2:
                // 48h
                d = new Date();
                d.setHours(d.getHours() - 48);
                setFiltro(d);
                break;
            case 3:
                // 1semana
                d = new Date();
                d.setHours(d.getHours() - 168);
                setFiltro(d);
                break;
            case 4:
                // 1mes
                d = new Date();
                d.setHours(d.getHours() - 730);
                setFiltro(d);
                break;
        }
    };

    const clickItem = (item) => {
        navigation.navigate('Relatórios', { produto: item });
    };

    const { open } = state;

    useEffect(() => {
        setPb(true);
        console.log('get revendas');
        console.log(filtro);
        getRevendas(filtro, (lista, obj) => {

            lista.sort((a, b) => a.numVendas - b.numVendas);
            lista.reverse();
            setList(lista);
            setResumo(obj);
            setPb(false);
        });

    }, [filtro]);

    if (pb) {
        return <Pb />;
    }

    LogBox.ignoreLogs([' EventEmitter.removeListener', 'Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.']);

    return (
        <PaperProvider>
            <Portal>
                <FlatList
                    keyExtractor={item => item.uid}
                    data={list}
                    ListHeaderComponent={() =>
                        <HeaderAnalise
                            resumo={resumo}
                            ativos={resumo.ativos}
                            itens={resumo.itens}
                            comissoes={resumo.comissoes}
                            ticket={resumo.ticket}
                            vendas={resumo.vendas}
                            total={resumo.total}
                            totalConcluido={resumo.totalConcluido}
                            totalCancelada={resumo.totalCancelada}
                            totalPendente={resumo.totalPendente}
                            produtos={resumo.produtos}
                            pix={resumo.pix}
                            pixConcluido={resumo.pixConcluido}
                            pixPendente={resumo.pixPendente}
                            dinheiro={resumo.dinheiro}
                            dinheiroPendente={resumo.dinheiroPendente}
                            dinheiroConcluido={resumo.dinheiroConcluido}
                            cartao={resumo.cartao}
                            cartaoConcluido={resumo.cartaoConcluido}
                            cartaoPendente={resumo.cartaoPendente}
                            click={clickItem} />
                    }
                    renderItem={({ item }) => (item.nome === '') ? null : <ItemAnaliseUsuario dados={item} />}
                />
                <FAB.Group
                    theme={theme}
                    fabStyle={styles.fab}
                    open={open}
                    icon={'filter'}
                    actions={[
                        {
                            icon: 'calendar-month',
                            label: '1 mês',
                            onPress: () => changeFiltro(4),
                        },
                        {
                            icon: 'calendar-week',
                            label: '1 semana',
                            onPress: () => changeFiltro(3),
                        },
                        {
                            icon: 'calendar-today',
                            label: '48 horas',
                            onPress: () => changeFiltro(2),
                        },
                        {
                            icon: 'calendar-clock',
                            label: 'Hoje',
                            onPress: () => changeFiltro(1),
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>
        </PaperProvider>
    );
}