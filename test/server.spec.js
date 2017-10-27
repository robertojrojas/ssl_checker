const assert   = require('assert')
      ,https   = require('https')
      ,fs      = require('fs')
      ,pem     = require('pem')
      ,server  = require('../lib/server')
    ;


describe('Server', function () {
    describe('connect', function () {
      it('Should return certificate', function (done) {
         generateCertficate(1, function (certInfo) {
		          startServer(certInfo, 0, function(sslServer) {
                 let srvCfg = {
                   host: "localhost",
                   port:  sslServer.address().port,
                   timeout: 5000,
                   path: "/"
                 };
                 server.connect(srvCfg, certInfo.ca, function(err, certificate) {
                     let callServerShutdown = function() {
                       sslServer.close(function () { done(); });
                     }
                     if (err) {
                       callServerShutdown();
                       throw err
                     }
                     assert.notStrictEqual(null,certificate);
                     callServerShutdown();

                 });
             });
		     });
      });

      it('Should not return a certificate', function (done) {
        generateCertficate(1, function (certInfo) {
            startServer(certInfo, 0, function(sslServer) {
                let srvCfg = {
                  host: "localhost",
                  port:  sslServer.address().port,
                  timeout: 5000,
                  path: "/"
                };
                server.connect(srvCfg, certInfo.key, function(err, certificate) {
                    sslServer.close(function () { done(); });
                    assert.strictEqual(undefined,certificate);
                });
            });
        });
      });
    });
});

function startServer(certInfo, port, callback) {
  const options = {
   key: certInfo.key,
   cert: certInfo.cert
  };

  let sslServer = https.createServer(options, (req, res) => {
    //console.log("Hey a client!");
    res.writeHead(200);
    res.end('Testing SSL\n');
  }).listen(port);

  sslServer.on('listening', function(){
    //console.log('port: ', sslServer.address().port);
    callback(sslServer);
  });

  sslServer.on('close', function(){
  });



}

function generateCertficate(expiresInDays, callback){
  pem.createCertificate({ days: expiresInDays, selfSigned: true }, function (err, keys) {
    if (err) {
       throw err
    }
    let certInfo = {
      key: keys.serviceKey,
      cert: keys.certificate,
      ca: keys.certificate
     };
     callback(certInfo);
  });

}
