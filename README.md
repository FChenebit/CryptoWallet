# CryptoWallet

This is a small node program, that is supposed to run on heroku. It will provide user with the amount of a his cryptocurrency wallet, by sending an email everyday, or when over a threshold.

It is also the support of a medium article : 

environment variable to set are : 

    //SMTP server to send mail from, from and to address
    export HOST_SMTP=XXX
    export PORT_SMTP=587
    export USER_SMTP=XXX
    export PASS_SMTP=XXX
    export FROM=XXX
    export TO=XXX

    // environment (DEVELOPPEMENT on local, PRODUCTION on heroku)
    export ENVIRONMENT=DEVELOPPEMENT

    //key for coin market API
    export CMC_PRO_API_KEY=XXX

    //Amount of cryptocurrencies possesed
    export BTC=0.0XXX
    export XRP=NNN
    export ETH=NNN
    export NMR=NNN
    export DATA=NNN
    export UBT=NNN
    export NIM=NNN
    export COS=NNN
    export ALERT_THRESHOLD=8000

    //local database URL
    export DATABASE_URL=XXX
