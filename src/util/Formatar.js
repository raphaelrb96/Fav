export function formartarValor(v) {
    return `R$ ${v.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')},00`
};

export function formartarValorSmall(v) {
    return `R$${v.toFixed(0)}`
};