let productsData = [];

// Fetch product data from the API 
if (document.querySelector('.catalog_jewellery')) {
    fetch('https://api.escuelajs.co/api/v1/products')
        .then((resp) => resp.json())
        .then((data) => {
            productsData = data;
            getProducts(productsData);
        })
        .catch((err) => {
            console.log(err);
            // alert("Something went wrong");
        });



        // document.querySelector(`.clothes`).addEventListener("click",  (e) => {
        //     const filteredProducts = productsData.filter(item => item.category.id == 1);
        //     getProducts(filteredProducts)
        // });
        // document.querySelector(`.electronics`).addEventListener("click",  (e) => {
        //     const filteredProducts = productsData.filter(item => item.category.id == 2);
        //     getProducts(filteredProducts)
        // });
        // document.querySelector(`.furniture`).addEventListener("click",  (e) => {
        //     const filteredProducts = productsData.filter(item => item.category.id == 3);
        //     getProducts(filteredProducts)
        // });
        // document.querySelector(`.shoes`).addEventListener("click",  (e) => {
        //     const filteredProducts = productsData.filter(item => item.category.id == 4);
        //     getProducts(filteredProducts)
        // });
        // document.querySelector(`.miscellaneous`).addEventListener("click",  (e) => {
        //     const filteredProducts = productsData.filter(item => item.category.id == 5);
        //     getProducts(filteredProducts)
        // });



    document.addEventListener("DOMContentLoaded", () => {
        // render products dynamically 
        const getProducts = (arr) => {
            let temp = "";

            arr.forEach((item, index) => {
                if (index > 47) return;

                temp += `
                    <div class="product" data-id="${item.id}">
                        <img src="${item.images[0]}" alt="${item.title}" width="100">
                        <p>${item.title}</p>
                        <p>${item.price}$</p>
                        <p>Category: ${item.category.name}</p>
                        <button class="cart" onclick="addToCart(${item.id}, '${item.title}', ${item.price}, '${item.images[0]}')">Add to Cart</button>
                    </div>
                `;
            });

            document.querySelector('.catalog_jewellery').innerHTML = temp;

            document.querySelectorAll('.product').forEach(product => {
                product.addEventListener('click', (event) => {
                    if (event.target.classList.contains('cart')) {
                        return; // If it's the "Add to Cart" button, do nothing
                    }

                    const productId = product.getAttribute('data-id');
                    const clickedProduct = arr.find(item => item.id === parseInt(productId));

                    openModal(clickedProduct);
                });
            });
        };

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


        const openModal = (product) => {

            const modal = document.getElementById('product-modal');
            const modalImage = document.getElementById('modal-product-image');
            const modalTitle = document.getElementById('modal-product-title');
            const modalDescription = document.getElementById('modal-product-description');
            const modalPrice = document.getElementById('modal-product-price-value');
            const addToCartButton = document.getElementById('add-to-cart-modal');

            if (!modal || !modalImage || !modalTitle || !modalDescription || !modalPrice || !addToCartButton) {
                console.error("Modal or modal elements are missing!");
                return;
            }


            modalImage.src = product.images[0];
            modalTitle.textContent = product.title;
            modalDescription.textContent = product.description || "No description available.";
            modalPrice.textContent = product.price.toFixed(2);


            modal.style.display = "block";


            addToCartButton.onclick = () => {
                addToCart(product.id, product.title, product.price, product.images[0]);
                modal.style.display = "none";  // Close modal after adding to cart
            };

            // // Close modal when clicking on the "x"
            // const closeModalButton = document.querySelector('.close-modal');
            // closeModalButton.onclick = () => {
            //     modal.style.display = "none";
            // };


            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };
        };


        fetch('https://api.escuelajs.co/api/v1/products')
            .then((resp) => resp.json())
            .then((data) => {
                getProducts(data);
            })
            .catch((err) => {
                console.log(err);
                alert("Something went wrong");
            });
    });


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
                <span class="product-title">${item.title} - $${item.price} x ${item.quantity}</span>
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
    if (document.querySelector('.catalog_jewellery')) {
       
        updateCartIcon(); 
    } else if (document.querySelector('.cart-list')) {
     
        updateCart(); 
    }
};















// modaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal


const modal = document.querySelector('.modal-content');
const modalImage = document.querySelector('.modalImage');
const modalTitle = document.querySelector('.modalTitle');
const modalCategory = document.querySelector('.modalCategory');
const modalPrice = document.querySelector('.modalPrice');
const modalDescription = document.querySelector('.modalDescription');
const closeModal = document.querySelector('.close');

const addToCartBtn = document.getElementById('addToCartBtn'); 




const openModal = (product) => {
    modalImage.src = product.images; 
    modalTitle.textContent = product.title;
    modalCategory.textContent = `Category: ${product.category.name}`;
    modalPrice.textContent = `Price: $${product.price}`;
    modalDescription.textContent = product.description || "No description available."; 


    modal.style.display = 'block'; 
};




