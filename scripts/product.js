const BASE_URL = "https://fakestoreapi.com";

const categoryContainer = document.getElementById("categoryContainer");
const productContainer = document.getElementById("productContainer");
const loader = document.getElementById("loader");

// ------------------ CART SYSTEM ------------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        cartCountEl.innerText = getCart().length;
    }
}

function addToCart(id) {
    id = parseInt(id);
    let cart = getCart();

    if (!cart.includes(id)) {
        cart.push(id);
        setCart(cart);
    } else {
        alert("Product already in cart!");
    }
}


// ---------------- LOAD CATEGORIES ----------------
const loadCategories = async () => {
    try {
        const res = await fetch(`${BASE_URL}/products/categories`);
        const categories = await res.json();

        let html = `
            <button data-category=""
              class="category-btn px-5 py-2 rounded-full 
              bg-gradient-to-r from-blue-600 to-purple-600 
              text-white font-semibold shadow">
              All
            </button>
        `;

        categories.forEach(cat => {
            html += `
                <button data-category="${cat}"
                  class="category-btn px-5 py-2 rounded-full 
                  bg-gradient-to-r from-blue-600 to-purple-600 
                  text-white backdrop-blur border border-white/50 
                  shadow hover:scale-105 transition">
                  ${cat}
                </button>
            `;
        });

        categoryContainer.innerHTML = html;

    } catch (error) {
        console.error("Error loading categories:", error);
    }
};

// ---------------- LOAD PRODUCTS ----------------
const loadProducts = async (category = "") => {
    try {
        loader.classList.remove("hidden");
        productContainer.innerHTML = "";

        let url = category
            ? `${BASE_URL}/products/category/${encodeURIComponent(category)}`
            : `${BASE_URL}/products`;

        const res = await fetch(url);
        const products = await res.json();

        loader.classList.add("hidden");

        let html = "";
        products.forEach(product => {
            html += createCard(product);
        });

        productContainer.innerHTML = html;

        setActiveButton(category);

    } catch (error) {
        loader.classList.add("hidden");
        console.error("Error loading products:", error);
    }
};

// ---------------- CARD TEMPLATE -----------------
function createCard(product) {
    return `
    <div class="relative bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 hover:scale-102 duration-300 border border-gray-100">
        
        <figure class="p-4 bg-gray-50 flex items-center justify-center h-40">
            <img src="${product.image}" class="h-32 object-contain transition-transform hover:scale-105"/>
        </figure>

        <div class="p-3 flex flex-col justify-between h-52">
            <div>
                <span class="text-xs uppercase tracking-widest text-gray-400">${product.category}</span>
                <h3 class="text-base font-bold text-gray-800 line-clamp-2">
                    ${product.title}
                </h3>
            </div>

            <span class="absolute top-3 right-3 z-10 px-2 py-1 text-sm font-bold rounded-full bg-white/90 text-gray-800 shadow">
                $${product.price}
            </span>

            <div class="flex justify-between items-center text-sm mt-1">
                <span class="text-yellow-500 font-semibold">⭐ ${product.rating.rate}</span>
                <span class="text-gray-500">(${product.rating.count})</span>
            </div>

            <div class="flex justify-around pt-1">
                <button data-id="${product.id}"
                    class="details-btn flex items-center justify-center gap-1 px-4 py-1.5 rounded-xl text-blue-900 border border-gray-300 hover:bg-purple-300 text-sm">
                    <i class="fa-regular fa-eye text-blue-900"></i>
                    Details
                </button>

                <button data-id="${product.id}"
                    class="add-btn flex items-center justify-center gap-2 px-5 py-1.5 rounded-xl
                           bg-gradient-to-r from-blue-600 to-purple-600
                           text-white font-semibold hover:scale-105 transition text-sm">
                    <i class="fa-solid fa-cart-arrow-down text-white text-lg"></i>
                    Add
                </button>
            </div>
        </div>
    </div>
    `;
}

// ---------------- MODAL -----------------
const showDetails = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`);
        const product = await res.json();

        const modalContent = document.getElementById("modalContent");

        modalContent.innerHTML = `
            <div class="flex flex-col lg:flex-row gap-6 items-center">
                <img src="${product.image}" class="h-64 w-64 object-contain rounded-xl shadow-lg"/>

                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${product.title}</h2>
                    <p class="text-gray-500 mb-4">${product.description}</p>
                    <p class="text-xl font-semibold text-gray-800 mb-2">Price: $${product.price}</p>
                    <p class="text-yellow-500 mb-4">Rating: ⭐ ${product.rating.rate}</p>
                    <button data-id="${product.id}" class="modal-add-btn w-full bg-gradient-to-r from-blue-600 to-purple-600
                           text-white font-semibold hover:from-blue-600 hover:to-blue-800 rounded-lg">
                        Add To Cart
                    </button>
                </div>
            </div>
        `;

        document.getElementById("productModal").showModal();

    } catch (error) {
        console.error("Error loading product details:", error);
    }
};

// ---------------- ACTIVE CATEGORY ------------------
function setActiveButton(category) {
    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white");
        btn.classList.add("btn-outline");

        if (btn.dataset.category === category) {
            btn.classList.remove("btn-outline");
            btn.classList.add("bg-blue-600", "text-white");
        }
    });
}

// ---------------- EVENT LISTENERS ------------------

// Category click
categoryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
        const category = e.target.dataset.category;
        loadProducts(category);
    }
});

// Product buttons
productContainer.addEventListener("click", (e) => {
    const detailsBtn = e.target.closest(".details-btn");
    if (detailsBtn) {
        showDetails(detailsBtn.dataset.id);
    }

    const addBtn = e.target.closest(".add-btn");
    if (addBtn) {
        addToCart(addBtn.dataset.id);
    }

    const modalBtn = e.target.closest(".modal-add-btn");
    if (modalBtn) {
        addToCart(modalBtn.dataset.id);
        document.getElementById("productModal").close();
    }
});

// ---------------- INIT ------------------
loadCategories();
loadProducts();
updateCartCount();
