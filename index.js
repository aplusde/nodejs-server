const express = require('express')
const app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let user  = [
    {id:1,name:'john',surname:'do',job:'programmer',salary:12000},
]
app.get('/', (req,res)=>{
    res.send('helloworld')
})

app.get('/user', (req,res)=>{
    res.send(user)
})

app.post('/user/post',(req,res)=>{
   let name = req.body.name;
   let surname = req.body.surname;
   let job = req.body.job;
   let salary = req.body.salary;
   user= [
       ...user,
        {
            id:user.length+1,
            name,
            surname,
            job,
            salary
        }
   ]
    res.send(user)
})
app.put('/user/:id',(req,res)=>{
    let name = req.body.name;
    let id = +req.params.id

    let  userId = user.find((value)=>{
        console.log(value)
        console.log(typeof value.id)
        console.log(typeof +req.params.id)
        return value.id === id
    })
    userId.name=name
    user[id-1] =userId;
    res.send(userId)
})

app.get('/user/:id',(req,res)=>{
    //localhost:3000/1  paramas = 1;
    let  userId = user.find((value)=>{
        console.log(value)
        console.log(typeof value.id)
        console.log(typeof +req.params.id)
        return value.id === +req.params.id
    })
    console.log(req.params.id)
    console.log(userId)
    res.send(userId)
})

app.listen(5000,()=>{
    console.log('server listen on port 5000')
})

