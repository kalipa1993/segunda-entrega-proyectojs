//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//buttons 
let buttonsDOM = [];

//cart
let cart = [];

const setCartValues = cart => {
    let tempTotal = 0;
    let itemsTotal = 0; 
    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount; 
    });
    cartTotal.innerText = tempTotal;
    cartItems.innerText = itemsTotal;
}

const addCartItem = item => {
    let div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
    <img src="${item.image}" alt="Producto">
    <div>
        <h4>${item.title}</h4>
        <h5>${item.price} CLP</h5>
        <span class="remove-item" data-id=${item.id}>Eliminar</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>
    `;
    cartContent.appendChild(div);
}

const showCart = () => {
    cartOverlay.classList.add("transparent-bcg");
    cartDOM.classList.add("show-cart");
}

const hideCart = () => {
    cartOverlay.classList.remove("transparent-bcg");
    cartDOM.classList.remove("show-cart");
}

const clearCart = () => {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => removeItem(id));
    console.log(cartContent.children);
    while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
    }
    hideCart();
}

const removeItem = (id) => {
    cart = cart.filter(item => item.id != id);
    setCartValues(cart);
    saveCart(cart);
    let button = getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Agregar al carrito`;
}

const getSingleButton = id => {
    return buttonsDOM.find(button => button.dataset.id == id);
}

const setupAPP = () => {
    cart = getCart();
    setCartValues(cart);
    populateCart(cart);
    cartBtn.addEventListener("click", showCart);
    closeCartBtn.addEventListener("click", hideCart);
}

const populateCart = cart => {
    cart.forEach(item => addCartItem(item));
}

//local storage
const productsList =   [{id: 1, title: "MAYONESA HELLMANS", price: 1740, image: "images/mayo.jpg"},
                        {id: 2, title: "LECHE ENTERA", price: 1000, image: "images/leche.jpg"},
                        {id: 3, title: "SOFT", price: 1970, image: "images/soft.jpg"},
                        {id: 4, title: "SOPA DE CARACOLES", price: 440, image: "images/sopa.jpg"},
                        {id: 5, title: "AZUCAR IANSA", price: 1100, image: "images/azucar.jpg"},
                        {id: 6, title: "ACEITE CHEF ", price: 4620, image: "images/aceite.jpg"},
                        {id: 7, title: "ALIMENTO DE GATO 3 KILOS", price: 13790, image: "images/gato.jpg"},
                        {id: 8, title: "COCA COLA EN LATA", price: 590, image: "images/lata.jpg"}];

localStorage.setItem("productsList", JSON.stringify(productsList));

const products = JSON.parse(localStorage.getItem("productsList"));

const saveCart = cart => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

const getCart = () => {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
}

//display products
for (const product of products) {
    let displayProducts = document.createElement("article");
    displayProducts.className = "product";
    displayProducts.innerHTML = `
    <div class="img-container">
        <img src=${product.image} alt="Producto" class="product-img">
        <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            Agregar al carrito
        </button>
    </div>
    <h3>${product.title}</h3>
    <h4>${product.price} CLP</h4>
    `;
    productsDOM.appendChild(displayProducts);
}

//add to cart
setupAPP();

const bagButtons = [...document.querySelectorAll(".bag-btn")];

buttonsDOM = bagButtons; 

bagButtons.forEach(btn => {
    let id = btn.dataset.id;
    let inCart = cart.find(product => product.id == id);
    if (inCart) {
        btn.innerText = "Agregado";
        btn.disabled = true;
    } 
    btn.addEventListener("click", e => {
        e.target.innerText = "Agregado";
        e.target.disabled = true;
        //get product from products
        let cartItem = {...products.find(product => product.id == id), amount: 1}; 
        //add product to cart
        cart = [...cart, cartItem];
        //save cart in local storage
        saveCart(cart);
        //set cart values
        setCartValues(cart);
        //display cart item
        addCartItem(cartItem);
        //show cart
        showCart();
    });
});

//clear cart
clearCartBtn.addEventListener("click", clearCart);

//cart functionality
cartContent.addEventListener("click", e => {
    if (e.target.classList.contains("remove-item")) {
        let removeCartItem = e.target;
        let id = removeCartItem.dataset.id;
        cartContent.removeChild(removeCartItem.parentElement.parentElement);
        removeItem(id);
    } else if (e.target.classList.contains("fa-chevron-up")) {
        let addAmount = e.target;
        let id = addAmount.dataset.id; 
        let tempItem = cart.find(item => item.id == id);
        tempItem.amount += 1; 
        saveCart(cart);
        setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
    } else if (e.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = e.target;
        let id = lowerAmount.dataset.id; 
        let tempItem = cart.find(item => item.id == id);
        tempItem.amount -= 1; 
        if (tempItem.amount > 0) {
            saveCart(cart);
            setCartValues(cart);
            lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
            cartContent.removeChild(lowerAmount.parentElement.parentElement);
            removeItem(id);
        }
    }
});