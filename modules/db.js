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
        hostname: 'sql4.freemysqlhosting.net',
        username: 'sql4455968',
        password: 'zyAGaM9PYx',
        db: 'sql4455968',
        poolSize: 3
    }
}

const conn = connectionData[home]
console.log(conn)

//const db = await new Client().connect(conn)
const db = await new Client().connect({
    hostname: 'sql4.freemysqlhosting.net',
    username: 'sql4455968',
    password: 'zyAGaM9PYx',
    db: 'sql4455968',
    poolSize: 3
});

export { db }