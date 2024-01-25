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
    
}


const show_filtered_products = (picked_items) => {
    // hide the customer form
    let cust_form = document.getElementsByClassName("customer_form");
    for (i = 0;i<cust_form.length;i++){
        cust_form[i].style.display = "none";
    }

    // emptying the products_filtered section
    let products_filtered_btn = document.getElementsByClassName("products_filtered_btn");
    let products_filtered = document.getElementsByClassName("products_filtered");
    for (i =0;i<products_filtered_btn.length;i++){
        products_filtered[i].innerHTML = "";
    }
    products_filtered_btn[0].style.display = "block";
    products_filtered[0].style.display = "flex";
    

    // flag = 1 means we want the list of goods with a checkbox, so we can add to the cart the ones we want.

    construct_list_goods(picked_items,products_filtered,1);
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