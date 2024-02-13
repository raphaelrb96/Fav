import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { colorPrimary, colorPrimaryDark } from '../../constantes/cores';
import DatePicker from 'react-native-date-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';


const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 12,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        marginTop: 12
    },
    img: {
        width: 200,
        height: 260
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 30
    },
    btn: {
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        width: '70%',
        alignContent: 'center',
        alignItems: 'center'
    },
    btnMain: {
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        width: 260,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPrimary
    },
    espaco: {
        height: 26
    }
});

function dateToYMD(date) {
    return new Date(date).toLocaleDateString("pt-br") + ' às ' + new Date(date).toLocaleTimeString("pt-br");
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}

let Historico = () => {

    let navegar = useNavigation();

    let [inicio, setInicio] = useState(new Date(Date.now()));
    let [fim, setFim] = useState(new Date(Date.now()));
    let [showInicial, setShowInicial] = useState(false);
    let [showFinal, setShowFinal] = useState(false);

    let contar = () => {
        navegar.navigate('RankingDetalhe', { de: inicio.getTime(), ate: fim.getTime() });
    };

    let consultar = () => {
        navegar.navigate('Relatórios', { de: inicio.getTime(), ate: fim.getTime() });
    };

    /*
        let componentDataInicial = (
            <DateTimePicker 
            placeholderText="Inicio"
            testID="dateInicial"
            value={inicio}
            mode="date"
            is24Hour={true}
            locale="pt-br"
            display="spinner"
            onChange={(event, date) => {
                if(date === null || date === undefined) {
                    setShowInicial(false);
                    return;
                }
                let novaData = new Date(date);
                novaData.setHours(0);
                novaData.setMinutes(0);
                novaData.setSeconds(0);
                novaData.setMilliseconds(0);
                setInicio(novaData);
                setShowInicial(false);
            }}
            />    
        );
    
        if(!showInicial) {
            componentDataInicial = null;
        }
    
        

        
    
        */

    



    console.log(fim)

    return (
        <ScrollView>
            <View style={styles.sectionContainer} >
                <Text style={styles.sectionTitle} >Consultas Detalhadas</Text>
                <Text style={styles.sectionDescription} >Selecione um intervalo de datas</Text>

                <TouchableOpacity style={styles.btn} onPress={() => { setShowInicial(true) }}>
                    <Text>{(inicio !== null) ? `De: ${dateToYMD(inicio)}` : "Selecionar inicio"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => { setShowFinal(true) }} >
                    <Text>{(fim !== null) ? `Ate: ${dateToYMD(fim)}` : "Selecionar fim"}</Text>
                </TouchableOpacity>



                <View style={styles.espaco} />

                <TouchableOpacity style={styles.btnMain} onPress={() => { contar() }} >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }} >BÔNUS DE VENDAS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnMain} onPress={() => { }} >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }} >BÔNUS DE RECRUTAMENTO</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnMain} onPress={() => { consultar() }} >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }} >CONSULTAR VENDAS</Text>
                </TouchableOpacity>

                <DatePicker
                    modal
                    open={showFinal}
                    mode='date'
                    title={"Data Final"}
                    confirmText="Confirmar"
                    cancelText='Cancelar'
                    date={fim}
                    onConfirm={(date) => {
                        if (date === null || date === undefined) {
                            setShowFinal(false);
                            return;
                        }
                        let novaData = new Date(date);
                        novaData.setHours(0);
                        novaData.setMinutes(0);
                        novaData.setSeconds(0);
                        novaData.setMilliseconds(0);
                        setFim(novaData);
                        setShowFinal(false);
                    }}
                    onCancel={() => {
                        setShowFinal(false)
                    }}
                />

                <DatePicker
                    modal
                    open={showInicial}
                    mode='date'
                    confirmText="Confirmar"
                    cancelText='Cancelar'
                    title={"Data Inicial"}
                    date={inicio}
                    onConfirm={(date) => {
                        if (date === null || date === undefined) {
                            setShowInicial(false);
                            return;
                        }
                        let novaData = new Date(date);
                        novaData.setHours(0);
                        novaData.setMinutes(0);
                        novaData.setSeconds(0);
                        novaData.setMilliseconds(0);
                        setInicio(novaData);
                        setShowInicial(false);
                    }}
                    onCancel={() => {
                        setShowInicial(false)
                    }}
                />

                

            </View>
        </ScrollView>

    );
}

export default Historico;