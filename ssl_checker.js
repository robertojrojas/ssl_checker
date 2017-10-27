const https             = require('https'),
      fs                = require('fs'),
      async             = require('async'),
      serversConfReader = require('./lib/serversConfReader'),
      server            = require('./lib/server'),
      sslChecker        = require('./lib/sslChecker'),
      EXPIRE_IN_DAYS    = 5,
      WORKERS           = 4
      ;


class Main {

   constructor() {
     this.serverConf      = process.argv[2];
     this.cacertFilename  = process.argv[3];
     this.sslExpiresIn    = process.argv[4] || EXPIRE_IN_DAYS;
     this.numberOfWorkers = process.argv[5] || WORKERS;
     this.checkRequirements();
   }

    run(callback) {
      var mainThis = this;
      serversConfReader.loadFile(this.serverConf, (err, serverConfigs) => {
          var caCertFile = fs.readFileSync(this.cacertFilename);

          var cbfns = [];
          for (var srvIdx in serverConfigs) {
              let srvCfg = serverConfigs[srvIdx];
              var cbfn = function(cb) {
                server.connect(srvCfg, caCertFile, (err, certificate) => {
                  if (err) {
                    cb(null, {error: err});
                    return;
                  }
                  sslChecker.checkCertifcate(srvCfg, certificate,cb);
                });
              };
              cbfns.push(cbfn);
          }

          async.parallelLimit(cbfns, this.numberOfWorkers, function(err, results) {
            callback(err, results);
          });
      });
    }

    checkRequirements() {
      if (!this.checkFileExists(this.serverConf) || !this.checkFileReadable(this.serverConf)) {
         console.log("Unabele to access server.conf: ", this.serverConf);
         process.exit(1);
      }

      if (!this.checkFileExists(this.cacertFilename) || !this.checkFileReadable(this.cacertFilename)) {
         console.log("Unabele to access CA Certificate: ", this.cacertFilename);
         process.exit(1);
      }
    }

    checkFileExists(filename) {
        return fs.existsSync(filename);
    }

    checkFileReadable(filename) {
      try {
        fs.readFileSync(filename);
        return true;
      }
      catch(exception){
        return false;
      }
    }

}

if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " <server.conf> <ca-cert> [ssl-expires-in] [number-of-worker-threads]");
    process.exit(-1);
}

var main = new Main();
main.run((err, serversWithExpiredCerts) => {
  if (err) {
    console.log("error: ", err);
  } else {
    var servers = [];
    for (var svrIdx in serversWithExpiredCerts) {
      if (serversWithExpiredCerts[svrIdx]) {
        servers.push(serversWithExpiredCerts[svrIdx])
      }
    }
    var output = {};
    if (servers.length > 0) {
      output.servers = servers;
    }
    console.log(JSON.stringify(output));
  }
});
