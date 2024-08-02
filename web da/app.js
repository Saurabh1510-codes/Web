// Load JSON data using XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('GET', './products.json');
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        const data = JSON.parse(this.responseText);

        // Select necessary elements
        const wrapper = document.querySelector(".sliderWrapper");
        const menuItems = document.querySelectorAll(".menuItem");

        // Initialize chosen product with the first product from the data
        let chosenProduct = data[0];

        // Define product-related DOM elements
        const currentProductImg = document.querySelector(".productImg");
        const currentProductTitle = document.querySelector(".productTitle");
        const currentProductPrice = document.querySelector(".productPrice");
        const currentProductColors = document.querySelectorAll(".color");
        const currentProductSizes = document.querySelectorAll(".size");

        // Function to set a cookie with a specified key, value, and expiration time in minutes
        function setSessionCookie(key, value, minutes) {
            const expiration = new Date();
            expiration.setTime(expiration.getTime() + (minutes * 60 * 1000)); // Convert minutes to milliseconds
            const expires = "expires=" + expiration.toUTCString();
            document.cookie = `${key}=${value}; ${expires}; path=/`;
        }

        // Function to retrieve a cookie value by key
        function getSessionCookie(key) {
            const name = `${key}=`;
            const cookieStrings = document.cookie.split(';');
            for (const cookieString of cookieStrings) {
                const cookie = cookieString.trim();
                if (cookie.startsWith(name)) {
                    return cookie.substring(name.length);
                }
            }
            return null;
        }

        // Initialize cart items count from cookie or default to 0 if not found
        let cartItems = parseInt(getSessionCookie("cartItems")) || 0;

        // Update cart count display on the webpage
        function updateCartCountDisplay() {
            document.querySelector("#cartCount").textContent = cartItems;
        }

        // Initial update of cart count display
        updateCartCountDisplay();

        // Add event listeners to menu items to handle product selection
        menuItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                // Update wrapper transformation based on clicked menu item's index
                wrapper.style.transform = `translateX(${-100 * index}vw)`;

                // Update chosen product
                chosenProduct = data[index];

                // Update product information display
                currentProductTitle.textContent = chosenProduct.title;
                currentProductPrice.textContent = "$" + chosenProduct.price;
                currentProductImg.src = chosenProduct.colors[0].img;

                // Update color options display
                currentProductColors.forEach((color, colorIndex) => {
                    color.style.backgroundColor = chosenProduct.colors[colorIndex].code;
                });
            });
        });

        // Add event listeners to color and size elements for interactivity
        currentProductColors.forEach((color, index) => {
            color.addEventListener("click", () => {
                // Update product image based on selected color
                currentProductImg.src = chosenProduct.colors[index].img;
            });
        });

        currentProductSizes.forEach((size, index) => {
            size.addEventListener("click", () => {
                // Reset all sizes and highlight the selected size
                currentProductSizes.forEach((size) => {
                    size.style.backgroundColor = "white";
                    size.style.color = "black";
                });
                size.style.backgroundColor = "black";
                size.style.color = "white";
            });
        });

        // Add event listeners for payment modal
        const productButton = document.querySelector(".productButton");
        const payment = document.querySelector(".payment");
        const closeButton = document.querySelector(".close");

        productButton.addEventListener("click", () => {
            payment.style.display = "flex";
        });

        closeButton.addEventListener("click", () => {
            payment.style.display = "none";
        });

        // Add event listener for adding products to the cart
        document.querySelector(".addToCart").addEventListener("click", () => {
            // Increment cart items count
            cartItems++;

            // Update cart count display
            updateCartCountDisplay();

            // Save cart items count in a cookie with 1-minute expiration time
            setSessionCookie("cartItems", cartItems, 1);
        });
    }
};
xhr.send();
