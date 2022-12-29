//On stock un tableau vide dans une variable
const cart = [];
let displayProductInCart = document.querySelector("#cart__items");
// let cart = JSON.parse(localStorage.getItem("panier")) || []; //transf. string

// Promesse - Récupérer la liste dans le localStorage
function salvageFromCache() {
    const numberOfItems = localStorage.length;
    for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem("panier");
    const itemObjet = JSON.parse(item); //transf. objet
    cart.push(itemObjet);

    console.log(cart);
    }
}
salvageFromCache();

// const tabPromises =salvageFromCache.map( id => {
// 	return fetch("http://locahost:3000/request/"+ id)
// })

// Promise.all(tabPromises)
// 	.then(tabResponse => {
// 		return Promise.all(tabRespose.map(response => response.json()))
// 	})
// 	.then(tabResult => {
// 		console.log(tabResult)
// 	})

//Créer et insérer des éléments dans la page Panier.
fetch("http://locahost:3000/product/"+id)
    .then((res) => res.json()) //promesse en demande une autre promesse
  //boucle - parcourir l'api
    .then((products) => {
    for (let article of products) {
      let display = ""; // affiche le html
        display += `
        <article class="cart__item" data-id="${cart._id}" data-color="{product-color}">
                <div class="cart__item__img">
                    <img src="${cart.imageUrl}" alt="${cart.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${cart.name}</h2>
                    <p>${cart.color}</p>
                    <p>${cart.price}</p>
                </div>
                //   <div class="cart__item__content__settings">
                //     <div class="cart__item__content__settings__quantity">
                //       <p>Qté : </p>
                //       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                //     </div>
                //     <div class="cart__item__content__settings__delete">
                //       <p class="deleteItem">Supprimer</p>
                //     </div>
                    // </div>
                </div>
        </article>
`;
      //pointer sur l'élément items et injecter l' html dans le dom
      document
        .getElementById("cart__items")
        .insertAdjacentHTML("beforeend", display);
    }
  })
  .catch((err) => console.log(err));
