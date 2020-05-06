// // // let cartItemContainer = document.getElementsByClassName('cart-items')[0],
// // //     cartRows = cartItemContainer.getElementsByClassName('checkout'),
// // //     total = 0;

// // // function quantityChanged(event) {
// // //     var input = event.target
// // //     if (isNaN(input.value) || input.value <= 0) {
// // //         input.value = 1
// // //     }

// // // }

// // // function updateCartTotal() {
// // //     let total = 0;
// // //     for (let i = 0; i < cartRows.length; i++) {
// // //         let cartRow = cartRows[i],
// // //             priceElement = cartRow.getElementsByClassName('price')[0],
// // //             quantityElement = cartRow.getElementsByClassName('quantity')[0],
// // //             price = parseFloat(priceElement.innerText.replace('$', '')),
// // //             quantity = quantityElement.value;
// // //         total = total + (price * quantity);
// // //         console.log("+")

// // //     }

// // //     document.getElementsByTagName('grandTotal')[0].innerText = '$' + total;
// // // }

// console.log("ok");

// let carts = document.querySelectorAll('.cart');


// let products = [{
//     name: name,
//     price: price,
//     inCart: 0
// }]

// for (let i = 0; i < carts.length; i++) {
//     carts[i].addEventListener('click', function() {
//         cartNumbers(products[i]);
//         totalCost(products[i])
//     })
// }

// function onLoadCartNumbers() {
//     let productNumber = localStorage.getItem('cartNumbers');

//     if (productNumber) {
//         document.querySelector('.shopcart span').textContent = productNumber;
//     }
// }

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

// // module.exports = function Cart(oldCart) {
// //     this.items = oldCart.items;
// //     this.totalQty = oldCart.totalQty;
// //     this.totalPrice = oldCart.totalPrice;


// //     this.add = function(item, id) {
// //         let storedItem = this.items[id];
// //         if (!storedItem) {
// //             storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
// //         }
// //         storedItem.qty++;
// //         storedItem.price = storedItem.item.price * storedItem.qty;
// //         this.totalQty++;
// //         this.totalPrice += storedItem.price;
// //     };

// //     this.generateArray = function() {
// //         let arr = [];
// //         for (let i in this.items) {
// //             arr.push(this.items[id]);
// //         }
// //     };

// // };