const express = require('express')
const app = express()
var bodyParser = require('body-parser')
import math from 'mathjs'

import { Node, range, variogram } from './models'
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
    /*
    *1. recieve { latitude, longtitude, attitude } know attitude new nodes
    *2. create newnode in Node Model
    *3. calculate predict table from variogrames table
    example 
    node  31 latitude longtitude  attitude
    */

    // await Node.create(newNode) //create node  // TODO HERE
    const nodeDatas = await Node.findAll()// query nodes 30 record
    const createNode = await Node.create({
        latitude,
        longtitude,
        attitude
    })
    const newNode = [
        ...nodeDatas,
        {
            latitude,
            longtitude,
            attitude
        }
    ]
    const tranformdata = createRangeTable(newNode)
    tranformdata.map(async ({ id, distance }) => {
        distance.map(async (rangeValue, index) => {
            range.findOrCreate({ where: { nodeId: id, rangeFromNode: index + 1 }, defaults: { range: rangeValue } })
                .then(([range, create]) => {
                    // console.log(range.get({
                    //     plain: true
                    // }))
                    // console.log(create)
                })
        })
    })
    const tranformSemiVarianceData = tranformSemivariance(tranformdata, { NUGGET: 0, SILL: 0.1, RANGE: 300 })
    const tranformMatrix = createMatrix(tranformSemiVarianceData)
    let A = tranformMatrix
    let b = tranformSemiVarianceData[tranformSemiVarianceData.length - 1].semi
    let w = math.multiply(math.inv(A), b)
    let sum = 0
    for (let i = 0; i < tranformSemiVarianceData.length - 1; i += 1) {
        sum += tranformSemiVarianceData[i].attitude * w[i]
    }

    //res.send(tranformSemiVarianceData)
    res.send({ status: 'success', value: sum })
    // const newNode = {
    //     latitude,
    //     longtitude,
    //     attitude: sum,
    // }

})

app.get('/predict/varriogram', async (req, res) => {
    const AllNode = await Node.findAll() // 31 node
    const findLastNode = await Node.findOne({ where: { id: 31 } })
    const { attitude } = findLastNode
    const formularVariogram = await variogram.findAll()
    const tranformdata = createRangeTable(AllNode)
    formularVariogram.map(({ id, nugget, sill, range }) => {
        console.log('1', nugget, sill, range)
        const tranformSemiVarianceData = tranformSemivariance(tranformdata, { NUGGET: +nugget, SILL: +sill, RANGE: +range })
        console.log('2')
        const tranformMatrix = createMatrix(tranformSemiVarianceData)
        console.log('3')
        let A = tranformMatrix
        let b = tranformSemiVarianceData[tranformSemiVarianceData.length - 1].semi
        let w = math.multiply(math.inv(A), b)
        console.log('4')

        let sum = 0
        for (let i = 0; i < tranformSemiVarianceData.length - 1; i += 1) {
            console.log('5')

            sum += tranformSemiVarianceData[i].attitude * w[i]
        }
        const createPredict = {
            zpredict: sum,
            estimation: Math.abs(+attitude - +sum),
            varioId: id,
            node: findLastNode.id,
            predictError: w.reduce((current, next) => current += next)
        }
        console.log(createPredict)
        //sum z predict
        //estimate  attitude-zpredict
        //varioid = id
        //node  id =findLastNode.id
        //predictError w+
    })
    res.send({ status: 'success' })
})
app.post('/create/variogram', async (req, res) => {

    const { nugget, sill, range } = req.body
    const newNode = {
        nugget,
        sill,
        range
    }
    // await Node.create(newNode) //create node  // TODO HERE

    const tranformdata = await variogram.create(newNode)
    res.send({ status: 'success' })
    //1. req.body
    //create Database variogram
    //ressponse  กลับมา
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
