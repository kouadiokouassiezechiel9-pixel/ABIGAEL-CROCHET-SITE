const modal = document.getElementById("contact-modal");
const checkoutBtn = document.getElementById("checkout-btn");
const closeBtn = document.querySelector(".close-btn");
const categoryButtons = document.querySelectorAll(".categories .badge");
const productCards = document.querySelectorAll(".tous .card");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");

let cart = [];

const formatPrice = n => n.toLocaleString("fr-FR");

// Met à jour le prix affiché quand on change de taille (S/M ou L/XL)
document.querySelectorAll(".size-select").forEach(select => {
    select.addEventListener("change", function () {
        const price = parseInt(this.selectedOptions[0].dataset.price);
        const priceElement = this.closest(".card").querySelector(".price");
        priceElement.dataset.price = price;
        priceElement.innerText = formatPrice(price) + " FCFA";
    });
});

// Ajout au panier : un article = produit + groupe de tailles
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function () {
        const card = this.closest(".card");
        const name = card.querySelector("h3").innerText;
        const price = parseInt(card.querySelector(".price").dataset.price);
        const select = card.querySelector(".size-select");
        const size = select ? select.value : "";

        const existingItem = cart.find(item => item.name === name && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, size, price, quantity: 1 });
        }
        updateCartDisplay();
    });
});

function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function itemLabel(item) {
    const sizeText = item.size ? ` (${item.size})` : "";
    const qtyText = item.quantity > 1 ? ` x ${item.quantity}` : "";
    return `${item.name}${sizeText}${qtyText}`;
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const el = document.createElement("div");
        el.classList.add("cart-item");
        el.innerHTML = `<span>${itemLabel(item)}</span> <span>${formatPrice(item.price * item.quantity)} FCFA</span>`;
        cartItemsContainer.appendChild(el);
    });
    cartTotalElement.innerText = formatPrice(getTotal());
    cartCountElement.innerText = cart.reduce((count, item) => count + item.quantity, 0);
}

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    modal.classList.add("active");
});

closeBtn.addEventListener("click", () => modal.classList.remove("active"));

window.addEventListener("click", function (event) {
    if (event.target == modal) modal.classList.remove("active");
});

categoryButtons.forEach(button => {
    button.addEventListener("click", function (e) {
        e.preventDefault();
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        const category = this.getAttribute("data-category");
        productCards.forEach(card => {
            const show = category === "all" || card.getAttribute("data-category") === category;
            card.classList.toggle("hidden", !show);
        });
    });
});

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = document.getElementById("name").value;
    const telephone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    const detailsCommande = cart
        .map(item => `${itemLabel(item)} (${formatPrice(item.price * item.quantity)} FCFA)`)
        .join(", ");

    const telephoneBoutique = "2250161334977";

    const texteMessage =
        `Bonjour, je suis ${nom}.\n` +
        `Téléphone : ${telephone}\n` +
        `Email : ${email}\n\n` +
        `Commande : ${detailsCommande}\n` +
        `Total : ${formatPrice(getTotal())} FCFA`;

    window.open(`https://wa.me/${telephoneBoutique}?text=${encodeURIComponent(texteMessage)}`, "_blank");
});


// Lightbox : agrandir une image au clic
const lightboxOverlay = document.getElementById("lightbox-overlay");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".zoomable").forEach(img => {
    img.addEventListener("click", function () {
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt;
        lightboxOverlay.classList.add("active");
    });
});

lightboxClose.addEventListener("click", () => {
    lightboxOverlay.classList.remove("active");
});

lightboxOverlay.addEventListener("click", function (event) {
    if (event.target === lightboxOverlay) {
        lightboxOverlay.classList.remove("active");
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        lightboxOverlay.classList.remove("active");
    }
});
