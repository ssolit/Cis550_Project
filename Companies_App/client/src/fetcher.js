import config from './config.json'

const getCompany = async (id) => {
    //var res = await fetch(`http://${config.server_host}:${config.server_port}/company/${id}`, {
    var res = await fetch(`http://localhost:8081/company/${id}`, {    
        method: 'GET',
    })
    return res.json()
}

export {
    getCompany
}