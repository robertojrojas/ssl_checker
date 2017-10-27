const assert      = require('assert')
      ,moment      = require('moment')
      ,sslChecker    = require('../lib/sslChecker')
    ;


describe('SSLChecker', function () {
    describe('sslCertificateAboutToExpire', function () {
      it('Should return true if certificate expires in 5 days', function () {
         let fiveDaysLater = moment().add(5, 'days');
         let mycert = {
             valid_to: fiveDaysLater.format("MMM DD HH:mm:ss YYYY GMT")
         };
         let certExpired = sslChecker.sslCertificateAboutToExpire(mycert, 5);
         assert.equal(true, certExpired, "but did not work!");
      });

      it('Should return false if certificate does not expires in 5 days', function () {
         let fiveDaysLater = moment().add(6, 'days');
         let mycert = {
             valid_to: fiveDaysLater.format("MMM DD HH:mm:ss YYYY GMT")
         };
         let certExpired = sslChecker.sslCertificateAboutToExpire(mycert, 5);
         assert.equal(false, certExpired);
      });
    });

    describe('checkCertifcate', function () {
      it('Should return server info if certificate expires in 5 days', function (done) {
         let fiveDaysLater = moment().add(5, 'days');
         let mycert = {
             valid_to: fiveDaysLater.format("MMM DD HH:mm:ss YYYY GMT")
         };
         let serverInfo = {
           host: "host",
           port: 8080
         }
         let expectedServerInfo = {
             serverConf: serverInfo,
             ssl_certificate: {
                subject: undefined,
                issuer: undefined,
                valid_to: mycert.valid_to,
                valid_from: undefined,
                serialNumber: undefined
             }};
         sslChecker.checkCertifcate(serverInfo, mycert, 5, function(err, retInfo){
           assert.strictEqual(expectedServerInfo.serverConf, retInfo.serverConf);
           assert.strictEqual(expectedServerInfo.valid_to, retInfo.valid_to);
           done();
         });
      });

      it('Should Not return server info if certificate has not expired', function (done) {
         let daysLater = moment().add(30, 'days');
         let mycert = {
             valid_to: daysLater.format("MMM DD HH:mm:ss YYYY GMT")
         };
         let serverInfo = {
           host: "host",
           port: 8080
         }
         sslChecker.checkCertifcate(serverInfo, mycert, 5, function(err, retInfo){
           assert.strictEqual(null, retInfo);
           done();
         });
      });
    });
});
