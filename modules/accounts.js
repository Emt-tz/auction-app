
/* accounts.js */

import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'

import { db } from './db.js'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function loginToApi(data) {
	let sql = `SELECT count(id) AS count FROM users WHERE user_name="${data.username}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${data.username}" not found`)
	sql = `SELECT user_password FROM users WHERE user_name ="${data.username}";`
	records = await db.query(sql)
    if(data.password == records[0].user_password){
      return data.username
    }else{
        throw new Error(`invalid password for account "${data.username}"`)
    }

}

// export async function register(data) {
// 	const password = await hash(data.password, salt)
// 	const sql = `INSERT INTO accounts(user, pass) VALUES("${data.username}", "${password}")`
// 	console.log(sql)
// 	await db.query(sql)
// 	return true
// }


export async function login(username, password, ctx) {
    let sql = `SELECT * FROM users WHERE user_name='${username}'`;
    try {
        let data = await db.query(sql)
        if (data.length != 0) {
            if (username == data[0].user_name && password == data[0].user_password) {
                ctx.response.status = 200
                ctx.response.body = { message: data[0] }
            } else {
                ctx.response.status = 200
                ctx.response.body = { message: "invalid credentials" }
            }
        } else {
            ctx.response.status = 200
            ctx.response.body = { message: "user does not exist" }
        }
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = { error: `internal server error ${e}` }
    }

};



//function register a new user
export async function registerNewUser(username, phone, password, email, req, res) {
    //sql insert query 
    let sql = `
                                INSERT INTO users(user_name, user_phone, user_password, user_email, user_img) VALUES('${username}', '${phone}', '${password}', '${email}', "")
                                `
    db.query(sql, (err, data) => {
        if (err) {
            req.flash('message', 'error!!')
            res.redirect("/register");
        } else {
            req.flash('message', 'Success!!')
            res.redirect("/login")
        }
    })

}
