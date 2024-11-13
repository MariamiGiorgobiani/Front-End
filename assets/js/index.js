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
                <p>${item.title}</p>
                <p>${item.price}$</p>
                <p>Category: ${item.category.name}</p>
                <button class="cart" onclick="addToCart(${item.id}, '${item.title}', ${item.price}, '${item.images[0]}')">Add to Cart</button>
            </div>
            `;
        });

        document.querySelector('.jewellery').innerHTML = temp;
    };
}