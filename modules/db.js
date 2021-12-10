/* db.js */

import { Client } from 'https://deno.land/x/mysql/mod.ts'

const home = Deno.env.get('HOME')
console.log(`HOME: ${home}`)

const connectionData = {
    '/home/codio': {
        hostname: '127.0.0.1',
        username: 'root',
        password: 'codio',
        db: 'auction'
    },
    // '/app': {
    //     hostname: 'localhost',
    //     username: 'root',
    //     password: 'password',
    //     db: 'auction'
    // }
    '/app': {
        hostname: 'us-cdbr-east-05.cleardb.net',
    username: 'b827d817e0a819',
    password: 'b5f9a2e6',
    db: 'heroku_d47788496bf122c',
    poolSize: 3
    }
}

const conn = connectionData[home]
console.log(conn)

//const db = await new Client().connect(conn)
const db = await new Client().connect({
    hostname: 'us-cdbr-east-05.cleardb.net',
    username: 'b827d817e0a819',
    password: 'b5f9a2e6',
    db: 'heroku_d47788496bf122c',
    poolSize: 3
});

export { db }
