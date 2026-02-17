const BASE_URL = "https://fakestoreapi.com";

// ------------------ CART SYSTEM ------------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        cartCountEl.innerText = getCart().length;
    }
}

// Add product to cart
function addToCart(id) {
    id = parseInt(id);
    let cart = getCart();

    if (!cart.includes(id)) {
        cart.push(id);
        setCart(cart);
        renderCartSidebar(); 
    } else {
        alert("Product already in cart!");
    }
}

// ------------------ CART SIDEBAR ------------------
const cartSidebar = document.getElementById("cartSidebar");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

// Open/close cart sidebar
cartToggle.addEventListener("click", () => {
    sidebarMenu.classList.add("translate-x-full"); 
    renderCartSidebar();
    cartSidebar.classList.remove("translate-x-full");
});

closeCart.addEventListener("click", () => cartSidebar.classList.add("translate-x-full"));

// Render cart items in sidebar
function renderCartSidebar() {
    const cartIds = getCart();
    cartItemsContainer.innerHTML = "";

    if (cartIds.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center mt-10">Your cart is empty.</p>`;
        cartTotalEl.innerText = "$0.00";
        return;
    }

    Promise.all(cartIds.map(id => fetch(`${BASE_URL}/products/${id}`).then(res => res.json())))
        .then(products => {
            let total = 0;
            products.forEach(product => {
                total += product.price;

                const itemEl = document.createElement("div");
                itemEl.className = "flex items-center gap-3 border-b pb-3";

                itemEl.innerHTML = `
                    <img src="${product.image}" class="h-16 w-16 object-contain rounded-lg"/>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 text-sm line-clamp-1">${product.title}</h4>
                        <p class="text-gray-500 text-sm">$${product.price}</p>
                    </div>
                    <button data-id="${product.id}" class="removeCartBtn text-red-500 hover:text-red-700">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;

                cartItemsContainer.appendChild(itemEl);
            });

            cartTotalEl.innerText = `$${total.toFixed(2)}`;
        });
}

// Remove item from cart
cartItemsContainer.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".removeCartBtn");
    if (!removeBtn) return;

    const id = parseInt(removeBtn.dataset.id);
    let cart = getCart();
    cart = cart.filter(pid => pid !== id);
    setCart(cart);
    renderCartSidebar();
});

// ---------------- CARD TEMPLATE -----------------
function createTrendingCard(product) {
    return `
    <div class="bg-white shadow-lg rounded-2xl hover:shadow-2xl transition flex flex-col h-full">

        <!-- Image -->
        <figure class="p-6 bg-gray-50 h-52 flex justify-center items-center">
            <img src="${product.image}" class="h-40 object-contain"/>
        </figure>

        <!-- Content -->
        <div class="p-5 flex flex-col flex-1">

            <!-- Title -->
            <h3 class="font-semibold text-lg line-clamp-2 mb-2 min-h-[56px]">
                ${product.title}
            </h3>

            <!-- Price + Rating -->
            <div class="flex justify-between items-center mb-4">
                <span class="text-blue-600 font-bold text-lg">
                    $${product.price}
                </span>

                <span class="text-yellow-500 text-sm">
                    ⭐ ${product.rating.rate}
                </span>
            </div>

            <div class="flex gap-2 mt-3">

                <button data-id="${product.id}"
                    class="details-btn flex-1 py-2 rounded-lg border text-blue-900  border-gray-300 hover:bg-purple-300 text-sm">
                    <i class="fa-regular fa-eye mr-1"></i>
                    Details
                </button>

                <button data-id="${product.id}"
                    class="add-btn flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:scale-105 transition text-sm">
                    <i class="fa-solid fa-cart-arrow-down mr-1"></i>
                    Add
                </button>

            </div>

        </div>
    </div>
    `;
}

// ---------------- SHOW DETAILS -----------------
async function showDetails(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    const product = await res.json();

    const modalContent = document.getElementById("modalContent");

    modalContent.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-6 items-center">

            <img src="${product.image}" 
                class="h-64 w-64 object-contain rounded-xl shadow-lg"/>

            <div class="flex-1">

                <h2 class="text-2xl font-bold text-gray-800 mb-3">
                    ${product.title}
                </h2>

                <p class="text-gray-500 mb-4">
                    ${product.description}
                </p>

                <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl font-bold text-blue-600">
                        $${product.price}
                    </span>

                    <div class="text-gray-600">
                        ⭐ ${product.rating.rate}
                        <span class="text-sm">(${product.rating.count} reviews)</span>
                    </div>
                </div>

                <button data-id="${product.id}"
                    class="modal-add-btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:scale-105 transition">
                    Add To Cart
                </button>

            </div>
        </div>
    `;

    document.getElementById("productModal").showModal();
}

// ---------------- LOAD TRENDING -----------------
async function loadTrending() {
    const res = await fetch(`${BASE_URL}/products`);
    const products = await res.json();

    // Top 3 by rating
    const topThree = products.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);

    const container = document.getElementById("trendingContainer");

    let html = "";
    topThree.forEach(product => html += createTrendingCard(product));

    container.innerHTML = html;
}

// ---------------- EVENT LISTENERS -----------------
document.addEventListener("click", (e) => {
    const target = e.target;

    const addBtn = target.closest(".add-btn");
    if (addBtn) addToCart(addBtn.dataset.id);

    const detailsBtn = target.closest(".details-btn");
    if (detailsBtn) showDetails(detailsBtn.dataset.id);

    const modalBtn = target.closest(".modal-add-btn");
    if (modalBtn) {
        addToCart(modalBtn.dataset.id);
        document.getElementById("productModal").close();
    }
});

// ---------------- INIT -----------------
loadTrending();
updateCartCount();
