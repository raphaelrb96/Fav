export function formartarValor(v) {
    return `R$ ${v.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')},00`
};

export function formartarValorSmall(v) {
    return `R$${v.toFixed(0)}`
};

export function dateFullToYMD(date) {
    return new Date(date).toLocaleDateString("pt-br") + ' às ' + new Date(date).toLocaleTimeString("pt-br");
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
};

export function dateToYMD(date) {
    return new Date(date).toLocaleDateString("pt-br");
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}