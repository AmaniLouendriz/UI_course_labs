// show the customer's questionnaire

function go_to_customer_form () {
    // we are hiding the menu
    let section = document.getElementsByClassName("menu");
    for (i = 0;i<section.length;i++){
        section[i].style.display = "none"
    }

    // we are showing the navigation tabs to the user
    let tab = document.getElementsByClassName("tab");
    for (i=0;i<tab.length;i++) {
        tab[i].style.display = "flex";
    }

    // showing the client preferances form
    open_section(null,"client");

    // changing the tab styles so that the client tab is highlighted (since we didn't click the client button to get there, )
    change_tab_style("","client");

}

// send a request to filter products based on user preferances

async function send_for_products() {
    // add a focus style to the tab of products

    change_tab_style("client","products");

    // enable the client button
    document.getElementById("client").disabled = false;



    // filtering choices
    // if no preferances then we push everything

    let first_preference = document.getElementById("type_diet").value;
    let second_preference = document.getElementById("type_farm").value;
    let picked_items = [];
    const items = await getData("./data.json");
    for (i in items) {
        if ((items[i].type.includes(first_preference)) || first_preference == "") {
            if ((items[i].type_of_farming == second_preference)|| second_preference == ""){
                picked_items.push(items[i]);
            }
        }
    }
    // sort the preferances based on price
    picked_items.sort(comparePrice);



    // showing the products
    show_filtered_products(picked_items);
    return picked_items;
    // document.getElementById("type_diet").value = "";
    // document.getElementById("type_farm").value = "";    
}


const show_filtered_products = (picked_items) => {
    // hide the customer form
    let cust_form = document.getElementsByClassName("customer_form");
    for (i = 0;i<cust_form.length;i++) {
        cust_form[i].style.display = "none";
    }

    // emptying the products_filtered section
    let products_filtered_btn = document.getElementsByClassName("products_filtered_btn");
    let products_filtered = document.getElementsByClassName("products_filtered");
    for (i =0;i<products_filtered.length;i++){
        products_filtered[i].innerHTML = "";
    }
    products_filtered_btn[0].style.display = "block";
    products_filtered[0].style.display = "flex";
    

    // flag = 1 means we want the list of goods with a checkbox, so we can add to the cart the ones we want.

    construct_list_goods(picked_items,products_filtered,1);
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
    let btn = document.getElementsByClassName("back_btn");

    for(i = 0;i<btn.length;i++){
        btn[i].remove();
    }

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

    let choosenProduct = JSON.parse(sessionStorage.getItem("data")) || [];
    console.log("the session thing BEFORE",choosenProduct);

	for (i = 0; i < ele.length; i++) { 
		if (ele[i].checked) {
           choosenProduct.push(JSON.parse(ele[i].dataset.object));
		}
	}

    sessionStorage.setItem("data",JSON.stringify(choosenProduct));

    console.log("the session storage thing",sessionStorage.getItem("data"));

    construct_list_goods(choosenProduct,next_section_inner,0);

    sum.appendChild(document.createTextNode("The total is: "+ calculate_total(choosenProduct)+"$"));
    next_section[0].appendChild(sum);
    //<button onclick="main()">Go back to home page</button>
    back_btn = document.createElement("button");
    back_btn.innerHTML = "Go Back to the home page";
    back_btn.className = "back_btn";
    back_btn.onclick = go_back_homePage;
    next_section[0].appendChild(back_btn);


    sessionStorage.setItem("data",null);
    //choosenProduct = [];
}

const calculate_total = (products)=>{
    let s = 0;
    for (i = 0;i<products.length;i++){
        // console.log("the single product is",products[i]);
        s = s+ parseFloat(products[i].price);
    }
    s = s.toFixed(2);
    return s;
}


// toggle the styles of the navbar
const change_tab_style = (prev_id,curr_id)=>{
    let section = document.getElementById(curr_id);
    section.className += " active";
    if (prev_id != "") {
        let prev_section = document.getElementById(prev_id);
        prev_section.className = prev_section.className.replace("active","");
    }
}

const go_back_homePage = ()=>{
    let tab = document.getElementsByClassName("tab");
    let customer = document.getElementsByClassName("customer_form");
    let goods = document.getElementsByClassName("products_filtered_btn");
    let cart = document.getElementsByClassName("cart");

    for (i = 0;i<tab.length;i++){
        tab[i].style.display = "none"
        // tab[i].innerHTML = ""
    }

    for (i = 0;i<customer.length;i++){
        customer[i].style.display = "none"
    }

    for (i = 0;i<goods.length;i++){
        goods[i].style.display = "none"
    }

    for (i = 0;i<cart.length;i++){
        cart[i].style.display = "none"
    }

    let menu = document.getElementsByClassName("menu");

    for (i = 0;i<menu.length;i++){
        menu[i].style.display = "block"
    }

    sessionStorage.clear();



}

