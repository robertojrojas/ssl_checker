const https = require('https');

class Server {

    connect(serverConfig, caCertFile, callback) {
        const options = {
          hostname: serverConfig.host,
          port: serverConfig.port,
          path: serverConfig.path,
          method: 'GET',
          ca: caCertFile,
          timeout: serverConfig.timeout
        };

        // Happy Path
        const req = https.request(options, (res) => {
          callback(null, req.socket.getPeerCertificate());
        });

        // Not So Happy Path
        req.on('error', (e) => {
          callback(e);
        });

        // Go!
        //console.error("Connecting to: ", options);
        req.end();
    }

}


module.exports = new Server();
