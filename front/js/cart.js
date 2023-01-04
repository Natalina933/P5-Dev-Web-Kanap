// let displayProductInCart = document.querySelector("#cart__items");

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

let panier = [];
let infos = [];

// Récupérer la liste dans le localStorage
function getFromCache() {
  const jsonFromCache = localStorage.getItem("panier");
  if (!jsonFromCache || jsonFromCache === undefined) {
    return [];
  }

  return JSON.parse(jsonFromCache);
}
panier = getFromCache();
// Récupérer un produit depuis l'API
function getProductFromAPI(id) {
  return fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((product) => {
      return product;
    });
}
console.log(panier);
// supprimer le panier

function deleteItem(id, color) {
  panier = panier.filter(
    (article) => article._id != id || article.color != color
  );
  localStorage.setItem("panier", JSON.stringify(panier));
  refreshDisplay();
}
//Tableau contenant les promesse des infos de chaque produit de son panier récupérer dans le localStage
const tableauPromesse = panier.map((productInCart) =>
  getProductFromAPI(productInCart._id)
);

Promise.all(tableauPromesse).then((productsFromAPI) => {
  infos = productsFromAPI;
  refreshDisplay();
});

//Créer et insérer des éléments
function refreshDisplay() {
  document.getElementById("cart__items").innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;

  for (let article of panier) {
    const productsFromAPI = infos.find(
      (product) => product._id === article._id
    );
    let articleElt = document.createElement("article");
    articleElt.classList.add("cart__item");
    articleElt.dataset.id = productsFromAPI._id;
    articleElt.dataset.color = article.color;
    articleElt.innerHTML = `
        <div class="cart__item__img">
            <img src="${productsFromAPI.imageUrl}" alt="${productsFromAPI.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${productsFromAPI.name}</h2>
                    <p>${article.color}</p>
                    <p>${productsFromAPI.price + " €"}</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}"">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                    </div>
                </div>
        `;
        totalQuantity += article.quantity;
        totalPrice += productsFromAPI.price * article.quantity;

        document.getElementById("totalPrice").innerHTML = totalPrice + " €";
        document.getElementById("totalQuantity").innerHTML = totalQuantity;

    articleElt
      .querySelector(".deleteItem")
      .addEventListener("click", function (event) {
        event.preventDefault();
        const id = articleElt.dataset.id;
        const color = articleElt.dataset.color;
        deleteItem(id, color);
      });

    //pointer sur l'élément items et injecter l' html dans le dom
    document.getElementById("cart__items").appendChild(articleElt);
  }
  function updatePriceAndQuantity(id, color, newValue) {
    const itemToUpdate = panier.find((article) => article._id != id && article.color != color);
    if (itemToUpdate) {
      itemToUpdate.quantity = Number(newValue);
      item.quantity = itemToUpdate.quantity
      displayTotalQuantity();
      displayTotalPrice();
    }
    refreshDisplay();
  }
  totalQuantity += article.quantity;
  totalPrice += productsFromAPI.price * article.quantity;

  document.getElementById("totalPrice").innerHTML = totalPrice + " €";
  document.getElementById("totalQuantity").innerHTML = totalQuantity;

}

// .catch((err) => console.log(err));

