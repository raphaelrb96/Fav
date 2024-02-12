import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetSectionList } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ItemProdutoVendaEditor from '../../components/ItemProdutoVendaEditor';
import { Divider, Headline, List, TextInput, DefaultTheme, Button, FAB, Checkbox } from 'react-native-paper';
import { colorCinza, colorPrimary, colorSecondaryLight } from '../../constantes/cores';
import { findRealValor, getListaPrecificacao } from '../../util/Calculos';
import Pb from '../../components/Pb';
import { formartarValor } from '../../util/Formatar';
import { getListEntrega, getListPagamentos, getListParcelamento } from '../../util/Listas';
import { atualizarPedido } from '../../services/Pedido';


const theme = {
    ...DefaultTheme,
    colors: {
        primary: colorCinza,
        background: colorSecondaryLight,
        accent: colorCinza
    }
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    contentContainer: {
        flex: 1,
    },
    bottomSheet: {
        elevation: 18
    },
    subheader: {
        marginLeft: 8,
        marginRight: 20,
        marginTop: 0,
        marginBottom: 8
    },
    dados: {
        marginLeft: 0,
        paddingEnd: 1,
        marginEnd: 1,
        paddingLeft: 0,
        paddingBottom: 0,
        paddingTop: 0,
        width: '100%',
        display: 'flex',
    },
    dadosTitle: {
        width: '100%',
    },
    detalhe: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        flex: 1
    },
    spacing: {
        height: 20
    },
    divider: {
        height: 1.5
    },
    input: {
        marginRight: 16,
        marginLeft: 16,
        paddingBottom: 0,
        marginTop: 16,
        marginBottom: 26,
        maxHeight: 250,
        backgroundColor: 'transparent'
    },
    inputRow: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 6,
        backgroundColor: 'transparent'

    },
    flexRow: {
        flexDirection: 'row',
        marginTop: -16,
        marginBottom: 26,
        marginRight: 16,
        marginLeft: 16,
    },
    iconInput: {
        marginTop: 6,
    },
    btnSalvarValores: {
        marginBottom: 26,
        marginHorizontal: 16,
        display: 'none'
    },
    fab: {
        margin: 16,
    },
    sectionHeaderContainer: {
        backgroundColor: "white",
        padding: 12,
        marginBottom: 12,
        marginLeft: 6
    },
    itemContainer: {
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingEnd: 0,
    },
    sectionHeaderContainerText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6
    },
    itemContainerText: {

    },
    iconeContainer: {
        padding: 0,
        marginEnd: 0,
        paddingEnd: 0
    },
    icone: {
        marginTop: 14,
        marginLeft: 0,
        marginRight: 0
    },
    titleBold: {
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 12
    }
});

const TYPE_MODO_PRECO = 1;
const TYPE_ENTREGA = 2;
const TYPE_PAGAMENTO = 3;
const TYPE_PARCELAMENTO = 4;


const getTotal = (changes, document, pagamentoId, valorEntrega) => {
    const entregaTotal = changes?.entregaFinal ? changes.entregaFinal.valor : document?.entregaFinal?.valor;
    const entregaTotalFinal = valorEntrega ? valorEntrega : entregaTotal;
    const garantiaTotal = changes?.garantiaFinal?.valor ? changes?.garantiaFinal?.valor : document?.garantiaFinal?.valor;
    const pagamento = changes?.pagamentoFinal ? changes?.pagamentoFinal : document?.pagamentoFinal;
    const parcela = changes?.parcelaFinal ? changes?.parcelaFinal : document?.parcelaFinal;
    const listaMain = changes?.listaDeProdutos ? changes.listaDeProdutos : document?.listaDeProdutos;

    const comTaxa = (pagamentoId === 2 || pagamentoId === 3 || pagamentoId === 6);
    const taxaTotal = (comTaxa) ? parcela.total : 0;


    let totalItens = 0;
    let totalComissao = 0;
    listaMain.map(item => {
        const tt = item.valorTotal;
        const ttcom = item.comissaoTotal;
        totalItens = totalItens + tt;
        totalComissao = ttcom + totalComissao;
    });


    const valorTotal = entregaTotalFinal + garantiaTotal + totalItens;

    return valorTotal;
};


function ContentParcelamento({ set, state }) {

    const { changes, document, parcelamento, pagamentoId } = state;


    const total = getTotal(changes, document, pagamentoId);

    const filtros = [
        {
            title: 'Parcelas:',
            data: getListParcelamento(total)
        }
    ];

    const renderSectionHeader = useCallback(({ section }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderContainerText}>{section.title}</Text>
        </View>
    ), []);

    const renderItem = useCallback(({ item, i }) => (
        <TouchableOpacity onPress={() => set(item)} style={styles.itemContainer}>
            <List.Item
                style={styles.dados}
                titleStyle={styles.dadosTitle}
                title={item.titulo}
                descriptionNumberOfLines={5}
                right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>}
                description={`Acrescimo:  R$${item.valor}\n${item.descricao}`} />
        </TouchableOpacity>
    ), []);


    return (
        <View style={styles.contentContainer}>
            <BottomSheetSectionList
                sections={filtros}
                keyExtractor={(i, index) => i.id ? i.id : index}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
            />
        </View>

    );
};

function EditarParcelas({ parcelaFinal, pagamentoFinal, open, state, setState }) {

    const { parcelamento, pagamentoId } = state;

    const comTaxa = (pagamentoFinal.id === 2 || pagamentoFinal.id === 3 || pagamentoFinal.id === 6);

    if (!comTaxa || !parcelamento) return null;



    return (
        <>
            <Headline style={styles.subheader}>Editar Parcelas</Headline>

            <TextInput
                theme={theme}
                value={parcelaFinal.descricao}
                editable={false}
                label="Parcelamento"
                mode="outlined"
                style={styles.input}
                right={<TextInput.Icon style={styles.iconInput} onPress={() => open(null, null, null, TYPE_PARCELAMENTO, null)} size={20} icon={'sync'} />}

            />



            <Button
                compact
                style={styles.btnSalvarValores}
                buttonColor='#00000020'
                mode='contained-tonal'>Salvar</Button>

            <Divider style={styles.divider} />
            <View style={styles.spacing} />
        </>
    )
};


function ContentEntrega({ set, state }) {

    const filtros = [
        {
            title: 'Formas de Envio:',
            data: getListEntrega()
        }
    ];

    const { changes, document, parcelamento, pagamentoId } = state;



    const renderSectionHeader = useCallback(({ section }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderContainerText}>{section.title}</Text>
        </View>
    ), []);

    const click = useCallback((item) => {
        const total = getTotal(changes, document, pagamentoId, item.valor);

        const parcelaList = getListParcelamento(total);
        const parcelaPadrao = parcelaList[0];

        set(item, parcelaPadrao, pagamentoId);
    }, [state]);

    const renderItem = useCallback(({ item, i }) => (
        <TouchableOpacity onPress={() => click(item)} style={styles.itemContainer}>
            <List.Item
                style={styles.dados}
                titleStyle={styles.dadosTitle}
                title={item.titulo}
                descriptionNumberOfLines={5}
                right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>}
                description={`Valor:  R$${item.valor}\n${item.descricao}`} />
        </TouchableOpacity>
    ), [state]);


    return (
        <View style={styles.contentContainer}>
            <BottomSheetSectionList
                sections={filtros}
                keyExtractor={(i, index) => i.id ? i.id : index}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
            />
        </View>

    );
};

function EditarEntrega({ entregaFinal, open }) {
    return (
        <>

            <Headline style={styles.subheader}>Editar Entrega</Headline>

            <TextInput
                theme={theme}
                value={entregaFinal.titulo + ': ' + entregaFinal.valorString}
                editable={false}
                onChangeText={(value) => { }}
                label="Opção de Entrega"
                mode="outlined"
                style={styles.input}
                right={<TextInput.Icon style={styles.iconInput} onPress={() => open(null, null, null, TYPE_ENTREGA, null)} size={20} icon={'sync'} />}

            />

            <Button
                compact
                style={styles.btnSalvarValores}
                buttonColor='#00000020'
                mode='contained-tonal'>SALVAR</Button>

            <Divider style={styles.divider} />
            <View style={styles.spacing} />
        </>
    );
};



function ContentModo({ comissao, valor, set, id, index, changes, state }) {

    const { document, parcelamento, pagamentoId } = state;

    const filtros = [
        {
            title: 'Modo de Precificação:',
            data: findRealValor(valor, id)
        }
    ];

    const renderSectionHeader = useCallback(({ section }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderContainerText}>{section.title}</Text>
        </View>
    ), []);


    const click = useCallback((item) => {

        set(item.valor, item.comissao, item.id, item.nome, item.quantidadeMinima, index, changes, pagamentoId);
        //set(item, parcelaPadrao, pagamentoId);

    }, [changes, document, pagamentoId, index, state]);

    const renderItem = useCallback(({ item, i }) => (
        <TouchableOpacity onPress={() => click(item)} style={styles.itemContainer}>
            <List.Item
                style={styles.dados}
                titleStyle={styles.dadosTitle}
                title={item.nome}
                titleNumberOfLines={5}
                right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>}
                description={`Valor:  R$${item.valor}\nComissão:  R$${item.comissao}`} />
        </TouchableOpacity>
    ), [index, changes, document, pagamentoId, state]);


    return (
        <View style={styles.contentContainer}>
            <BottomSheetSectionList
                sections={filtros}
                keyExtractor={(i, index) => i.id ? i.id : index}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
            />
        </View>

    );
};

function EditarItens({ listaDeProdutos, setState, open }) {

    const aumentar = (item, index) => {

        let quant = item.quantidade;
        let novaLista = [];

        for (let i = 0; i < listaDeProdutos.length; i++) {

            const obj = listaDeProdutos[i];


            if (i === index) {

                const novaQuant = quant + 1;
                const { valorUni, comissaoUnidade } = obj;

                const objNew = {
                    ...obj,
                    quantidade: novaQuant,
                    valorTotalComComissao: (valorUni * novaQuant),
                    valorTotal: (valorUni * novaQuant),
                    comissaoTotal: (comissaoUnidade * novaQuant),
                };

                novaLista.push(objNew);


            } else {
                novaLista.push(obj);
            }


        }

        //novaLista[index].quantidade = quant + 1;

        setState((prevState) => ({
            ...prevState,
            changes: {
                ...prevState.changes,
                listaDeProdutos: novaLista
            }
        }));
    };

    const diminuir = (item, index) => {

        let quant = item.quantidade;
        const novaQuantidade = quant === 1 ? 0 : quant - 1;

        let novaLista = [];

        for (let i = 0; i < listaDeProdutos.length; i++) {

            const obj = listaDeProdutos[i];


            if (i === index) {


                const novaQuant = quant - 1;
                const { valorUni, comissaoUnidade } = obj;

                const objNew = {
                    ...obj,
                    quantidade: novaQuant,
                    valorTotalComComissao: (valorUni * novaQuant),
                    valorTotal: (valorUni * novaQuant),
                    comissaoTotal: (comissaoUnidade * novaQuant),
                };


                if (novaQuantidade > 0) {
                    novaLista.push(objNew);
                }




            } else {
                novaLista.push(obj);
            }


        }

        setState((prevState) => ({
            ...prevState,
            changes: {
                ...prevState.changes,
                listaDeProdutos: novaLista
            }
        }));
    };

    const alterarModo = (index, valor, comissao, id) => {
        //console.log(index, valor, comissao)
        open(index, valor, comissao, TYPE_MODO_PRECO, id);
    };

    const alterarValor = () => {

    };

    return (
        <>
            {listaDeProdutos.map((obj, index) => (
                <ItemProdutoVendaEditor
                    style={styles.dados}
                    key={obj.idProdut}
                    path={obj.caminhoImg}
                    produto={obj}
                    index={index}
                    aumentar={aumentar}
                    diminuir={diminuir}
                    alterarModo={alterarModo}
                    alterarValor={alterarValor}
                    title={`${obj.quantidade} ${obj.produtoName.toLowerCase()}`}
                    description={`R$ ${(obj.valorUni * obj.quantidade)},00`} />
            ))}

            <Divider style={styles.divider} />
            <View style={styles.spacing} />
        </>
    );
};



function ContentPagamento({ set, state }) {

    const filtros = [
        {
            title: 'Formas de Pagamento:',
            data: getListPagamentos()
        }
    ];

    const { changes, document, parcelamento } = state;
    const total = getTotal(changes, document);

    const parcelaList = getListParcelamento(total);
    const parcelaPadrao = parcelaList[0];

    const renderSectionHeader = useCallback(({ section }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderContainerText}>{section.title}</Text>
        </View>
    ), []);

    const renderItem = useCallback(({ item, i }) => (
        <TouchableOpacity onPress={() => set(item, parcelaPadrao)} style={styles.itemContainer}>
            <List.Item
                style={styles.dados}
                titleStyle={styles.dadosTitle}
                title={item.titulo}
                descriptionNumberOfLines={5}
                right={props => <View style={styles.iconeContainer} ><List.Icon style={styles.icone} icon="chevron-right" /></View>}
                description={`${item.valorString}`} />
        </TouchableOpacity>
    ), []);


    return (
        <View style={styles.contentContainer}>
            <BottomSheetSectionList
                sections={filtros}
                keyExtractor={(i, index) => i.id ? i.id : index}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
            />
        </View>

    );
};

function EditarPagamento({ pagamentoFinal, open, state, setState }) {

    const comTaxa = (pagamentoFinal.id === 2 || pagamentoFinal.id === 3 || pagamentoFinal.id === 6);
    const styleInput = comTaxa ? [styles.input, { marginBottom: 6 }] : styles.input;

    const { parcelamento, pagamentoId, changes, document } = state;

    const check = () => {

        const total = getTotal(changes, document);

        if (parcelamento) {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    parcelaFinal: {
                        ...prevState.changes?.parcelaFinal,
                        descricao: '',
                        pos: 0,
                        id: 1,
                        titulo: 'Sem taxa',
                        total: 0,
                        totalString: 'R$0,00',
                        valor: total,
                        valorString: `R$${total}`
                    }
                },
                parcelamento: !parcelamento,
                parcelaId: 0
            }));
        } else {
            const parcelaList = getListParcelamento(total);
            const parcelaPadrao = parcelaList[0];
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    parcelaFinal: parcelaPadrao
                },
                parcelamento: !parcelamento,
                parcelaId: 0
            }));
        }


    };

    return (
        <>
            <Headline style={styles.subheader}>Editar Pagamento</Headline>

            <TextInput
                theme={theme}
                value={pagamentoFinal.titulo + ': ' + pagamentoFinal.valorString}
                editable={false}
                onChangeText={(value) => { }}
                label="Formas de Pagamento"
                mode="outlined"
                style={styleInput}
                right={<TextInput.Icon style={styles.iconInput} onPress={() => open(null, null, null, TYPE_PAGAMENTO, null)} size={20} icon={'sync'} />}

            />

            {
                comTaxa ?
                    <Checkbox.Item
                        status={parcelamento ? 'checked' : 'unchecked'}
                        label="TAXA DE PARCELAMENTO"
                        position='leading'
                        style={{ width: 300, marginBottom: 8 }}
                        onPress={check}
                    />
                    :
                    null
            }



            <Button
                compact
                style={styles.btnSalvarValores}
                buttonColor='#00000020'
                mode='contained-tonal'>Salvar</Button>

            <Divider style={styles.divider} />
            <View style={styles.spacing} />
        </>
    )
};



function Resumo({ document, changes, parcelamento }) {

    const entregaTotal = changes?.entregaFinal ? changes.entregaFinal.valor : document?.entregaFinal?.valor;
    const garantiaTotal = changes?.garantiaFinal?.valor ? changes?.garantiaFinal?.valor : document?.garantiaFinal?.valor;
    const pagamento = changes?.pagamentoFinal ? changes?.pagamentoFinal : document?.pagamentoFinal;
    const parcela = changes?.parcelaFinal ? changes?.parcelaFinal : document?.parcelaFinal;
    const listaMain = changes?.listaDeProdutos ? changes.listaDeProdutos : document?.listaDeProdutos;

    const comTaxa = (pagamento.id === 2 || pagamento.id === 3 || pagamento.id === 6);

    let totalItens = 0;
    let totalComissao = 0;
    listaMain.map(item => {
        const tt = item.valorTotal;
        const ttcom = item.comissaoTotal;
        totalItens = totalItens + tt;
        totalComissao = ttcom + totalComissao;
    });

    const parcelaAtual = getListParcelamento(entregaTotal + garantiaTotal + totalItens)[parcela.id - 1];
    const taxaTotal = (comTaxa && parcelamento) ? parcelaAtual.valor : 0;


    const valorTotal = entregaTotal + garantiaTotal + taxaTotal + totalItens;
    console.log(valorTotal, entregaTotal, garantiaTotal, taxaTotal, totalItens)

    return (
        <>
            <Headline style={styles.subheader}>Resumo do Pedido</Headline>
            <List.Item style={styles.dados} titleStyle={styles.titleBold} descriptionStyle={styles.titleBold} title={formartarValor(valorTotal)} description={'Valor Total da Compra'} />
            <List.Item style={styles.dados} titleStyle={styles.titleBold} descriptionStyle={styles.titleBold} title={formartarValor(totalComissao)} description={'Comissão Total'} />
            <View style={styles.spacing} />
            <Divider style={styles.divider} />
            <View style={styles.spacing} />
        </>
    );
};



function Content({ item, setState, state, open }) {

    const { listaDeProdutos, entregaFinal, pagamentoFinal, parcelaFinal } = item;
    const { changes, document, parcelamento } = state;

    const listaMain = changes?.listaDeProdutos ? changes.listaDeProdutos : listaDeProdutos;
    const entregaMain = changes?.entregaFinal ? changes.entregaFinal : entregaFinal;
    const pagMain = changes?.pagamentoFinal ? changes.pagamentoFinal : pagamentoFinal;
    const parcelaMain = changes?.parcelaFinal ? changes.parcelaFinal : parcelaFinal;

    return (
        <ScrollView>
            <View style={styles.detalhe}>
                <List.Section>

                    <EditarItens setState={setState} listaDeProdutos={listaMain} open={open} />

                    <EditarEntrega setState={setState} state={state} parcelaFinal={parcelaMain} entregaFinal={entregaMain} open={open} />

                    <EditarPagamento setState={setState} state={state} pagamentoFinal={pagMain} open={open} />

                    <EditarParcelas setState={setState} state={state} parcelaFinal={parcelaMain} pagamentoFinal={pagMain} open={open} />

                    <Resumo document={document} changes={changes} parcelamento={parcelamento} />

                </List.Section>

            </View>
        </ScrollView>
    )
};

function BotaoSalvar({ state, item, setState, navigation }) {

    const { changes, document, parcelamento } = state;

    if (!changes) return null;

    const salvarAtualizacoes = () => {

        setState((prevState) => ({
            ...prevState,
            load: true
        }));


        const entregaTotal = changes?.entregaFinal ? changes.entregaFinal.valor : document?.entregaFinal?.valor;
        const garantiaTotal = changes?.garantiaFinal?.valor ? changes?.garantiaFinal?.valor : document?.garantiaFinal?.valor;
        const pagamento = changes?.pagamentoFinal ? changes?.pagamentoFinal : document?.pagamentoFinal;
        const parcela = changes?.parcelaFinal ? changes?.parcelaFinal : document?.parcelaFinal;
        const listaMain = changes?.listaDeProdutos ? changes.listaDeProdutos : document?.listaDeProdutos;

        const comTaxa = (pagamento.id === 2 || pagamento.id === 3 || pagamento.id === 6);

        let totalItens = 0;
        let totalComissao = 0;
        listaMain.map(item => {
            const tt = item.valorTotal;
            const ttcom = item.comissaoTotal;
            totalItens = totalItens + tt;
            totalComissao = ttcom + totalComissao;
        });

        const parcelaAtual = getListParcelamento(entregaTotal + garantiaTotal + totalItens)[parcela.id - 1];
        const taxaTotal = (comTaxa && parcelamento) ? parcelaAtual.valor : 0;


        const valorTotal = entregaTotal + garantiaTotal + taxaTotal + totalItens;

        const docNew = {
            ...changes,
            compraValor: valorTotal,
            valorTotal: valorTotal,
            comissaoTotal: totalComissao
        };

        atualizarPedido(document.idCompra, document.uidUserRevendedor, docNew, (sucess) => {
            if (sucess) {
                navigation.goBack();
            } else {
                setState((prevState) => ({
                    ...prevState,
                    load: false
                }));
            }
        });
    };

    return (
        <FAB
            backgroundColor={colorPrimary}
            style={styles.fab}
            loading={state.load}
            onPress={salvarAtualizacoes}
            color='#fff'
            mode='flat'
            size='medium'
            label='SALVAR' />
    );
};



export default function EditarPedido({ navigation, route }) {

    const produto = route.params.produto;

    const bottomSheetModalRef = useRef();
    const [index, setIndex] = useState(-1);
    const [state, setState] = useState({
        load: false,
        changes: null,
        document: produto,
        typeMenu: -1,
        itemIndex: -1,
        itemComissao: 0,
        itemValor: 0,
        itemModoId: 0,
        entregaId: 0,
        pagamentoId: 0,
        parcelamento: true,
        parcelaId: 0
    });

    const { typeMenu, itemComissao, itemValor, changes, document, itemIndex, itemModoId, parcelamento } = state;

    const snapPoints = useMemo(() => ['80%'], []);

    const getBottomSheetContent = useCallback(() => {


        switch (typeMenu) {
            default:
                <Pb />
            case 1:
                return (
                    <ContentModo
                        comissao={itemComissao}
                        valor={itemValor}
                        id={itemModoId}
                        index={itemIndex}
                        state={state}
                        changes={changes}
                        set={setModo} />
                );
            case 2:
                return (
                    <ContentEntrega
                        set={setEntrega}
                        state={state}
                    />
                );
            case 3:
                return (
                    <ContentPagamento
                        state={state}
                        set={setPagamento}
                    />
                );
            case 4:
                return (
                    <ContentParcelamento
                        state={state}
                        set={setParcelas}
                    />
                );
        }

    }, [state, itemIndex]);

    const setParcelas = useCallback((parcFinal) => {

        setState((prevState) => ({
            ...prevState,
            changes: {
                ...prevState.changes,
                parcelaFinal: parcFinal
            },
            parcelaId: parcFinal.id
        }));



        bottomSheetModalRef.current?.close();
    }, [state]);

    const setPagamento = useCallback((pagFinal, parcelaPadrao) => {
        const comTaxa = (pagFinal.id === 2 || pagFinal.id === 3 || pagFinal.id === 6);

        if (comTaxa) {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    pagamentoFinal: pagFinal,
                    parcelaFinal: parcelaPadrao
                },
                pagamentoId: pagFinal.id,
                parcelaId: parcelaPadrao.id
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    pagamentoFinal: pagFinal
                },
                pagamentoId: pagFinal.id
            }));
        }



        bottomSheetModalRef.current?.close();
    }, [state]);

    const setEntrega = useCallback((entFinal, parcelaPadrao, pagamentoId) => {
        const comTaxa = (pagamentoId === 2 || pagamentoId === 3 || pagamentoId === 6);


        if (comTaxa) {

            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    entregaFinal: entFinal,
                    parcelaFinal: parcelaPadrao
                },
                entregaId: entFinal.id,
                parcelaId: parcelaPadrao.id
            }));

        } else {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    entregaFinal: entFinal
                },
                entregaId: entFinal.id
            }));
        }


        bottomSheetModalRef.current?.close();
    }, [state]);

    const setModo = useCallback((valor, comissao, idModo, stringModo, q, index, changes, pagamentoId) => {

        const comTaxa = (pagamentoId === 2 || pagamentoId === 3 || pagamentoId === 6);

        const listaMain = changes?.listaDeProdutos ? changes.listaDeProdutos : document.listaDeProdutos;
        let novaLista = [];
        let totalItens = 0;
        //console.log(valor, comissao, idModo, stringModo, q, index);

        for (let i = 0; i < listaMain.length; i++) {
            const obj = listaMain[i];
            const tt = obj.valorTotal;
            totalItens = totalItens + tt;
            if (i === index) {
                const objNew = {
                    ...obj,
                    valorUni: valor,
                    valorUniComComissao: valor,
                    comissaoUnidade: comissao,
                    valorTotalComComissao: (valor * obj.quantidade),
                    valorTotal: (valor * obj.quantidade),
                    comissaoTotal: (comissao * obj.quantidade),
                    idModoPreco: idModo,
                    modoPreco: stringModo,
                    quantidadeMinima: q
                };
                //console.log(objNew)

                novaLista.push(objNew);
            } else {
                novaLista.push(obj);
            }
        }

        const entregaTotal = changes?.entregaFinal ? changes.entregaFinal.valor : document?.entregaFinal?.valor;
        const garantiaTotal = changes?.garantiaFinal?.valor ? changes?.garantiaFinal?.valor : document?.garantiaFinal?.valor;
        const parcela = changes?.parcelaFinal ? changes?.parcelaFinal : document?.parcelaFinal;

        const parcelaList = getListParcelamento(entregaTotal + garantiaTotal + totalItens);
        const parcelaPadrao = parcelaList[parcela.id - 1];




        if (comTaxa) {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    listaDeProdutos: novaLista,
                    parcelaFinal: parcelaPadrao
                },
                parcelaId: parcelaPadrao.id
            }));

        } else {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    listaDeProdutos: novaLista
                }
            }));
        }





        bottomSheetModalRef.current?.close();

    }, [state]);

    const handlePresentModalPress = useCallback((index, valor, comissao, type, id) => {

        if (type === TYPE_MODO_PRECO) {
            setState((prevState) => ({
                ...prevState,
                typeMenu: type,
                itemIndex: index,
                itemComissao: comissao,
                itemValor: valor,
                itemModoId: id
            }));
        } else if (type === TYPE_ENTREGA) {
            setState((prevState) => ({
                ...prevState,
                typeMenu: type,
            }));
        } else if (type === TYPE_PAGAMENTO) {
            setState((prevState) => ({
                ...prevState,
                typeMenu: type,
            }));
        } else if (type === TYPE_PARCELAMENTO) {
            setState((prevState) => ({
                ...prevState,
                typeMenu: type,
            }));
        }



        bottomSheetModalRef.current?.expand();

    }, []);

    const handleSheetChanges = useCallback((index) => {
        setIndex(index);
    }, []);

    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            {...props}
            opacity={0.4}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    ), []);

    useEffect(() => {

        const pagamentoId = changes?.pagamentoFinal?.id ? changes?.pagamentoFinal.id : document?.pagamentoFinal.id;
        const comTaxa = (pagamentoId === 2 || pagamentoId === 3 || pagamentoId === 6);

        const listaMain = changes?.listaDeProdutos ? changes.listaDeProdutos : document.listaDeProdutos;
        let totalItens = 0;

        for (let i = 0; i < listaMain.length; i++) {
            const obj = listaMain[i];
            const tt = obj.valorTotal;
            totalItens = totalItens + tt;
        }

        const entregaTotal = changes?.entregaFinal ? changes.entregaFinal.valor : document?.entregaFinal?.valor;
        const garantiaTotal = changes?.garantiaFinal?.valor ? changes?.garantiaFinal?.valor : document?.garantiaFinal?.valor;
        const parcela = changes?.parcelaFinal ? changes?.parcelaFinal : document?.parcelaFinal;

        const parcelaList = getListParcelamento(entregaTotal + garantiaTotal + totalItens);
        const parcelaPadrao = parcelaList[parcela.id - 1];

        console.log(comTaxa)



        if (comTaxa) {
            setState((prevState) => ({
                ...prevState,
                changes: {
                    ...prevState.changes,
                    parcelaFinal: parcelaPadrao
                },
                parcelaId: parcelaPadrao.id
            }));

        } 


    }, [changes?.listaDeProdutos]);


    console.log(changes)

    return (
        <BottomSheetModalProvider>
            <GestureHandlerRootView style={styles.container}>

                <Content item={document} setState={setState} state={state} open={handlePresentModalPress} />

                <BotaoSalvar item={document} setState={setState} state={state} navigation={navigation} />

                <BottomSheet
                    ref={bottomSheetModalRef}
                    index={index}
                    style={styles.bottomSheet}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}>

                    {getBottomSheetContent()}
                </BottomSheet>
            </GestureHandlerRootView>
        </BottomSheetModalProvider>
    );
};