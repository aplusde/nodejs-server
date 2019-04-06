let user  = {
    name:'John',
    surname:'do',
    age:12,
    parent:[
      {
        type:'Mother',
        name:'jones',
        surname:'do'
      },
      {
        type:'Father',
        name:'steve',
        surname:'do'
      }
    ],
  job :'student',
  salary:0,
}
console.log('job',user.job)
console.log('salary',user.salary)
user.job = 'programmer'
console.log('newjob',user.job)
user.salary = 15000
user.parent[0].name ='cara'
user.sonNumber = 0
console.log(user)
user.car ='BMW'
console.log(user)
user.parent = [
...user.parent,
{
type:'brother',
name:'tor',
surname:'do'
}
]
console.log(user)
const multiplex= function(firstnumber,secondnumber){
return firstnumber*secondnumber
}
multiplex(2,3)

const arrowMultiplex = (firtNum,secondNum)=>{
return firtNum*secondNum
}
arrowMultiplex(2,3)

const testExe = ()=>{
let user =  'aaa'
return  user
}
testExe()

let str = 'tester'
str.split('') //array
str.replace('t','s')

let number  = [1,2,3,4,5,6,8,9]
number.sort((a,b)=>b-a)

for(let i =0 ; i<number.length ; i+=1){
console.log(number[i])
}
console.log('brake')
console.log('testx')
