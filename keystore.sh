##openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -subj '/CN=localhost'
openssl req -newkey rsa:2048 -subj '/CN=localhost' -nodes -keyout key.pem -x509 -days 365 -out certificate.pem
openssl x509 -text -noout -in certificate.pem
openssl pkcs12 -inkey key.pem -in certificate.pem -export -out dbmoncert.p12
openssl pkcs12 -in dbmoncert.p12 -noout -info

keytool -genkeypair  -keystore dbmon.jks
##### keytool -importcert -alias dbmon -file dbmoncert.p12 -keystore dbmon.jks

keytool -importkeystore -srckeystore dbmoncert.p12 -srcstoretype PKCS12 -destkeystore dbmon.jks


