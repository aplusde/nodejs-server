export default (prod = []) => {
  return prod.reduce((acc, current) => {
    return [
      ...acc,
      {
        id: current.id,
        latitude: current.latitude,
        longtitude: current.longtitude,
        distance: prod.reduce((acc, next) => {
          return [
            ...acc,
            Math.sqrt(Math.pow(current.latitude - next.latitude, 2) + Math.pow(current.longtitude - next.longtitude, 2))
          ]
        }, [])
      }
    ]
  }, [])
}