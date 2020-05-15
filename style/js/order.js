// document.querySelector('.send-order').onclick = function(event) {
//     event.preventDefault();
//     fetch('/checkout', {
//             method: "POST",
//             body: JSON.stringify({

//                 key: Object.keys(cart)
//             }),
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(function(response) {
//             return response.text();
//         })
//         .then(function(body) {
//             if (body == 1) {

//             } else {

//             }
//         });
// }