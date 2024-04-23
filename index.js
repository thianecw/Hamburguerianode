const express = require("express")
const uuid = require("uuid")
const port = 3000
const app = express() // comando pra faciliar o acesso ao express //
app.use(express.json()) // avisar que a informação vai chegar em json //

const orders = []

const checkedOrderId = (request, response, next) => {
    const { id } = request.params // primeiro buscar o Id que será atualizado

    const index = orders.findIndex(order => order.id === id) // variavel para encontrar a posição do pedido referente ao ID

    if (index < 0) { // se a posição encontrada diferente de <0 significa que ele encontrou um ID no banco de dados
        return response.status(404).json({ erro: "Order not found" }) // se não encontrar exibir o status de erro e mensagem
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

// Middleware para mostrar o método e a URL da requisição
const logRequisicao = (request, response, next) => {
    console.log(`Método: ${request.method}, URL: ${request.url}`);
    next();
};

// Aplicando o middleware de log em todas as requisições
app.use(logRequisicao);

app.get('/orders', (request, response) => { // rota para exibir todos os pedidos
    return response.json(orders) // exibe todas as informações do banco de dados
})

app.post('/orders', (request, response) => { // rota para criar novo pedido
    const { order, clientName, price, status } = request.body // buscando as informações pelo corpo 
    const newOrder = { id: uuid.v4(), order, clientName, price, status }// criando uma variavel para armazenar os dados e ID dinamico

    orders.push(newOrder) // inserindo os dados criados no banco de dados

    return response.status(201).json(newOrder)
})

app.put('/orders/:id', checkedOrderId, (request, response) => { // rota para Atualizar pedido

    const { order, clientName, price, status } = request.body// segundo buscar as informações que serão alteradas
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status } // criar uma variavel para armazenar dados atualizados

    orders[index] = updatedOrder // adiciona os dados atualizados no banco de dados

    return response.json(updatedOrder)

})

app.delete('/orders/:id', checkedOrderId, (request, response) => { // rota para Deletar pedido pelo ID

    const index = request.orderIndex
    orders.splice(index, 1)

    return response.status(204).json() // exibe apenas status de sucesso, registro deletado
})


app.get('/orders/:id', checkedOrderId, (request, response) => { // rota para Atualizar pedido
    const index = request.orderIndex
    const id = request.orderId
    // orders[index] = searchedOrder // adiciona os dados atualizados no banco de dados

    return response.json(orders[index])
})


app.patch('/orders/:id', checkedOrderId, (request, response) => { // rota para Atualizar pedido
    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price, status } = request.body// segundo buscar as informações que serão alteradas

    const orderReady = {
        id,
        order: orders[index].order,
        clientName: orders[index].clientName,
        price: orders[index].price,
        status: orders[index].status = "Pronto"
    }
    return response.json(orderReady)
})


// // // PORTA //
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
    })