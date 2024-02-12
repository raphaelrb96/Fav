export const getListEntrega = () => {
    return [
        {
            prazo: '1 a 4 horas',
            titulo: 'Entrega Local',
            descricao: 'Envio para maioria dos bairros de Manaus',
            valorString: 'R$10,00',
            valor: 10,
            id: 0
        },
        {
            prazo: '2 a 6 horas',
            titulo: 'Entrega Distante',
            descricao: 'Envio para bairros distantes em Manaus',
            valorString: 'R$20,00',
            valor: 20,
            id: 1
        },
        {
            prazo: '1 a 3 dias',
            titulo: 'Entrega Estadual',
            descricao: 'Envio para fora da cidade de Manaus',
            valorString: 'R$30,00',
            valor: 30,
            id: 2
        },
        {
            prazo: '30 a 90 minutos',
            titulo: 'Entrega Parceira',
            descricao: 'Envio para Manaus via app de entrega',
            valorString: 'Calcular',
            valor: 0,
            id: 3
        },
        {
            prazo: '7 a 30 dias',
            titulo: 'Entrega Nacional',
            descricao: '"Envio para todas as cidades do Brasil',
            valorString: 'Calcular',
            valor: 0,
            id: 4
        },
    ];
};

export const getListaGarantia = (total) => {
    const taxa1 = Number((total * 15) / 100);
    const taxa2 = Number((total * 30) / 100);
    const taxa3 = Number((total * 40) / 100);

    return [
        {
            titulo: 'Garantia de Segurança',
            descricao: 'Prazo de 7 dias para troca',
            valorString: 'Grátis',
            valor: 0,
            id: 0
        },
        {
            titulo: 'Garantia Extra',
            descricao: 'Prazo de 30 dias para troca',
            valorString: `R$${taxa1.toFixed(0)},00`,
            valor: taxa1,
            id: 1
        },
        {
            titulo: 'Garantia Vip',
            descricao: 'Prazo de 3 meses para troca',
            valorString: `R$${taxa2.toFixed(0)},00`,
            valor: taxa2,
            id: 2
        },
        {
            titulo: 'Garantia Vitalicia',
            descricao: 'Prazo de 6 meses para troca',
            valorString: `R$${taxa3.toFixed(0)},00`,
            valor: taxa3,
            id: 3
        },
    ];

};

export const getListPagamentos = () => {
    return [
        {
            titulo: 'Débito',
            descricao: 'Pagamento Presencial',
            valorString: 'Sem Taxa',
            valor: 0,
            id: 1,
            pos: 0
        },
        {
            titulo: 'Crédito',
            descricao: 'Pagamento Presencial',
            valorString: 'Com Taxa',
            valor: 0,
            id: 2,
            pos: 1
        },
        {
            titulo: 'Dinheiro',
            descricao: 'Pagamento Presencial',
            valorString: 'Sem Taxa',
            valor: 0,
            id: 4,
            pos: 2
        },
        {
            titulo: 'Pix',
            descricao: 'Pagamento Presencial e Online',
            valorString: 'Sem Taxa',
            valor: 0,
            id: 5,
            pos: 3
        },
        {
            titulo: 'Link',
            descricao: 'Pagamento Presencial e Online',
            valorString: 'Com Taxa',
            valor: 0,
            id: 6,
            pos: 4
        },
    ];
};

export const getListParcelamento = (total) => {
    let list = [];
    for (let i = 1; i < 13; i++) {
        const taxa = (2*i) + 2;
        const totalTaxa = Number((total * taxa) / 100);
        const totalComTaxa = total + totalTaxa;
        const valorParcela = totalComTaxa/i;
        const pcl = i < 2 ? " Parcela" : " Parcelas";
        const desc = `R$${totalComTaxa.toFixed(0)} em ${i} ${pcl} de R$${valorParcela.toFixed(0)}`
        const nome = i + pcl;
        const obj = {
            titulo: nome,
            descricao: desc,
            valorString: `Taxa: ${taxa}%`,
            valor: Number(totalTaxa.toFixed(0)),
            id: i,
            pos: i - 1,
            total: Number(totalComTaxa.toFixed(0)),
            totalString: 'R$' + totalComTaxa.toFixed(0) + ',00'
        }
        list.push(obj);
    }
    return list;
};