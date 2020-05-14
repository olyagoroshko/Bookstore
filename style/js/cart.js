let cart = {};
document.querySelectorAll(".add-to-cart").forEach(function(element) {
    console.log('ok_c');
    element.onclick = addToCart;
});

if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetBookInfo();
}


function addToCart() {
    let booksId = this.dataset.books_id;
    if (cart[booksId]) {
        cart[booksId]++;
    } else {
        cart[booksId] = 1;
    }
    console.log(cart);
    ajaxGetBookInfo();
}


function ajaxGetBookInfo() {
    updeteLocalStoradeCart();
    fetch('/cart', {
            method: "POST",
            body: JSON.stringify({
                key: Object.keys(cart)
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            return response.text();
        })
        .then(function(body) {
            console.log(body);
            showCart(JSON.parse(body));
        });
}

function showCart(data) {
    let productContainer = '<tr class="checkout">';
    let total = 0;
    for (let key in cart) {
        productContainer += ` <td class="product-thumbnail"><a href="#"><img src="images/product/sm-3/1.jpg" alt="product img"></a></td>`
        productContainer += `<td class="product-name"><span>${data[key]['Title']}</span></td>`
        productContainer += `<td class="product-price"><span class="price">$${(data[key]['Price']*cart[key]).toFixed(2)}</span></td>`
        productContainer += `<td class="product-quantity"><ion-icon class="cart-minus" data-books_id="${key}" name="remove-circle-outline"></ion-icon><span>${cart[key]}<span><ion-icon class="cart-plus" data-books_id="${key}" name="add-circle-outline"></ion-icon></td>`
        productContainer += `<td class="product-remove"><a data-books_id="${key}" class="btn-remove">×</a></td>`
        productContainer += `</tr>`
        total += cart[key] * (data[key]['Price']).toFixed(2);
    }
    // productContainer += `</tr>`
    productContainer += `
            <div class="row">
            <div class="cart__total__amount col-md-8">
                <span>Grand Total</span>
                <span class="grandTotal">$${total.toFixed(2)}</span>
            </div>
        </div>
    `
    document.querySelector(".cart-items").innerHTML = productContainer;
    document.querySelectorAll('.cart-minus').forEach(function(element) {
        element.onclick = cartMinus;
    });
    document.querySelectorAll('.cart-plus').forEach(function(element) {
        element.onclick = cartPlus;
    });
    document.querySelectorAll('.btn-remove').forEach(function(element) {
        element.onclick = btnRemove;
    });
}

function cartPlus() {
    let booksId = this.dataset.books_id;
    cart[booksId]++;
    ajaxGetBookInfo();
}

function cartMinus() {
    let booksId = this.dataset.books_id;
    if (cart[booksId] - 1 > 0) {
        cart[booksId]--;
    } else {
        delete(cart[booksId]);
    }
    ajaxGetBookInfo();
}

function btnRemove() {
    let booksId = this.dataset.books_id;
    if (cart[booksId]) {
        delete(cart[booksId]);
    }

    ajaxGetBookInfo();
}


function updeteLocalStoradeCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}