console.log('ok_w');
let wishlist = {};
document.querySelectorAll(".add-to-wishlist").forEach(function(element) {
    element.onclick = addToWishlist;
});

if (localStorage.getItem('wishlist')) {
    wishlist = JSON.parse(localStorage.getItem('wishlist'));
    ajaxGetBookInfoWishlist();
}

function addToWishlist() {
    let booksId = this.dataset.books_id;
    if (wishlist[booksId]) {
        wishlist[booksId]++;
    } else {
        wishlist[booksId] = 1;
    }
    console.log(wishlist);
    ajaxGetBookInfoWishlist();
}

function ajaxGetBookInfoWishlist() {
    updeteLocalStoradeWishlist();
    fetch('/wishlist', {
            method: "POST",
            body: JSON.stringify({
                key: Object.keys(wishlist)
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
            showWishlist(JSON.parse(body));
        });
}

function showWishlist(data) {
    let productContainerWishlist = '<tr>';
    for (let key in wishlist) {
        productContainerWishlist += `<td class="product-remove"><a data-books_id="${key}" class="btn-remove">×</a></td>`
        productContainerWishlist += `<td class="product-thumbnail"><a href="#"><img src="images/product/sm-3/1.jpg" alt=""></a></td>`
        productContainerWishlist += `<td class="product-name"><span>${data[key]['Title']}</span></td>`
        productContainerWishlist += `<td class="product-price"><span class="price">$${data[key]['Price']}</span></td>`
        productContainerWishlist += `<td class="product-stock-status"><span class="wishlist-in-stock">${data[key]['IsInStore']}</span></td>`
        productContainerWishlist += `<td class="product-add-to-cart"><a href="/single-product/${key}/">Show Info</a></td>`
        productContainerWishlist += `</tr>`
    }
    // productContainer += `</tr>`
    // productContainerWishlist += `
    //         <div class="row">
    //         <div class="cart__total__amount col-md-8">
    //             <span>Grand Total</span>
    //             <span class="grandTotal">$${total}</span>
    //         </div>
    //         <div class="col-md-4">
    //             <ul class="cart__btn__list d-flex flex-wrap flex-md-nowrap flex-lg-nowrap justify-content-between ">
    //                 <li><a href="#">Make an order</a></li>
    //             </ul>
    //         </div>
    //     </div>
    // `
    document.querySelector(".wishlist-items").innerHTML = productContainerWishlist;
    // document.querySelectorAll('.cart-minus').forEach(function(element) {
    //     element.onclick = cartMinus;
    // });
    // document.querySelectorAll('.cart-plus').forEach(function(element) {
    //     element.onclick = cartPlus;
    // });
    document.querySelectorAll('.btn-remove').forEach(function(element) {
        element.onclick = btnRemoveWishlist;
    });
}


function btnRemoveWishlist() {
    let booksId = this.dataset.books_id;
    if (wishlist[booksId]) {
        delete(wishlist[booksId]);
    }
    ajaxGetBookInfoWishlist();
}


function updeteLocalStoradeWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}