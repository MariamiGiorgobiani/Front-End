let productsData = [];

// Fetch product data from the API (only on index.html)
if (document.querySelector('.catalog_jewellery')) {
    fetch('https://api.escuelajs.co/api/v1/products')
        .then((resp) => resp.json())
        .then((data) => {
            productsData = data; // Store the data in the productsData variable
            getProducts(productsData); // Render products to the page
        })
        .catch((err) => {
            console.log(err);
            // alert("Something went wrong");
        });



    document.querySelector(`.clothes`).addEventListener("click", (e) => {
        const filteredProducts = productsData.filter(item => item.category.id == 1);
        getProducts(filteredProducts)
    });
    document.querySelector(`.electronics`).addEventListener("click", (e) => {
        const filteredProducts = productsData.filter(item => item.category.id == 2);
        getProducts(filteredProducts)
    });
    document.querySelector(`.furniture`).addEventListener("click", (e) => {
        const filteredProducts = productsData.filter(item => item.category.id == 3);
        getProducts(filteredProducts)
    });
    document.querySelector(`.shoes`).addEventListener("click", (e) => {
        const filteredProducts = productsData.filter(item => item.category.id == 4);
        getProducts(filteredProducts)
    });
    document.querySelector(`.miscellaneous`).addEventListener("click", (e) => {
        const filteredProducts = productsData.filter(item => item.category.id == 5);
        getProducts(filteredProducts)
    });




    document.addEventListener("DOMContentLoaded", () => {
        // Function to render products dynamically 
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
                        return; // If it's the "Add to Cart" button, do nothing (skip opening the modal)
                    }
                    // Find the product data based on the clicked product's data-id attribute
                    const productId = product.getAttribute('data-id');
                    const clickedProduct = arr.find(item => item.id === parseInt(productId));

                    openModal(clickedProduct);
                });
            });
        };
    
        
        const openModal = (product) => {
            // Get modal and modal elements
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
    
            // Set the modal content with the clicked product's details
            modalImage.src = product.images[0];  
            modalTitle.textContent = product.title;
            modalDescription.textContent = product.description || "No description available.";
            modalPrice.textContent = product.price.toFixed(2);
    
            // Show the modal
            modal.style.display = "block";
    
            // Handle Add to Cart in Modal
            addToCartButton.onclick = () => {
                addToCart(product.id, product.title, product.price, product.images[0]);
                modal.style.display = "none";  // Close modal after adding to cart
            };
    
            // // Close modal when clicking on the "x"
            // const closeModalButton = document.querySelector('.close-modal');
            // closeModalButton.onclick = () => {
            //     modal.style.display = "none";
            // };
    
            // Close modal when clicking outside the modal content
            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };
        };
    
        // Assuming you're fetching products here and passing them to getProducts()
        fetch('https://api.escuelajs.co/api/v1/products')
            .then((resp) => resp.json())
            .then((data) => {
                getProducts(data); // Pass the fetched product data
            })
            .catch((err) => {
                console.log(err);
                alert("Something went wrong");
            });
    });
     
    
}

// Function to get the current cart from localStorage
const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Function to save the cart to localStorage
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to add an item to the cart (from index.html)
const addToCart = (id, title, price, image) => {
    let cart = getCart();

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex > -1) {
        // If item exists, update the quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Otherwise, add a new item to the cart
        cart.push({ id, title, price, image, quantity: 1 });
    }

    // Save the updated cart to localStorage
    saveCart(cart);

    // Update the cart icon count
    updateCartIcon();
};

// Function to update the cart icon count (across all pages)
const updateCartIcon = () => {
    const cart = getCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);  // Sum up the quantity of each item
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
};

// Function to update the cart display (on cart.html)
const updateCart = () => {
    const cart = getCart();
    const cartList = document.querySelector('.cart-list');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    cartList.innerHTML = ''; // Clear the list before re-rendering

    // Calculate total items and total price
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

            // Update totals
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        // Update total items and total price in the summary
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
};
const changeQuantity = (id, change) => {
    let cart = getCart();

    // Find the index of the item in the cart
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        const item = cart[itemIndex];

        // Change the quantity
        item.quantity += change;

        // Ensure quantity doesn't go below 1
        if (item.quantity < 1) {
            item.quantity = 1;
        }

        // Save the updated cart to localStorage
        saveCart(cart);

        // Re-render the cart with the updated quantities
        updateCart();
        updateCartIcon();  // Update the cart icon count
    }
};

// Function to remove an item from the cart
const removeFromCart = (id) => {
    let cart = getCart();

    // Remove the item by its ID
    cart = cart.filter(item => item.id !== id);

    // Save the updated cart to localStorage
    saveCart(cart);

    // Update the cart display and icon immediately
    updateCart();  // Re-render the cart content
    updateCartIcon();  // Update the cart icon count (across all pages)
};

// Function to clear the cart (on cart.html)
const clearCart = () => {
    saveCart([]); // Clear the cart by saving an empty array
    updateCart(); // Update the cart display to reflect the cleared cart
    updateCartIcon(); // Update the cart icon count across all pages
};

// On page load, update the cart icon and cart display
window.onload = function () {
    if (document.querySelector('.catalog_jewellery')) {
        // This is the product catalog page (index.html)
        updateCartIcon(); // Update the cart icon count on the catalog page
    } else if (document.querySelector('.cart-list')) {
        // This is the cart page (cart.html)
        updateCart(); // Update the cart content on the cart page
    }
};















// modaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal

// Reference to modal elements
const modal = document.querySelector('.modal-content');
const modalImage = document.querySelector('.modalImage');
const modalTitle = document.querySelector('.modalTitle');
const modalCategory = document.querySelector('.modalCategory');
const modalPrice = document.querySelector('.modalPrice');
const modalDescription = document.querySelector('.modalDescription');
const closeModal = document.querySelector('.close');

const addToCartBtn = document.getElementById('addToCartBtn'); // Add to Cart button



// Function to open modal with product details
const openModal = (product) => {
    modalImage.src = product.images; // Update image source
    modalTitle.textContent = product.title;
    modalCategory.textContent = `Category: ${product.category.name}`;
    modalPrice.textContent = `Price: $${product.price}`;
    modalDescription.textContent = product.description || "No description available."; // Assuming the API provides description


    modal.style.display = 'block'; // Show the modal
};






