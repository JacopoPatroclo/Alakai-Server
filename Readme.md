# Starter 4 master

Uno starter per Nodejs con setup per Auth0, Express, Graphql e REST inclusi Mocha e Chai

## Cominciamo

Si tratta di uno starter, una linea guida implementativa su come (a parer mio) un progetto dovrebbe partire. Per quanto riguarda
le tecnologie utilizzate ecco un elenco:

* [Express](http://expressjs.com/) - Questo è bello famoso
* [Auth0](https://auth0.com/) - E' un sistema di autenticazione as a service, non è necessario utilizzarlo, è solo comodo
* [Graphql](https://graphql.org/) - L'assassino di REST per quanto mi riguarda
* [Mocha](https://mochajs.org/) - Framework per il testing
* [Chai](https://graphql.org/) - Assertion library che aiuta a scrivere test piu in fretta

Consiglio prima di buttarsi nello sviluppo di leggersi un paio di cose su [Nodejs](https://nodejs.org/it/docs/)

### Prerequisiti

Cosa serve aver installato per sfruttare al meglio questo starter:

* [Nodejs](https://nodejs.org/it/docs/)
* [npm](https://www.npmjs.com/)

### Installazione

Per quanto riguarda il setup di un enviroment di sviluppo è necessario clonare questa repo in una cartella ed aprire un terminale
nella root di essa digitanto

```
npm intall
```

Per far si che npm intalli le dipendenze, a questo punto per lanciare in modalità sviluppo il server

```
npm run dev
```

A questo punto, salvo messaggi di errore il server dovrebbe essere in ascolto sulla porta di default che è la 3000

## Lanciare i test

Per lanciare i test e contemporaneamente eslint usare 

```
npm run test
```

Se si vuole lanciare singolarmente uno dei due basta utilizzare

```
npm run lint
```

per il linter e 

```
npm run only-test
```

per i test

### Struttura

La strutturazione del progetto è cio di cui vale veramente la pena parlare, l'intera codebase risiede all'interno di /server mentre la totalità dei test all'interno dell'omonima cartella /test.

All'interno di /server troviamo il file index.js che si occupa del setup e dell'esportazione dell'applicazione express, nonche del primo livello di Routing. Da notare che qui viene settato il middleware che si occupa dell'handling degli errori lanciati all'interno dei middleware precedenti (di fatto tutti). Questo permette una centralizzazione degli errori e permette di mantenere sempre online l'applicativo, infatti se in un middleware viene lanciato un throw, express raccoglierà questo errore passandolo al middleware sopracitato,
dando sempre, anche in caso di bug gravi, una risposta.

## Deployment

Di fatto cio che andrebbe deployato di questa struttura sono i soli file contenuti in server, il file index.js nella root e il package.json.

## CI/CD

Questo starter è utilizzato dal sottoscritto per svariati progetti lavorativi ed il nostro team utilizza CI/CD come metodologia di sviluppo
e controllo qualità. Quindi questo starter è CI/CD proof


## Versionamento

Ogni Branch aggiungerà le features che indica.

## Autori

* **Jacopo Martinelli** - *Initial work* - [JacopoPatroclo](https://github.com/JacopoPatrocloMartinelli)

## Licenza

Questo progetto è MIT
