import firestore from '@react-native-firebase/firestore';

export const atualizarPedido = async (idCompra, uid, data, callback) => {

    const batch = firestore().batch();

    let rev1 = firestore().collection('Revendas').doc(idCompra);
    let rev2 = firestore().collection('MinhasRevendas').doc('Usuario').collection(uid).doc(idCompra);

    batch.update(rev1, data);
    batch.update(rev2, data);

    await batch.commit().then(() => {
        return callback(true);
    }).catch(error => {
        return callback(false);
    });

}