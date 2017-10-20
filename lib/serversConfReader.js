
const fs = require('fs');
const os = require('os');
const SERVER_CONF_COLUMNS = 4;

class ServersConfReader {

    loadFile(filename, callback) {

      try {
        var servers = fs.readFileSync(filename, 'utf-8');
        var lines = servers.split(os.EOL);
        var serverConfigs = [];
        for (var ln in lines) {
            if (lines[ln].length > 0 ) {
              var serverRecord =  lines[ln];
              //console.log(ln, serverRecord);
              var serverInfo = serverRecord.split(',');
              if (serverInfo.length == SERVER_CONF_COLUMNS) {
                 var serverConfig =   new ServerConfig (
                     serverInfo[0],
                     serverInfo[1],
                     serverInfo[2],
                     serverInfo[3]
                   );
                  serverConfigs.push(serverConfig);
              }
            }
         }
         callback(null,serverConfigs);
      }
      catch(exception){
        callback(exception);
      }
      finally {
      }

    }
}

class ServerConfig {
  constructor(host, port, timeout, path){
    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.path = path;
  }
}

module.exports = new ServersConfReader();
