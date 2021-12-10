/* routes.js */
import { Router } from 'https://deno.land/x/oak@v6.5.1/mod.ts'
import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts'
import { upload } from "https://deno.land/x/oak_upload_middleware@3.0/mod.ts";
import { login, registerNewUser, loginToApi } from './modules/accounts.js'
import { addNewItem, updateMyItem, getItemDetails, getMyItems, getAllAuctionItemsWithStatusNotSold, placeNewBid, getCurrentBids, getAllItems, getBidResults } from './modules/items.js';


const handle = new Handlebars({ defaultLayout: '' })
const router = new Router()

// the routes defined here
router.get('/', async context => {
    context.cookies.delete('authorised')
    const body = await handle.renderView('login')
    context.response.body = body
})

router.get('/login', async context => {
    context.cookies.delete('authorised')
    const body = await handle.renderView('login')
    context.response.body = body
})

router.get('/register', async context => {
    const body = await handle.renderView('register')
    context.response.body = body
})

router.post('/register', async context => {
    console.log('POST /register')
    const body = context.request.body({ type: 'form' })
    const value = await body.value
    const obj = Object.fromEntries(value)
    console.log(obj)
    await register(obj)
    context.response.redirect('/login')
})

router.post('/login', async context => {
    const body = context.request.body({ type: 'form' })
    const value = await body.value
    const obj = Object.fromEntries(value)
    try {
        const username = await loginToApi(obj)
        context.cookies.set('authorised', username)
        context.response.redirect('/api')
    } catch (err) {
        console.log(err)
        context.response.redirect('/login')
    }
})

router.get('/itemdetails', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    const body = await handle.renderView('item_details')
    context.response.body = body
})

router.get('/api', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    const body = await handle.renderView('api', data)
    context.response.body = body
})


router.get('/api/login', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    let req = context.request.url.searchParams
    let username = req.get('username')
    let password = req.get('password')
    await login(username, password, context)
})

router.post('/api/newitem', upload('/public/uploads'), async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    const file = context.uploadedFiles;
    let img_url = file.file.id + "/" + file.file.filename;
    let req = context.request.url.searchParams
    let name = req.get('name')
    let item_name = req.get('itemname')
    let item_description = req.get('itemdescription')
    await addNewItem(context, img_url, name, item_name, item_description)
})

router.get('/api/allitems', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    await getAllItems(context)
})

router.get('/api/items', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    let req = context.request.url.searchParams
    let seller_name = req.get("name")
    await getMyItems(context, seller_name)
})

router.get('/api/update/item', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    let req = context.request.url.searchParams
    let itemid = req.get("id")
    await updateMyItem(context, itemid)
})

router.get('/api/itemdetails', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    await getItemDetails(context, data)
})

router.get('/api/getbids', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    let req = context.request.url.searchParams
    let item_name = req.get("name")
    await getCurrentBids(context, item_name)
})

router.get('/api/bid', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    let req = context.request.url.searchParams
    let bid = req.get("bid")
    let item = req.get("name")
    let userid = authorised
    await placeNewBid(context, bid, item, userid)
})


router.get('/api/bid/results', async context => {
    const authorised = context.cookies.get('authorised')
    if (authorised === undefined) context.response.redirect('/login')
    const data = { authorised }
    let req = context.request.url.searchParams
    let item = req.get("name")
    let userid = req.get("user");
    await getBidResults(context, item, userid)
})



export default router