// a method to get data about products from the json file.
// add a sad path too to getData

async function getData(file) {
    let object = await fetch(file);
    let text = await object.text();
    let parsedText = JSON.parse(text);
    let items = parsedText.products;
    return items;
}
// items is an array of objects

// criteria to sort
function comparePrice(a,b) {
    return (a.price - b.price);
}

const construct_list_goods = (items,products,flag) => {

    // items can be either:
    //       * whole items in data.json (case of menu)
    //       * either the filtered products based on user preferances (after the user completes customer form)

    // the general schema is the following; for each product:

    // <div class="item">
        //<div class="imageDiv">
        // <img>
        //</div>
        // <div class="product_info">
            // <h3 class="name">apple</h3>
            // <h3 class="price">1 dollar</h3>
            // <h3 class="type_diet">Halal</h3>
            // <h3 class="org">non organic</h3>
        // </div>
        //<div class="input_ck">
        // <input type="checkbox"></input>
        //<label></label>
        //</div>
    // </div>

    for (i = 0;i<items.length;i++) {
        let product = items[i]
        // create a div for each item
        var div = document.createElement("div");
        div.className = "item";
        // console.log("beh here",products[0])
        products[0].appendChild(div);

        var divImage = document.createElement("div");
        divImage.className = "imageDiv";
        div.appendChild(divImage);

        var image = document.createElement("img");
        image.src = product.src;
        divImage.appendChild(image);

        var divInfo = document.createElement("div");
        divInfo.className = "infoDiv";
        div.appendChild(divInfo);

        var heading = document.createElement("h3");
        heading.className = "name";
        heading.innerHTML = product.name;
        divInfo.appendChild(heading);

        var heading = document.createElement("h3");
        heading.className = "price";
        heading.innerHTML = `${product.price} $`;
        divInfo.appendChild(heading);

        var heading = document.createElement("h3");
        heading.className = "type_diet";
        let s = ""
        for (type in product.type) {
            s += product.type[type] + " "
        }
        heading.innerHTML = s;
        divInfo.appendChild(heading);
        var heading = document.createElement("h3");

        heading.className = "org";
        heading.innerHTML = product.type_of_farming;
        divInfo.appendChild(heading);

        // if flag == 1 then we add a checkbox to add to the cart

        if (flag) {
            var div_input = document.createElement("div");
            div_input.className = "divInput";
            div.appendChild(div_input);
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = i;
            checkbox.value = product.name;
            checkbox.dataset.object = JSON.stringify(product);
            checkbox.name = "product";
            div_input.appendChild(checkbox);

            let label = document.createElement("label");
            label.htmlFor = i;
            label.appendChild(document.createTextNode("Add to cart"));
            div_input.appendChild(label);  

        }

    }
    // console.log("okie, lets be dumb",sessionStorage.getItem('data'));
}

const show_products = (items) => {
    let menu = document.getElementsByClassName("menu");
    menu[0].style.display = "block";
    let products = document.getElementsByClassName("products");
    products.innerHTML = "";
    construct_list_goods(items,products,0);
}

async function main() {
    const items = await getData("./data.json");
    // lets sort the items array based on the price
    items.sort(comparePrice);

    show_products(items);
}

// open section is a function both called when clicking on a tab, or by the parent function go_to_customer_form()
const open_section = (evt,id) => {
    let tabs = ["client","products","cart"];
    // getting the sections that hold actual information 
    client = document.getElementById("customer");
    products = document.getElementById("goods_hero");
    cart = document.getElementById("Pay");
    

    let new_id = "";

    // based on the tab id received, I can see which section I want to show.
    if (id == "client") {
        new_id = "customer";
    } else if (id == "products") {
        new_id = "goods_hero";
    } else if (id == "cart") {
        new_id = "Pay";
    }

    // to be sure, hiding all sections

    client.style.display = "none";
    products.style.display = "none";
    cart.style.display = "none";

    // removing active classname on all tablinks
    tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

    // display the appropriate section
    document.getElementById(new_id).style.display = "block";  
    if (new_id == "customer"){
        document.getElementById("type_diet").value = "";
        document.getElementById("type_farm").value = "";
    }

    // enabling all tabs that are previous the current tab I am in.

    for (i = 0;i<tabs.indexOf(id);i++){
        document.getElementById(tabs[i]).disabled = false;
    }
    // disabling the button id where I am.
    document.getElementById(id).disabled = true;

    // adding an active className on the current one
    if (evt != null) {
        evt.currentTarget.className += " active";
    }
}

// filter is a function that filters the products in a page: vegetables, fruits,dairy,meat.


async function filter(type,cont) {
    // type: vegetables,fruits....
    // cont: name of the container to which we should append items.
    let products = document.getElementsByClassName(cont);
    console.log("once we click on the filter,the products are",products)
    // emptying the section products
    for (i = 0;i<products.length;i++) {
        products[i].style.display = "none";
        products[i].innerHTML = "";
    }

    // pulling data and filtering
    const goods = await getData("./data.json");
    let filtered_goods = [];

    if (type == "reset") {
        filtered_goods = goods;
    } else {
        for (i = 0;i<goods.length;i++) {
            if (goods[i].category == type) {
                filtered_goods.push(goods[i]);
            }
        }
    }

    filtered_goods.sort(comparePrice);

    
    // adding the newly built element to the web page
    construct_list_goods(filtered_goods,products,0);
    
    for (i = 0;i<products.length;i++) {
        products[i].style.display = "flex";
    }
}

//let choosenProduct = [];

// this function filters are the same as in the menu page, but we don't filter from the whole 
// products, just from the ones that the user wants according to his selection in the questionnaire.
const filter_user = async(type,cont) => {
    //let choosenProduct = [];
    let choosenProduct = JSON.parse(sessionStorage.getItem("data")) || [];

    let products = document.getElementsByClassName(cont);
    let ele = document.getElementsByName("product");
    for (i = 0; i < ele.length; i++) { 
		if (ele[i].checked) {
            choosenProduct.push(JSON.parse(ele[i].dataset.object));
		}
	}

    sessionStorage.setItem("data",JSON.stringify(choosenProduct));




    for (i = 0;i<products.length;i++) {
        products[i].style.display = "none";
        products[i].innerHTML = "";
    }

    let first_preference = document.getElementById("type_diet").value;
    let second_preference = document.getElementById("type_farm").value;
    console.log("the preferances are",first_preference,second_preference);
    let picked_items = [];
    let filtered_goods = [];
    const items = await getData("./data.json");
    for (i in items) {
        if ((items[i].type.includes(first_preference)) || first_preference == "") {
            if ((items[i].type_of_farming == second_preference)|| second_preference == ""){
                picked_items.push(items[i]);
            }
        }
    }

    console.log("the picked items",picked_items);
    if (type == "reset2") {
        filtered_goods = picked_items;
    } else {
        for (i in picked_items) {
            if (picked_items[i].category == type) {
                filtered_goods.push(picked_items[i]);
            }
        }
    }
    
    // sort the preferances based on price
    filtered_goods.sort(comparePrice);
    console.log("the filtered goods are",filtered_goods);

    // adding the newly built element to the web page
    construct_list_goods(filtered_goods,products,1);

    for (i = 0;i<products.length;i++) {
        products[i].style.display = "flex";
    }
}

main();
