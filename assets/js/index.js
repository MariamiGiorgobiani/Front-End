let productsData = [];

// Fetch product data from the API (only on index.html)
if (document.querySelector('.jewellery')) {
    fetch('https://api.escuelajs.co/api/v1/products')
        .then((resp) => resp.json())
        .then((data) => {
            productsData = data; // Store the data in the productsData variable
            getProducts(productsData); // Render products to the page
        })
        .catch((err) => {
            console.log(err);
            alert("Something went wrong");
        });



        document.querySelector(`.clothes`).addEventListener("click",  (e) => {
                    const filteredProducts = productsData.filter(item => item.category.id == 1);
                    getProducts(filteredProducts)
                });
                document.querySelector(`.electronics`).addEventListener("click",  (e) => {
                    const filteredProducts = productsData.filter(item => item.category.id == 2);
                    getProducts(filteredProducts)
                });
                document.querySelector(`.furniture`).addEventListener("click",  (e) => {
                    const filteredProducts = productsData.filter(item => item.category.id == 3);
                    getProducts(filteredProducts)
                });
                document.querySelector(`.shoes`).addEventListener("click",  (e) => {
                    const filteredProducts = productsData.filter(item => item.category.id == 4);
                    getProducts(filteredProducts)
                });
                document.querySelector(`.miscellaneous`).addEventListener("click",  (e) => {
                    const filteredProducts = productsData.filter(item => item.category.id == 5);
                    getProducts(filteredProducts)
                });
    
            

    // Function to render products dynamically (index.html)
    const getProducts = (arr) => {
        let temp = "";

        arr.forEach((item, index) => {
if (index>47) 
    return;

            temp += `
                <div class="product" data-id="${item.id}">
                <img src="${item.images[0]}" alt="${item.title}" width="100">
                <h2>${item.title}</h2>
                <p>${item.price}$</p>
                <p>Category: ${item.category.name}</p>
                <button class="cart" onclick="addToCart(${item.id}, '${item.title}', ${item.price}, '${item.images[0]}')">Add to Cart</button>
            </div>
            `;
        });

        document.querySelector('.jewellery').innerHTML = temp;
    };
}





const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};


const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};


const addToCart = (id, title, price, image) => {
    let cart = getCart();


    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex > -1) {

        cart[existingItemIndex].quantity += 1;
    } else {

        cart.push({ id, title, price, image, quantity: 1 });
    }


    saveCart(cart);


    updateCartIcon();
};


const updateCartIcon = () => {
    const cart = getCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
};


const updateCart = () => {
    const cart = getCart();
    const cartList = document.querySelector('.cart-list');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    cartList.innerHTML = '';


    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li>There are no products in your cart</li>';
        totalItemsElement.textContent = 0;
        totalPriceElement.textContent = '0.00';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <img src="${item.image}" width="60" height="60"/>
                <span>${item.title} - $${item.price} x ${item.quantity}</span>
                <div class="quantity-buttons">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartList.appendChild(li);


            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });


        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
};
const changeQuantity = (id, change) => {
    let cart = getCart();


    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        const item = cart[itemIndex];


        item.quantity += change;


        if (item.quantity < 1) {
            item.quantity = 1;
        }


        saveCart(cart);


        updateCart();
        updateCartIcon();
    }
};


const removeFromCart = (id) => {
    let cart = getCart();


    cart = cart.filter(item => item.id !== id);


    saveCart(cart);

    updateCart();
    updateCartIcon();
};


const clearCart = () => {
    saveCart([]); 
    updateCart(); 
    updateCartIcon(); 
};


window.onload = function () {
    if (document.querySelector('.jewellery')) {
       
        updateCartIcon(); 
    } else if (document.querySelector('.cart-list')) {
     
        updateCart(); 
    }
};