/* main.js */


function
inithashes() {
    if (location.hash = "#user") {
        getAllItems();
    } else if (location.hash = "#myiItems") {
        getItems();
    } else if (location.hash === "#itemdetails" || location.hash === "#itemdetails?id=14&seller=seller1&item=Lion") {
        getItemDetails();
    }
}

function init() {
    //checking path locations here

    document.addEventListener("DOMContentLoaded", function(event) {

        const showNavbar = (toggleId, navId, bodyId, headerId) => {
            const toggle = document.getElementById(toggleId),
                nav = document.getElementById(navId),
                bodypd = document.getElementById(bodyId),
                headerpd = document.getElementById(headerId)

            // Validate that all variables exist
            if (toggle && nav && bodypd && headerpd) {
                toggle.addEventListener('click', () => {
                    // show navbar
                    nav.classList.toggle('shownav')
                        // change icon
                    toggle.classList.toggle('bx-x')
                        // add padding to body
                    bodypd.classList.toggle('body-pd')
                        // add padding to header
                })
                headerpd.classList.toggle('body-pd')
            }
        }

        showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

        /*===== LINK ACTIVE =====*/
        const linkColor = document.querySelectorAll('.nav_link')

        function colorLink() {
            if (linkColor) {
                linkColor.forEach(l => l.classList.remove('active'))
                this.classList.add('active')
            }
        }
        linkColor.forEach(l => l.addEventListener('click', colorLink))
    });

}

init()

//preview all items
function getAllItems() {
    let textarea = document.getElementById("jsonresult");
    let itemsarea = document.getElementById("homeui");

    let url = `/api/allitems`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = data;
            var htmlresponse = "";
            for (i = 0; i < textedJson.items.length; i++) {
                htmlresponse += `
                <div class="col-4">
                        <div class="card">
    
                            <img class="card-img-top" src="https://auction-deno-app.herokuapp.com/uploads/${textedJson.items[i].img_src}" alt="Card image cap" style="object-fit: contain; width: 100%; height: 200px;">
                            <div class="card-body">
                                <h5 class="card-title">
                                    ${textedJson.items[i].item_name}
                                </h5>
                                <p class="card-text">
                                    Added at:
                                   ${textedJson.items[i].date}
                                </p>
    
                                <p class="card-text text-muted" style="position:absolute;right: 0px;padding-right:10px;">
                                    ${textedJson.items[i].seller_name}
                                </p>
    
                            </div>
                           
                            <div class="text-center">
                                <a target="_blank" href="/itemdetails?id=${textedJson.items[i].id}&seller=${textedJson.items[i].seller_name}&item=${textedJson.items[i].item_name}"><button class="btn btn-primary text-center">More information</button></a>
                            </div>
                       
                            <br>
                        </div>
                    </div>
    </div><br>
                `;
            }

            itemsarea.innerHTML = htmlresponse;

        })


};

//holds variable for the home tab
const userui = `

  <div class="row" id="homeui">
  
  
  </div>
</div>
`
    //=================================================sellitem ui and functions==========================================================
    //sell new item tab
function addNewItem() {

    let username = document.getElementById("userid").value;
    let itemname = document.getElementById("inputName").value;
    let itemdescription = document.getElementById("inputDescription").value;
    let itemimagesrc = document.getElementById("default-btn");
    let textarea = document.getElementById("jsonresult");
//get image source 
let img=itemimagesrc.value.split("\\")
    itemimagesrc = img[2]
    console.log(itemimagesrc)
    //form data 
    var input = document.querySelector('input[type="file"]')
    let filename = document.getElementById('filename')
    let data = new FormData()
    data.append('file', input.files[0])

    let url = `/api/newitem?name=${username}&itemname=${itemname}&itemdescription=${itemdescription}&itemimage=${itemimagesrc}`
    if (filename === "") alert("empty file")
    fetch(url, { method: 'POST', body: data })
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = JSON.stringify(data, undefined, 4);
            textarea.innerHTML = textedJson;
        })

};
//sell new item html content
const newitem = `

<h5>Add new item</h5>
<p style="color: rgb(206, 206, 206)">
    input details to add a new item
</p>
<form class="row g-3" action="/api/newitem" enctype="multipart/form-data" method="post">
    <div class="col-md-12">
        <label for="inputName" class="form-label">Item name</label>
        <input name="item_name" type="text " class="form-control" id="inputName" />
    </div>

    <div class="col-md-12">
        <label for="inputDescription" class="form-label">Description</label>
        <textarea name="item_description" type="text" class="form-control" id="inputDescription"></textarea>
    </div>
    

    <br>
    <div class="col-md-12 text-center">
      <!--  <div class="wrapper text-center">
            <div class="image">
                <img src="" alt="">
            </div>
            <div class="content">
                <div class="icon">
                    <i class="fas fa-cloud-upload-alt" style="color: #0066FF;"></i>
                </div>
                <div class="text">
                    No file chosen, yet!
                </div>
            </div>
            <div id="cancel-btn">
                <i class="fas fa-times"></i>
            </div>
            <div class="file-name" id="filename">
                File name here
            </div>
        </div> -->
        <br>
        <input name="image" id="default-btn" type="file" class="form-control">
<br>
    </div>
    <div>
        <hr>
    </div>
    <br>
</div>


</div>
</div>


</form>
<div class="text-center">
        <a  class="btn btn-primary" style="margin-top:30px;" onclick="addNewItem();">Send new item request</a>
    </div>

<h5>Json Response </h5>
<textarea name="" id="jsonresult" cols="30" rows="10" style="
    width: 100%;
    min-height: 30rem;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 0.8rem;
    line-height: 1.2;
  "></textarea>
`;

//=================================================sellitem ui and functions==========================================================
//change item status to sold for user 
function changeItemStatus(id) {

    let url = `/api/update/item?id=${id}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var textedJson = JSON.stringify(data, undefined, 4);
            alert(textedJson)
        })
}


//get items 
function getItems() {
    let username = document.getElementById("userid").value;
    let textarea = document.getElementById("jsonresult");
    let itemsarea = document.getElementById("myitemsui");
    let url = `/api/items?name=${username}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = data;
            var html = "";
            for (i = 0; i < textedJson.items.length; i++) {
                html += `
                <div class="col">
                        <div class="card">
    
                            <img class="card-img-top" src="https://auction-deno-app.herokuapp.com/uploads/${textedJson.items[i].img_src}" alt="Card image cap" style="object-fit: contain; width: 100%; height: 200px;">
                            <div class="card-body">
                                <h5 class="card-title">
                                    ${textedJson.items[i].item_name}
                                </h5>
                                <p class="card-text">
                                    Added at:
                                   ${textedJson.items[i].date}
                                </p>
                            </div>
                       
                            <div class="text-center">
                                <button class="btn btn-primary text-center" onclick="changeItemStatus(${textedJson.items[i].id})">Sold</button>
                            </div>
           
                            <br>
                        </div>
                    </div>
    </div><br>
                `;
            }
            itemsarea.innerHTML = html;
            var textedJson = JSON.stringify(data, undefined, 4);
            textarea.innerHTML = textedJson;
        })

};
//user page ui
const items = `
<div class="">
<button class="btn btn-primary btn-sm" onclick="getItems();">Refresh</button>
</div>
<br>
<h5>My items</h5> 

  <div class="row" id="myitemsui">
  </div>
  

<div class="collapse" id="json" >
<div class="container">
<div class="row">
<h5>Json Response </h5>
</div>
</div>
</div>
`;

//=================================================itemdetails ui and functions==========================================================
//get item details
function getItemDetails() {
    let item_name = document.getElementById("inputItemName").value;
    let textarea = document.getElementById("jsonresult");
    let detailsui = document.getElementById("itemdetailsui");
    const [hash, query] = location.href.split('#')[1].split('?')
    const params = Object.fromEntries(new URLSearchParams(query))
    let url = `/api/itemdetails?name=${params.id}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = JSON.stringify(data, undefined, 4);
            let ui = `<div class="row">
            <div class="col-12">
                <div class="card">

                    <img class="card-img-top" src="https://auction-deno-app.herokuapp.com/uploads/${data.items.itemdetails[0].item_name}" alt="Card image cap" style="object-fit: contain; width: 100%; height: 350px;">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${data.items.itemdetails[0].item_name}
                        </h5>
                        <p class="card-subtitle mb-2 text-muted">
                        ${data.items.itemdetails[0].date}
                        </p>
                    </div>
                    <div class="text-center">
                        <a href="#">
                            <button class="btn btn-primary placebidbtn" data-toggle="modal" data-target="#bidModal">Place bid</button>
                        </a>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div>
        </div>
        <br>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Details</h5>

                        <p class="card-text">
                        ${data.items.itemdetails[0].item_description}
                        </p>
                        <!-- <h5 class="card-title">Item name</h5>
        <p class="card-text">Date item added</p>

        <p class="card-text" style="position:absolute;right: 0px;padding-right:10px;">Seller username
        </p> -->
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-12">
                <div class="card">

                    <div class="card-body">
                        <h5 class="card-title">Contacts</h5>
                        <div class="line">

                        </div>
                        <div class="row">
                            <div class="col">
                                <a href="#">
                                    <button class="btn btn-light infobtn"><i class='bx bx-phone' id="header-toggle"> </i> &nbsp;
                                    ${data.items.contact}</button>
                                </a>
                            </div>
                            <div class="col">
                                <a href="#">
                                    <button class="btn btn-light infobtn"><i class='bx bx-mail-send' id="header-toggle"> </i> &nbsp;${data.items.phone}</button>
                                </a>
                            </div>
                            <div class="col">
                                <a href="#">
                                    <button class="btn btn-light infobtn"><i class='bx bx-user' id="header-toggle"> </i> &nbsp;
                                    ${data.items.seller}</button>
                                </a>
                            </div>
                        </div>
                    <br>
                </div>
            </div>
        </div>
`;
            detailsui.innerHTML = ui;
            textarea.innerHTML = textedJson;
        })

};
//item details ui
const itemdetails = `
<h5>Item details</h5>
<p style="color: rgb(206, 206, 206)">
    details of the item
</p>

<div class="row" id="itemdetailsui">


</div>
<form class="row g-3" action="/sell" enctype="multipart/form-data" method="post">
<div class="col-md-12">
        <label for="inputName" class="form-label">Item name</label>
        <input name="name" type="text " class="form-control" id="inputItemName" />
    </div>
</div>
</div>
</div>

</form>
<div class="text-center">
        <a  class="btn btn-primary" style="margin-top:30px;" onclick="getItemDetails();">Fetch items</a>
    </div>

<h5>Json Response </h5>
<textarea name="" id="jsonresult" cols="30" rows="10" style="
    width: 100%;
    min-height: 30rem;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 0.8rem;
    line-height: 1.2;
  "></textarea>
`;

//=================================================itemdetails ui and functions==========================================================
//bid an item
function bidItems() {
    let itemname = document.getElementById("inputItemName").value;
    let textarea = document.getElementById("jsonresult");
    let url = `/api/getbids?name=${itemname}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = JSON.stringify(data, undefined, 4);
            textarea.innerHTML = textedJson;
        })

};


function sendBid() {
    let username = document.getElementById("userid").value;
    let item_name = document.getElementById("inputItemName").value;
    let bid_amount = document.getElementById("inputAmount").value;
    let textarea = document.getElementById("jsonresult");
    let url = `/api/bid?user=${username}&name=${item_name}&bid=${bid_amount}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = JSON.stringify(data, undefined, 4);
            textarea.innerHTML = textedJson;

        })
}
//bid an item ui
const biditems = `

<h5>Bid items</h5>
<p style="color: rgb(206, 206, 206)">
    default key is used
</p>
<form class="row g-3" action="/sell" enctype="multipart/form-data" method="post">
<!--
<div class="col-md-12">
        <label for="inputName" class="form-label">User name</label>
        <input name="name" type="text " class="form-control" id="inputUserName" />
    </div> -->
<div class="col-md-12">
        <label for="inputName" class="form-label">Item name</label>
        <input name="name" type="text " class="form-control" id="inputItemName" />
    </div>
    <div class="col-md-12">
        <label for="inputName" class="form-label">Amount</label>
        <input name="name" type="text " class="form-control" id="inputAmount" />
    </div>
</div>
</div>
</div>

</form>
<div class="text-center">
        <a  class="btn btn-primary" style="margin-top:30px;" onclick="sendBid();">Place Bid</a>
        <a  class="btn btn-primary" style="margin-top:30px;" onclick="bidItems();">Fetch current bid</a>
    </div>

<h5>Json Response </h5>
<textarea name="" id="jsonresult" cols="30" rows="10" style="
    width: 100%;
    min-height: 30rem;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 0.8rem;
    line-height: 1.2;
  "></textarea>
`;


//=================================================bid results ui and functions==========================================================
//bid an item
function getBidResults() {
    let username = document.getElementById("userid").value;
    let itemname = document.getElementById("inputItemName").value;
    let textarea = document.getElementById("jsonresult");
    let url = `/api/bid/results?name=${itemname}&user=${username}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //load the json on the text area
            var textedJson = JSON.stringify(data, undefined, 4);
            textarea.innerHTML = textedJson;
        })

};

//bid results ui
const results = `

<h5>Get bid results</h5>
<p style="color: rgb(206, 206, 206)">
    for specific item
</p>
<form class="row g-3">

<div class="col-md-12">
        <label for="inputName" class="form-label">Item name</label>
        <input name="name" type="text " class="form-control" id="inputItemName" />
    </div>
</div>
</div>
</div>

</form>
<div class="text-center">
        <a  class="btn btn-primary" style="margin-top:30px;" onclick="getBidResults();">Get Results</a>
    </div>

<h5>Json Response </h5>
<textarea name="" id="jsonresult" cols="30" rows="10" style="
    width: 100%;
    min-height: 30rem;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 0.8rem;
    line-height: 1.2;
  "></textarea>
`;


//responsible for all the navigations on the page
function getContent(fragmentId, callback) {

    var pages = {
        user: userui,
        sell: newitem,
        myItems: items,
        itemdetails: itemdetails,
        biditem: biditems,
        results: results
    };

    callback(pages[fragmentId]);
    return pages[fragmentId];
}

function loadContent() {

    var contentDiv = document.getElementById("main-content"),
        fragmentId = location.hash.substr(1);

    getContent(fragmentId, function(content) {
        contentDiv.innerHTML = content;
    });
}
if (!location.hash) {
    location.hash = "#user";
}

loadContent();
window.addEventListener("hashchange", loadContent);

inithashes();
