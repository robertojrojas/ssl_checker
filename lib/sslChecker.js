const   moment = require('moment')
         ;

class SSLChecker {

    checkCertifcate(serverConfig, certificate, cb) {
      if (this.sslCertificateAboutToExpire(certificate, this.sslExpiresIn)) {
        cb(null, {
            serverConf: serverConfig,
            ssl_certificate: {
              subject: certificate.subject,
              issuer: certificate.issuer,
              valid_from: certificate.valid_from,
              valid_to: certificate.valid_to,
              serialNumber: certificate.serialNumber
            }
        });
      } else {
        cb(null, null);
      }
    }

    sslCertificateAboutToExpire(sslCertificate, daysInTheFuture) {
        var certValidUntil = moment(sslCertificate.valid_to, "MMM DD HH:mm:ss YYYY GMT");
        var expirationDateTarget = moment().add(daysInTheFuture, 'd');
        return certValidUntil <= expirationDateTarget;
    }
}


module.exports = new SSLChecker();
