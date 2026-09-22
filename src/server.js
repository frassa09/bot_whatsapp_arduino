import 'dotenv/config'
import express from 'express'
import { createWhatsappConnection } from './whatsappConnection.js'
import { socket } from './whatsappConnection.js'

const number = process.env.CEL_NUMBER
const formattedNumber = `${number}@s.whatsapp.net`
const groupNumber = process.env.GROUP_NUMBER
console.log(groupNumber)

const app = express()

app.use(express.json())
createWhatsappConnection()

app.get('/', (req, res) => {

    socket.sendMessage(groupNumber, {text: 'olá tudo bem'})
    res.status(200).json({
        message: 'Aplicação no ar'
    })
})



app.listen(4040, () => {
    console.log('Aplicação rodando em http://localhost:4040')
})