export function formartarValor(v) {
    return `R$ ${v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
};

export function formartarValorSmall(v) {
    return `R$${v.toFixed(0)}`
};