You can Setup one or multiple Database Connections in this Modul.

```javascript
const DatabasePool = require('sequelize-base-model').DatabasePool;

let _db = new DatabasePool();
_db.addConnection('mypostgresdb', {
    dbname: 'demo',
    user: 'postgres',
    password: 'postgres',
    options: {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432
    }
});

// open a Connection
_db.connectTo('mypostgresdb');
// get the Sequelize Instance
_db.getInstance('mypostgresdb');
// close Connection
_db.removeConnection('mypostgresdb');
```

When you do this multiple times you can add every Sequelize Connection to Pool you want. You also can use different drivers.