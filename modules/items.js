import { db } from './db.js'


export async function getBidResults(ctx, item_name, bidder_name) {
    let currentBidsSql = `SELECT MAX(bid_amount),bidder_name FROM bids WHERE item_name="${item_name}"`
    try {
        let result = await db.query(currentBidsSql)
        console.log(result)
        if (result.length != 0 && result[0].bidder_name != null) {

            if (result[0].bidder_name != bidder_name) {
                ctx.response.status = 200
                ctx.response.body = {
                    response: `you are outbid by ${result[0].bidder_name}`
                }

            } else {
                ctx.response.status = 200
                ctx.response.body = {
                    response: {
                        message: "you won the bid congratulations",
                        details: result
                    }

                }
            }
        } else {
            ctx.response.status = 200
            ctx.response.body = {
                bids: "seems items not found or no bids yet"
            }
        }
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = { error: `Error: ${e}` }
    }
}
export async function getCurrentBids(ctx, item_name) {
    let currentBidsSql = `SELECT * FROM bids WHERE item_name="${item_name}"`
    try {
        let result = await db.query(currentBidsSql)
        if (result.length != 0) {
            ctx.response.status = 200
            ctx.response.body = {
                bids: result
            }
        } else {
            ctx.response.status = 200
            ctx.response.body = {
                bids: null
            }
        }
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = { error: `no bids yet` }
    }
}

export async function placeNewBid(ctx, bid, item, userid) {
    //check for item validity
    let checkItemValidity = `SELECT * FROM auction_items WHERE item_name="${item}"`;

    let resultforitem = await db.query(checkItemValidity)
    if (resultforitem.length == 0) {
        ctx.response.status = 200
        ctx.response.body = {
            error: "No such item"

        }
    } else {
        let insertNewBid = `INSERT INTO bids(item_name, bidder_name,bid_amount)VALUES("${item}","${userid}",${bid})`
        try {
            let result = await db.query(insertNewBid)
            ctx.response.status = 200
            ctx.response.body = {
                bids: {
                    item: `${item}`,
                    bidder: `${userid}`,
                    bid_amount: `${bid}`
                }
            }
        } catch (e) {
            ctx.response.status = 500
            ctx.response.body = { error: `no bids yet` }
        }
    }

}
export async function getAllAuctionItemsWithStatusNotSold(req, res) {
    //status one show not sold
    var sql = "SELECT * FROM auction_items WHERE status=1";
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.render('home', { title: 'Welcome', userData: data });
    });
}
export async function getAllItems(ctx) {
    let sql = `SELECT * FROM auction_items`;
    try {
        let data = await db.query(sql)
        ctx.response.status = 200
        ctx.response.body = {
            items: data
        }
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = { error: `Error:${e}` }
    }
}

export async function getMyItems(ctx, seller_name) {
    let sql;
    if (seller_name == "") {
        sql = `SELECT * FROM auction_items`;
    } else {
        sql = `
        SELECT * FROM auction_items WHERE seller_name = '${seller_name}'
        `;
    }
    try {
        let data = await db.query(sql)
        ctx.response.status = 200
        ctx.response.body = {
            items: data
        }

    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = { error: `Error:${e}` }
    }
}
export async function getItemDetails(ctx) {
    let req = ctx.request.url.searchParams
    let sql = `
        SELECT * FROM auction_items WHERE id = '${req.get("name")}'
        `;

    //fetch user details here
    try {
        let getuser = await db.query(sql);

        let userdetails = `
        SELECT * FROM users WHERE user_name = '${getuser[0].seller_name}'
        `;
        let itembids = `
        SELECT * FROM bids WHERE item_name = '${req.get("name")}'
        `;


        try {
            let sellerdetails = await db.query(userdetails)
            let biditemdata = await db.query(itembids)
            let data = await db.query(sql)
            ctx.response.status = 200
            ctx.response.body = {
                items: {
                    itemdetails: data,
                    seller: sellerdetails[0].user_name,
                    contact: sellerdetails[0].user_phone,
                    email: sellerdetails[0].user_email,
                    bid: biditemdata,
                }
            }

            // res.render('productDetails', { title: 'Item Details', userData: data, sellerdetails: sellerdetails, bid: biditemdata });
        } catch (e) {
            ctx.response.status = 500
            ctx.response.body = { error: `Error:${e}` }
        }
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = {
            error: `Error: ${e}`
        }
    }

}

export async function updateMyItem(ctx, item) {
    let updateItemStatus = `
        UPDATE auction_items SET status = 0 WHERE id ='${item}'
        `;
    let updateditem = `SELECT * FROM auction_items WHERE id='${item}'`;
    try {
        let data = await db.query(updateItemStatus)
        let newdata = await db.query(updateditem)
        ctx.response.status = 200
        ctx.response.body = {
                message: {
                    update: "successfull",
                    newdata: newdata,
                }
            }
            // res.render('productDetails', { title: 'Item Details', userData: data, sellerdetails: sellerdetails, bid: biditemdata });
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = { error: `Error:${e}` }
    }

};

export async function addNewItem(ctx, img_src, name, item_name, item_description) {
    let req = ctx.request.url.searchParams
        //we need to capture date and time 
    let date_ob = new Date()

    //current date 
    let datetoday = ("0" + date_ob.getDate()).slice(-2)
        // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)

    // current year
    let year = date_ob.getFullYear()

    // current hours
    let hours = date_ob.getHours()

    // current minutes
    let minutes = date_ob.getMinutes()

    // current seconds
    let seconds = date_ob.getSeconds()

    let date = year + "-" + month + "-" + datetoday
    let time = hours + ":" + minutes

    let seller_name = name
        // console.log(seller_name);
    if (req.get('file')) {
        console.log("No file upload")
    } else {
        //console.log(req.file.filename)
        var insertData = `INSERT INTO auction_items(seller_name, item_name, item_description, img_src, date, time)VALUES("${seller_name}","${item_name}","${item_description}","${img_src}","${date}","${time}")`
        if (seller_name == "" || item_name == "" || item_description == "" || img_src == "") {
            ctx.response.status = 200
            ctx.response.body = { message: "null values sent" }
        } else {
            try {
                let data = await db.query(insertData)
                ctx.response.status = 200
                ctx.response.body = {
                    message: {
                        "success": {
                            seller: seller_name,
                            item_name: item_name,
                            description: item_description,
                            imgurl: img_src,
                            create_date: date,
                            create_time: time,
                            status: "active"

                        }
                    }
                }
            } catch (e) {
                ctx.response.status = 500
                ctx.response.body = { error: `Error:${e}` }
            }
        }

    }
}