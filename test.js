let prod = [
    {id:1,x:428568.6913,y:872921.7377,z:30},
    {id:2,x:428646.7539,y:872900.0566,z:30},
    {id:3,x:428548.8841,y:872904.5756,z:31}
  ]
  let newprod = {id:4,x:428532.2718,y:872881.4383}
  
  
  const setNewData =(prod =[] )=>{
   return prod.reduce((acc,current)=>{
      return  [
        ...acc,
        {
        id:current.id,
         x:current.x,
         y:current.y,
         range:prod.reduce((acc,next)=>{
          return [
            ...acc,
           Math.sqrt(Math.pow(current.x-next.x,2)+Math.pow(current.y-next.y,2))
          ]
        },[])
        }
      ]
    },[])
  }
  console.log(setNewData(prod))
  prod =  [
    ...prod,
    newprod,
  ]
  let updateProd = setNewData(prod)