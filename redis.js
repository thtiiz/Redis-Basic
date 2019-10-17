const { promisify } = require('util')
const redis = require('redis')
const client = redis.createClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = { set, get }