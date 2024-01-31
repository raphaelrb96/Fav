import firestore from '@react-native-firebase/firestore';



export const getProdutoDoc = (produto) => {

    const palavras = produto.prodName.split(' ');
    let tags = {};
    palavras.map(item => {
        const chave = String(item).toLowerCase();
        if(chave !== " " && chave !== "") {
            tags[chave] = true;
        }
    });

    console.log(tags)

    return {
        ...produto,
        timeUpdate: Date.now(),
        tag: tags
    };
};

export const getNewProdutoDoc = () => {
    return {
        categorias: null,
        descr: '',
        disponivel: true,
        idProduto: null,
        imgCapa: null,
        imagens: [],
        fabricante: '',
        nivel: 1,
        prodName: '',
        prodValor: 50,
        valorAntigo: 0,
        promocional: false,
        tag: null,
        fornecedores: null,
        quantidade: 1,
        timeUpdate: 0,
        comissao: 15,
        cores: null,
        prodValorPromocional: 0,
        prodValorAtacarejo: 0,
        prodValorAtacado: 0,
        atacado: false,
        urlVideo: null,
        numVendas: 0,
        avaliacao: 0,
    }
};

export const salvarProdutoFirestore = async(produto) => {

    const batch = firestore().batch();

    let referencedb = null;
    let novoProd = null;

    if(!produto.idProduto) {
        //novo
        referencedb = firestore().collection('produtos').doc();
        novoProd = {
            ...produto,
            idProduto: referencedb.id
        };

    } else {
        //existente
        referencedb = firestore().collection('produtos').doc(produto.idProduto);
        novoProd = produto;
    }

    const objDoc = getProdutoDoc(novoProd);

    batch.set(referencedb, objDoc);

    const result = await batch.commit().then(() => {
        return {sucess: true};
    }).catch(error => {
        return {sucess: false, error: error};
    });

    return result;

}