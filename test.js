const math = require('mathjs')
let prod = [
  { id: 1, x: 428568.6913, y: 872921.7377, z: 30 },
  { id: 2, x: 428646.7539, y: 872900.0566, z: 30 },
  { id: 3, x: 428548.8841, y: 872904.5756, z: 31 },
  { id: 4, x: 428518.0068, y: 872919.8637, z: 32 },
  { id: 5, x: 428553.0826, y: 872855.9671, z: 32 },
  { id: 6, x: 428482.907, y: 872919.6548, z: 33 },
  { id: 7, x: 428534.4663, y: 872848.3179, z: 33 },
  { id: 8, x: 428646.3654, y: 872812.1907, z: 33 },
  { id: 9, x: 428460.3046, y: 872921.5127, z: 34 },
  { id: 10, x: 428469.2297, y: 872878.4219, z: 34 },
  { id: 11, x: 428469.6302, y: 872877.147, z: 34 },
  { id: 12, x: 428436.697, y: 872920.7764, z: 35 },
  { id: 13, x: 428384.4791, y: 872922.5208, z: 36 },
  { id: 14, x: 428448.9284, y: 872873.0868, z: 36 },
  { id: 15, x: 428516.8357, y: 872717.7956, z: 36 },
  { id: 16, x: 428619.246, y: 872733.5326, z: 36 },
  { id: 17, x: 428450.8906, y: 872772.0418, z: 36 },
  { id: 18, x: 428513.3743, y: 872799.3481, z: 35 },
  { id: 19, x: 428539.8487, y: 872826.5365, z: 34 },
  { id: 20, x: 428628.6253, y: 872809.4068, z: 32 },
  { id: 21, x: 428620.5551, y: 872807.1439, z: 33 },
  { id: 22, x: 428600.3184, y: 872793.2637, z: 35 },
  { id: 23, x: 428530.1414, y: 872887.0892, z: 30.453 },
  { id: 24, x: 428636.8825, y: 872804.3883, z: 33 },
  { id: 25, x: 428632.8345, y: 872798.1991, z: 34 },
  { id: 26, x: 428478.7595, y: 872882.4471, z: 33 },
  { id: 27, x: 428467.1532, y: 872885.3028, z: 34 },
  { id: 28, x: 428437.5301, y: 872888.0202, z: 36 },
  { id: 29, x: 428468.4676, y: 872717.8377, z: 36 },
  { id: 30, x: 428628.628, y: 872742.6148, z: 36 }
]
let newprod = { id: 31, x: 428532.2718, y: 872881.4383 }


const setNewData = (prod = []) => {
  return prod.reduce((acc, current) => {
    return [
      ...acc, //round 1 [] //round 2[{id:1,x:1,y2,rage:[...value]}] rund 3 [{..},{..}]
      {
        id: current.id,
        x: current.x,
        y: current.y,
        z: current.z,
        range: prod.reduce((acc, next) => {
          return [
            ...acc,
            Math.sqrt(Math.pow(current.x - next.x, 2) + Math.pow(current.y - next.y, 2))
          ]
        }, [])
      }
    ]
  }, [])
}
console.log(setNewData(prod)) //30 nodes

const NUGGET = 0
const SILL = 0.1
const RANGE = 300

const getSemiValian = (node = []) => node.reduce((acc, current) => {
  return [
    ...acc, //round 1 [] //round 2[{id:1,x:1,y2,rage:[...value]}] rund 3 [{..},{..}]
    {
      id: current.id,
      x: current.x,
      y: current.y,
      z: current.z,
      //  range:current.range,
      semi: current.range.reduce((acc, rangeValue) => {
        if (acc.length === current.range.length - 1) {
          return [
            ...acc,
            1,
          ]
        } else if (rangeValue === 0) {
          return [
            ...acc,
            rangeValue,
          ]
        } else {
          return [
            ...acc,
            NUGGET + (SILL * (1 - Math.exp(-rangeValue / RANGE)))
          ]
        }
      }, [])
    }
  ]
}, [])
//[[1,2,3,4,5]//node1
//  [1,2,3,4,5]//node2]
//console.log(setNewData(prod)) //30 nodes
prod = [
  ...prod,
  newprod,
] //update pord
let updateProd = setNewData(prod) //31 nodes
//console.log(updateProd)
let seminivalue = getSemiValian(updateProd)
// console.log(JSON.stringify(seminivalue))

let matrix = seminivalue.reduce((array, next) => {
  return [
    ...array,
    next.semi.reduce((prev, value) => {
      if (array.length === seminivalue.length - 1) {
        if (prev.length === seminivalue.length - 1) {
          return [
            ...prev,
            0
          ]
        }
        return [
          ...prev,
          1
        ]
      }
      return [
        ...prev,
        value,
      ]
    }, [])
  ]
}, [])
let A = matrix
let b = seminivalue[seminivalue.length - 1].semi
let w = math.multiply(math.inv(A), b)
let sum = 0
for (let i = 0; i < seminivalue.length - 1; i += 1) {
  sum += seminivalue[i].z * w[i]
}
sum
