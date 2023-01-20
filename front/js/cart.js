//////////////////////////
// éléments du panier //
//////////////////////////

//Modification de la balise title du navigateur cart --> Page Panier (plus compréhensible par l'utilisateur)
document.title = "Mon Panier";
//Déclaration des variables - panier (LS) et infos ()stockeront
let panier = [];
let infos = [];

// Récupérer la liste dans le localStorage
//Variable "jsonFromCache" dans laquelle on stock les clés et les valeurs qui sont dans le local Storage
function getFromCache() {
  const jsonFromCache = localStorage.getItem("panier");
  if (!jsonFromCache || jsonFromCache === undefined) {
    return [];
  }

  //JSON.parse c'est pour convertir les données au format JSON qui sont dans le localStorage en objet javascript
  return JSON.parse(jsonFromCache);
}
panier = getFromCache();

// Récupérer un produit depuis l'API
async function getProductFromAPI(id) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  const product = await res.json();
  return product;
}
console.log(panier);

// Supprimer le panier
function deleteProductFromCart(id, color) {
  panier = panier.filter(
    (article) => article._id !== id || article.color !== color
  );
  localStorage.setItem("panier", JSON.stringify(panier));
  refreshDisplay();
}
//Changer la quantité et le prix
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

//Tableau contenant les promesses des infos de chaque produit
//de son panier récupérer dans le localStage
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
//Sélection de la balise de la page
//product.html dans laquel on va insérer les produits et leurs infos
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
        deleteProductFromCart(id, color);
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

// Eléments de formulaire & requête POST
document.getElementById("order").addEventListener("click", function (event) {
  event.preventDefault();
  if (panier.length === 0) {
    alert("veuillez selectionner un produit");
    return;
}


  //Contrôle des infos avec Regex et Récupération des données du formulaire
  //Création des expressions régulières pour contrôler les infos entrées par l'utilisateur

  // pas de regex pour les adresses, qui pourraient avoir l'attribut "required"
  // let textRegex = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
  // let addressRegex =
  //   /^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$/;
  let emailRegex =
    /^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$/;

  function displayFromError(inputId, message) {
    //Récupère l'élément avec l'inputId
    const inputElement = document.getElementById(inputId);

    // Ajouter un message d'erreur après l'élément l'input
    const errorElement = document.getElementById(inputId + "ErrorMsg");
    errorElement.textContent = message;
  }
  let formHasError = false;

  //Récupérer les valeurs du formulaire
  const firstName = document.getElementById("firstName").value;
  console.log(firstName);
  if (!firstName || firstName === "") {
    displayFromError("firstName", "Veuillez renseigner votre prénom");
    formHasError = true;
  }
  const lastName = document.getElementById("lastName").value;
  console.log(lastName);
  if (!lastName || lastName === "") {
    displayFromError("lastName", "Veuillez renseigner votre nom");
    formHasError = true;
  }
  const address = document.getElementById("address").value;
  console.log(address);

  if (!address || address === "") {
    displayFromError("address", "Veuillez renseigner votre adresse");
    formHasError = true;
  }

  const city = document.getElementById("city").value;
  if (!city || city === "") {
    displayFromError("city", "Veuillez renseigner votre ville");
    formHasError = true;
  }
  const email = document.getElementById("email").value;
  console.log(email);
  if (!email || email === "") {
    displayFromError("email", "Veuillez renseigner votre email");
    formHasError = true;
  } else if (!email.match(emailRegex)) {
    displayFromError("email", "Veuillez renseigner un mail valide");
  }
  if (formHasError) return;

  //je stocks dans contact les informations du formulaire
  let contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email,
  };
  

  console.log(contact);

  //je stocks dans la variable produitIds l'id des produits de mon panier
  const productIds = panier.map((product) => product._id);

  console.log(productIds);
  // je retourne ma requete a l'API en la transformant en stringify
  const postAPI = async (order) => {
    try {
      let res = await fetch(`http://localhost:3000/api/products/order`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(order),
      });
      if (res.ok) {
        let result = await res.json();
        localStorage.removeItem("panier"); //vide localStorage
        window.location.href = `confirmation.html?orderId=${result.orderId}`;
        console.log(result);
      } else {
        alert("Une erreur est survenue");
      }
    } catch (error) {
      console.log("Une erreur");
      alert("Une erreur est survenue");
    }
  };
  postAPI({ contact, products: productIds });
});
