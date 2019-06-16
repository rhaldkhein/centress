const Server = require('./server')

module.exports = services => {

  services.addSingleton(Server)

}