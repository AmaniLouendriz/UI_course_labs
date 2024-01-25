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
        heading.innerHTML = product.price;
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
}

const add_to_cart = ()=>{
    change_tab_style("products","cart");
    // enabling products tab
    document.getElementById("products").disabled = false;
    // getting the section of filtered goods
    let section_filtered = document.getElementsByClassName("products_filtered_btn");
    // getting the checkboxes
    let ele = document.getElementsByName("product");
    // hiding the section of filtered goods
    section_filtered[0].style.display = "none";
    // getting the cart section
    // next_section contains the whole cart section
    let next_section = document.getElementsByClassName("cart");
    // next_section_inner just contains the list of chosen products by the user
    let next_section_inner = document.getElementsByClassName("cart_items");
    // para contains the text (You selected)
    let para = document.getElementById("sum_tot");
    // sum contains the total of the items purchased
    let sum = document.getElementById("sum");

    next_section[0].style.display = "block";


    para.innerHTML = "";
    sum.innerHTML = "";
    para.style.display = "block";

    para.innerHTML = "You selected : ";

    para.appendChild(document.createElement("br"));


    // emptying the cart section to not have inconsistencies
    for (i = 0;i<next_section_inner.length;i++){
        next_section_inner[i].innerHTML = "";
        next_section_inner[i].style.display = "flex";
        next_section_inner[i].style.flexdirection = "row";

    }


    let choosenProduct = [];

	
	for (i = 0; i < ele.length; i++) { 
		if (ele[i].checked) {
			choosenProduct.push(JSON.parse(ele[i].dataset.object));
		}
	}

    construct_list_goods(choosenProduct,next_section_inner,0);
    sum.appendChild(document.createTextNode("The total is: "+ calculate_total(choosenProduct)+"$"));
    next_section[0].appendChild(sum);
}

const calculate_total = (products)=>{
    let s = 0;
    for (i = 0;i<products.length;i++){
        // console.log("the single product is",products[i]);
        s = s+ parseFloat(products[i].price);
    }
    return s;
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

main();
