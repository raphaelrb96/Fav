import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


const guardarImagensProduto = async (fotos, nomeProd, id) => {

    let listaRef = new Array();
    let listaUrl = new Array();

    await Promise.all(fotos.map(async (obj, index) => {
        const { uri } = obj;

        if (uri !== null && uri !== undefined) {
            //foto local
            const strg = nomeProd.replace(/\s/g, '');
            const strg2 = strg.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            const strgLow = strg2.toLowerCase();
            const dtHr = Date.now();
            const stringId = `${strgLow}`;

            const refImg = storage().ref(`produtos/${stringId}${id}/img${index}${dtHr}`);

            await refImg.putFile(uri).then(snap => {
                if (snap.state === 'success') {
                    listaRef.push(refImg);
                    console.log(`Imagem ${index} enviada`);
                }

                //return snap;
            }).catch(e => {
                console.log('Put file error: ' + JSON.stringify(e.message));
                listaRef = null;
                return;
            });


        } else {
            console.log('foto armazenada');
            //foto armazenada
            listaUrl.push(obj);

        }


    }));

    if(!listaRef) return null;

    await Promise.all(
        listaRef.map(async (ref) => {
            await ref.getDownloadURL().then(url => {
                listaUrl.unshift(url);
                console.log(`url add: ${url}`);
            })
        })
    );

    return listaUrl;

};

const createTags = (produto) => {
    const palavras = produto.prodName.split(' ');
    let tags = {};
    palavras.map(item => {
        const chave = String(item).toLowerCase();
        if (chave !== " " && chave !== "") {
            tags[chave] = true;
        }
    });
    return tags;
};

export const getProdutoDoc = async (produto, id) => {

    const tags = createTags(produto);

    const fotos = await guardarImagensProduto(produto.imagens, produto.prodName, id);

    if(!fotos) return null;
    if(fotos.length === 0) return null;

    return {
        ...produto,
        timeUpdate: Date.now(),
        tag: tags,
        imagens: fotos,
        imgCapa: fotos[0]
    };
};

export const getNewProdutoDoc = () => {
    return {
        categorias: {0: true},
        descr: '',
        disponivel: true,
        idProduto: null,
        imgCapa: '',
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
        cores: [],
        prodValorPromocional: 0,
        prodValorAtacarejo: 0,
        prodValorAtacado: 0,
        atacado: false,
        urlVideo: '',
        numVendas: 0,
        avaliacao: 0,
    }
};

export const salvarProdutoFirestore = async (produto) => {

    const batch = firestore().batch();

    let referencedb = null;
    let novoProd = null;

    if (!produto.idProduto) {
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

    const objDoc = await getProdutoDoc(novoProd, referencedb.id);

    if(!objDoc) {
        return { sucess: false, error: 'erro ao salvar imagem' };
    }

    batch.set(referencedb, objDoc);

    const result = await batch.commit().then(() => {
        return { sucess: true };
    }).catch(error => {
        return { sucess: false, error: error };
    });

    return result;

}