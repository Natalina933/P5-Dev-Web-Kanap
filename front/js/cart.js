//On stock un tableau vie dans une variable
const cart = [];

// Promesse - Récupérer la liste dans le localStorage
function salvageFromCache() {
    const numberOfItems = localStorage.length;
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i));
        const itemObjet = JSON.parse(item); //transf. objet
        cart.push(itemObjet);
    
        console.log(cart);
    }
}
salvageFromCache()

fetch()
    .then((res) => res.json()) //promesse en demande une autre promesse
    //boucle - parcourir l'api
    .then((products) => {
    for (let article of products) {
        let display = ""; // affiche le html
        display += `
        <article class="cart__item" data-id="${article._id}" data-color="{product-color}">
                <div class="cart__item__img">
                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${article.name}</h2>
                    <p>${article.color}</p>
                    <p>${article.price}</p>
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
        document //pointer sur l'élément items et injecter l' html dans le dom
            .getElementById("cart__items")
            .insertAdjacentHTML("beforeend", display);
        }
    })
    .catch((err) => console.log(err));

