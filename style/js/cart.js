// console.log("ok");

// import { json } from "body-parser";

// let carts = document.querySelectorAll('.cart');


// let products = [{
//     name: "123",
//     price: 123,
//     inCart: 0
// }]

// for (let i = 0; i < carts.length; i++) {
//     carts[i].addEventListener('click', function() {
//         cartNumbers(products[i]);
//         totalCost(products[i])
//     })
// }
// console.log("1");

// function onLoadCartNumbers() {
//     let productNumber = localStorage.getItem('cartNumbers');
//     console.log("2");
//     if (productNumber) {
//         document.querySelector('.shopcart span').textContent = productNumber;
//     }
// }
// console.log("2");

// function cartNumbers(product) {

//     let productNumber = localStorage.getItem('cartNumbers');
//     productNumber = parseInt(productNumber);

//     if (productNumber) {
//         localStorage.setItem('cartNumbers', productNumber + 1);
//         document.querySelector('.shopcart span').textContent = productNumber + 1;
//     } else {
//         localStorage.setItem('cartNumbers', 1)
//         document.querySelector('.shopcart span').textContent = 1;
//     }
//     setItems(product);
// }

// function setItems(product) {
//     let cartItems = localStorage.getItem('productsInCart');
//     cartItems = JSON.parse(cartItems);

//     if (cartItems != null) {
//         if (cartItems[product.name] == undefined) {
//             cartItems = {
//                 ...cartItems,
//                 [product.name]: product
//             }
//         }
//         cartItems[product.name].inCart += 1;
//     } else {
//         product.inCart = 1;
//         cartItems = {
//             [product.name]: product
//         }
//     }
//     localStorage.setItem("productsInCart", JSON.stringify(cartItems))
// }





// function totalCost(product) {
//     let cartCost = localStorage.getItem("totalCost");
//     if (cartCost != null) {
//         cartCost = parseInt(cartCost);
//         localStorage.setItem("totalCost", cartCost + product.price);
//     } else {
//         localStorage.setItem("totalCost", product.price);
//     }
// }

// function displayCart() {
//     let cartItems = localStorage.getItem("productsInCart");
//     cartItems = JSON.parse(cartItems);
//     let productContainer = document.querySelector(".cart-items");
//     let cartCost = localStorage.getItem("totalCost");

//     if (cartItems && productContainer) {
//         productContainer.innerHTML = '';
//         Object.values(cartItems).map(item => {
//             productContainer.innerHTML += `   
//             <tr class="checkout">
//                 <td class="product-thumbnail"><a href="#"><img src="images/product/sm-3/1.jpg" alt="product img"></a></td>
//                 <td class="product-name"><span>${item.name}</span></td>
//                 <td class="product-price"><span class="price">${item.price}</span></td>
//                 <td class="product-quantity"><input class = "quantity" type="number" value="${item.inCart}"></td>
//                 <td class="product-subtotal"><span class = "subtotal">$${item.inCart * item.price}</span></td>
//                 <td class="product-remove"><a class="btn-remove">X</a></td>
//             </tr>
//             `
//         });

//         let productTotalCosr = document.querySelector(".cartbox__btn");
//         productTotalCosr.innerHTML += `
//         <div class="row">
//             <div class="cart__total__amount col-md-8">
//                 <span>Grand Total</span>
//                 <span class="grandTotal">$${cartCost}</span>
//             </div>
//             <div class="col-md-4">
//                 <ul class="cart__btn__list d-flex flex-wrap flex-md-nowrap flex-lg-nowrap justify-content-between ">
//                     <li><a href="#">Make an order</a></li>
//                 </ul>
//             </div>
//         </div>`

//         let quantity = document.querySelectorAll(".quantity"),
//             subtotal = document.querySelectorAll(".subtotal"),
//             price = document.querySelectorAll(".price");

//         for (let i = 0; i < quantity.length; i++) {
//             quantity[i].addEventListener('change', function(product) {
//                 console.log(+quantity[i].value);
//                 console.log(+price[i].textContent);
//                 // console.log(typeof product.inCart);
//                 // quantity[i].value = localStorage.setItem("productsInCart", product.inCart);
//                 subtotal[i].textContent = `$${+quantity[i].value * +price[i].textContent}`

//             })
//         }
//         // let quantityInput = document.querySelectorAll(".quantity");


//         // for (let i = 0; i < quantityInput.length; i++) {
//         //     let input = quantityInput[i],
//         //         totalItem = document.querySelector(".product-subtotal"),
//         //         total = 0;
//         //     totalItem.addEventListener('change', function(event) {
//         //         input = event.target



//         //     })
//         // }

//     }
// }



// onLoadCartNumbers();
// displayCart();


let cart = {};
document.querySelectorAll(".add-to-cart").forEach(function(element) {
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
        productContainer += `<td class="product-price"><span class="price">$${data[key]['Price']*cart[key]}</span></td>`
        productContainer += `<td class="product-quantity"><ion-icon class="cart-minus" data-books_id="${key}" name="remove-circle-outline"></ion-icon><span>${cart[key]}<span><ion-icon class="cart-plus" data-books_id="${key}" name="add-circle-outline"></ion-icon></td>`
        productContainer += `</tr>`
        total += cart[key] * data[key]['Price'];
    }
    // productContainer += `</tr>`
    productContainer += `
            <div class="row">
            <div class="cart__total__amount col-md-8">
                <span>Grand Total</span>
                <span class="grandTotal">$${total}</span>
            </div>
            <div class="col-md-4">
                <ul class="cart__btn__list d-flex flex-wrap flex-md-nowrap flex-lg-nowrap justify-content-between ">
                    <li><a href="#">Make an order</a></li>
                </ul>
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

function updeteLocalStoradeCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}