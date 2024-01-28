

export function getValorVarejo(valor) {
    if(valor < 50) return 50;
    return valor;
};

export function getValorAtacado(valor) {
    if(valor < 50) return 50 - 30;
    return valor - 30;
};

export function getValorAtacarejo(valor) {
    if(valor < 50) return 50 - 20;
    return valor - 20;
};

export function getValorPromocional(valor) {
    if(valor < 50) return 50 - 10;
    return valor - 10;
};


export function getListaPrecificacao(comissao, valor, isAtacado) {
    let precificacoes = [];
    
    //varejo
    let valVarejo = getValorVarejo(valor);
    let comVarejo = comissao;
    if(comissao < 15) {
        comVarejo = 15;
    }
    const objVarejo = {
        nome: 'Varejo',
        comissao: comVarejo,
        valor: valVarejo,
        bonus: 5,
        id: 0,
        quantidadeMinima: 1
    };
    precificacoes.push(objVarejo);

    //promocao
    let valPromo = getValorPromocional(valor);
    let comPromo = 10;
    const objPromo = {
        nome: 'Promoção',
        comissao: comPromo,
        valor: valPromo,
        bonus: 5,
        id: 1,
        quantidadeMinima: 1
    };
    precificacoes.push(objPromo);

    //atacarejo
    let valAtacarejo = getValorAtacarejo(valor);
    let comAtacarejo = 5;
    const objAtacarejo = {
        nome: 'Atacarejo',
        comissao: comAtacarejo,
        valor: valAtacarejo,
        bonus: 5,
        id: 2,
        quantidadeMinima: 1
    };
    precificacoes.push(objAtacarejo);

    //atacado
    let valAtacado = getValorAtacado(valor);
    let comAtacado = 3;
    const objAtacado = {
        nome: 'Atacado',
        comissao: comAtacado,
        valor: valAtacado,
        bonus: 5,
        id: 3,
        quantidadeMinima: 6
    };

    if(isAtacado) {
        precificacoes.push(objAtacado);
    }

    return precificacoes;

};