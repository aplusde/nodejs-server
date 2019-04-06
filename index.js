const express = require('express')
const app = express()
var bodyParser = require('body-parser')
import math from 'mathjs'

import { Node, range } from './models'
import createRangeTable from './functionHandler/createRangeTable'
import tranformSemivariance from './functionHandler/tranformSemivariance'
import createMatrix from './functionHandler/createMatrix'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let user = [
    { id: 1, name: 'john', surname: 'do', job: 'programmer', salary: 12000 },
]

app.get('/', async (req, res) => {
    // Node.findAll().then(nodeData=>res.send(nodeData))//  1. then

    const nodeData = await Node.findAll()
    res.send(nodeData)
    // const nodeData =  await Node.findOne()
    //  res.send(nodeData)
})

app.get('/user', (req, res) => {
    res.send(user)
})

app.post('/create/node/array', async (req, res) => {

    const { example = [] } = req.body //array
    try {
        example.map(async data => await Node.create(data))
        res.send({ status: 'success' })

    } catch (e) {
        res.send({ status: 'error' })
    }
})

app.post('/node/create', async (req, res) => {

    const { latitude, longtitude, attitude } = req.body

    const newNode = {
        latitude,
        longtitude,
        attitude,
    }
    const nodeDatas = await Node.findAll()// query nodes 30 record
    // const createNode = await Node.create(newNode) //create node 
    const tranformdata = createRangeTable(nodeDatas)
    // tranformdata.map(async ({ id, distance }) => {
    //     distance.map(async (rangeValue, index) => {
    //         range.findOrCreate({ where: { nodeId: id, range: rangeValue, rangeFromNode: index + 1 }, default: { range: rangeValue } })
    //             .then(([range, create]) => {
    //                 console.log(range.get({
    //                     plain: true
    //                 }))
    //                 console.log(create)
    //             })
    //     })
    // })
    const tranformSemiVarianceData = tranformSemivariance(tranformdata, { NUGGET: 0, SILL: 0.1, RANGE: 300 })
    const tranformMatrix = createMatrix(tranformSemiVarianceData)
    let A = tranformMatrix
    let b = tranformSemiVarianceData[tranformSemiVarianceData.length - 1].semi
    let w = math.multiply(math.inv(A), b)
    let sum = 0
    for (let i = 0; i < tranformSemiVarianceData.length - 1; i += 1) {
        sum += tranformSemiVarianceData[i].z * w[i]
    }
    sum
    //res.send(tranformSemiVarianceData)
    res.send(sum)

})
app.put('/user/:id', (req, res) => {
    let name = req.body.name;
    let id = +req.params.id

    let userId = user.find((value) => {
        console.log(value)
        console.log(typeof value.id)
        console.log(typeof +req.params.id)
        return value.id === id
    })
    userId.name = name
    user[id - 1] = userId;
    res.send(userId)
})

app.get('/user/:id', (req, res) => {
    //localhost:3000/1  paramas = 1;
    let userId = user.find((value) => {
        console.log(value)
        console.log(typeof value.id)
        console.log(typeof +req.params.id)
        return value.id === +req.params.id
    })
    console.log(req.params.id)
    console.log(userId)
    res.send(userId)
})

app.listen(5000, () => {
    console.log('server listen on port 5000')
})
