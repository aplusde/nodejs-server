const express = require('express')
const app = express()
var bodyParser = require('body-parser')
import math from 'mathjs'

import { Node, range,variogram,predict } from './models'
import createRangeTable from './functionHandler/createRangeTable'
import tranformSemivariance from './functionHandler/tranformSemivariance'
import createMatrix from './functionHandler/createMatrix'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let user = [
    { id: 1, name: 'john', surname: 'do', job: 'programmer', salary: 12000 },
]

app.get('/getallnode', async (req, res) => {
    const nodeData = await Node.findAll()
    res.send(nodeData)
})


app.post('/create/node/array', async (req, res) => {
    const { example = [] } = req.body 
    try {
        example.map(async data => await Node.create(data))
        res.send({ status: 'success' })

    } catch (e) {
        res.send({ status: 'error' })
    }
})

app.post('/node/create-with-attitude', async (req, res) => {
    const { latitude, longtitude, attitude } = req.body
    const newNode = {
        latitude,
        longtitude,
        attitude,
    }
    await Node.create(newNode)
    const nodeDatas = await Node.findAll()
    const tranformdata = createRangeTable(nodeDatas)
    // tranformdata.map(async ({ id, distance }) => {
    //     distance.map(async (rangeValue, index) => {
    //         range.findOrCreate({ where: { nodeId: id, rangeFromNode: index + 1 }, defaults: { range: rangeValue } })
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
        sum += tranformSemiVarianceData[i].attitude * w[i]
    }
    const error =math.sum(math.dotMultiply(tranformSemiVarianceData[tranformSemiVarianceData.length-1].semi,w))
    const predictData = {
        varioId:1,
        zpredict:sum,
        estimation:Math.abs(attitude-sum),
        predictError:error
    }
    await predict.create(predictData)
    res.send({ status: 'success', value: sum,error })
})
app.post('/semivariogram/create',async (req,res)=>{
    const {nugget,sill,range} = req.body
    await variogram.create({nugget,sill,range})
    const nodeDatas = await Node.findAll()
    const getAllVariogram = await variogram.findAll()
    console.log(getAllVariogram)
    getAllVariogram.map(async ({ id , nugget,sill,range})=>{
        const tranformdata = createRangeTable(nodeDatas)
        const tranformSemiVarianceData = tranformSemivariance(tranformdata, { NUGGET: +nugget, SILL: +sill, RANGE: +range })
        const tranformMatrix = createMatrix(tranformSemiVarianceData)
        let A = tranformMatrix
        let b = tranformSemiVarianceData[tranformSemiVarianceData.length - 1].semi
        let w = math.multiply(math.inv(A), b)
        let sum = 0
        for (let i = 0; i < tranformSemiVarianceData.length - 1; i += 1) {
            sum += tranformSemiVarianceData[i].attitude * w[i]
        }
        const error =math.sum(math.dotMultiply(tranformSemiVarianceData[tranformSemiVarianceData.length-1].semi,w))
        const {attitude} = nodeDatas[nodeDatas.length-1]
        predict.findOrCreate({where:{varioId:id}, defaults:{
            zpredict:sum,
            estimation:Math.abs(attitude-sum),
            predictError:error,
        }}
        )
    })
    const getAllPredict = predict.findAll()
    res.send({data:getAllPredict})    
})

app.get('/node/create-with-best-semivariogram',async(req,res)=>{
   const min = await predict.min('estimation')
   const predicte = await predict.findOne({where:{estimation:min}})
   console.log(predicte)
   res.send({data:predicte})
})

app.listen(5000, () => {
    console.log('server listen on port 5000')
})
