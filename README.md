# ssl_checker
A simple nodejs app to check SSL/TLS certificate expiration on servers.

Sample ServerConfig file:

```
10.0.1.211,6443,5000,/
10.0.1.212,6443,5000,/
10.0.1.213,6443,5000,/
```

Run
```
node ssl_checker.js servers.conf ca.pem
```
