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
    (article) => article._id !== id || article.color !== color
  );
  localStorage.setItem("panier", JSON.stringify(panier));
  refreshDisplay();
}
//Change la quantité et le prix
function updatePriceAndQuantity(id, color, newValue) {
  // Trouvé l'article dans le panier
  const article = panier.find(
    (article) => article._id === id && article.color === color
  );
  // Modifier l'article
  article.quantity = newValue;

  console.log(article.quantity);
  //update le localStorage
  localStorage.setItem("panier", JSON.stringify(panier));
  //update le DOM
  refreshDisplay();
}

//Tableau contenant les promesse des infos de chaque produit de son panier récupérer dans le localStage
const tableauPromesse = panier.map((productInCart) =>
  getProductFromAPI(productInCart._id)
);

Promise.all(tableauPromesse)
  .then((productsFromAPI) => {
    infos = productsFromAPI;
    refreshDisplay();
  })
  .catch((err) => {
    console.log(err);
    alert("Une erreur est survenue");
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
            <img src="${productsFromAPI.imageUrl}" alt="${
      productsFromAPI.altTxt
    }">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${productsFromAPI.name}</h2>
                    <p>${article.color}</p>
                    <p>${productsFromAPI.price.toFixed(2)} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                          article.quantity
                        }">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                    </div>
                </div>
        `;
    totalQuantity += parseInt(article.quantity);
    totalPrice += productsFromAPI.price * article.quantity;

    articleElt
      .querySelector(".deleteItem")
      .addEventListener("click", function (event) {
        event.preventDefault();
        const id = articleElt.dataset.id;
        const color = articleElt.dataset.color;
        deleteItem(id, color);
      });

    articleElt
      .querySelector(".itemQuantity")
      .addEventListener("change", function (event) {
        event.preventDefault();
        const id = articleElt.dataset.id;
        const color = articleElt.dataset.color;
        const newValue = event.target.value;
        updatePriceAndQuantity(id, color, newValue);
        console.log(event);
      });
    //pointer sur l'élément items et injecter l' html dans le dom
    document.getElementById("cart__items").appendChild(articleElt);
  }

  document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
  document.getElementById("totalQuantity").textContent = totalQuantity;
}
document.getElementById("order").addEventListener("click", function (event) {
  event.preventDefault();
//Récupérer les valeurs du formulaire
const firstName = document.getElementById("firstName").value;
if (!firstName || firstName === "") {
  displayFromError("firstName", "Veuillez renseigner votre prénom");
  return;
}
console.log(firstName);
})

// const lastName = document.getElementById("lastName").value;
// if (!lastName || lastName === "") {
//   displayFromError("lastName", "Veuillez renseigner votre nom");
//   return;
// }
// const address = document.getElementById("address").value;
// if (!address || address === "") {
//   displayFromError("address", "Veuillez renseigner votre adresse");
//   return;
// }
// const city = document.getElementById("city").value;
// if (!city || city === "") {
//   displayFromError("city", "Veuillez renseigner votre ville");
//   return;
// }
// const email = document.getElementById("email").value;
// if (!email || email === "") {
//   displayFromError("email", "Veuillez renseigner votre email");
//   return;
// } else if (!email.match(/^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[a-z]{2,4}^/)) {
//   displayFromError("email", "Veuillez renseigner un email valide");
//   return;
// }

// //Envoyer la commande de l'API
// const productIds = panier.map((product) => product._id);

// fetch(`http://localhost:3000/api/products/order`, {
//   method: "POST",
//   headers: {
//     "content-Type": "application/json",
//   },
//   body: JSON.stringify({ contact, products: productIds }),
// })
// .then((res) => res.json())
// .then((order) => {
//   return order;
  
//   //Objet de contact
//   const contact = {
//       firstName: firstName,
//       lastName: lastName,
//       address: address,
//       city: city,
//       email: email,
//     };
    
//   })
    //tableau d'ids des produits
    const productIds = panier.map((product) => product._id);
