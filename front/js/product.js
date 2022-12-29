//On récupère l'URL de notre page actuel et l'id
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

//Récupere les infos du produit grace à l'id via l'api
fetch("http://localhost:3000/api/products/" + id)
  .then((res) => res.json()) //promesse en demande une autre promesse
  //boucle - parcourir l'api
  .then(function (product) {
    //afficher les infos du produit sur la page
    displayProduct(product);
    //ajouter l'évenement listener sur le bouton "ajouter au panier"
    const button = document.getElementById("addToCart");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      //récuperer les infos "quantité" et "couleur"
      const quantity = parseInt(document.getElementById("quantity").value);
      if (isNaN(quantity) || quantity <= 0 || quantity > 100) {
        console.log("quantité invalide");
        alert("Veuillez saisir une quantité valide");
        return;
      }
      const color = document.getElementById("colors").value;
      if (!color || color == "") {
        alert("veuillez choisir une couleur");
        return;
      }
      //ajouter le produit au panier
      addToCart(product, quantity, color);
    });
  });

//display = affichage
function displayProduct(product) {
  //changer la page
  document.title = product.name;
  //Créé l'image et ajouter au DOM
  const imgElt = document.createElement("img");
  imgElt.src = product.imageUrl;
  imgElt.alt = product.altTxt;
  document.querySelector(".item__img").appendChild(imgElt);

  //Remplir le nom du produit
  document.getElementById("title").textContent = product.name;
  //Remplir le PRIX du produit
  document.getElementById("price").textContent = product.price;
  //Remplir le DESCRIPTION du produit
  document.getElementById("description").textContent = product.description;

  //remplir les options de couleurs dispo
  for (const color of product.colors) {
    const optionElt = document.createElement("option");
    optionElt.textContent = color;
    optionElt.value = color;
    document.getElementById("colors").appendChild(optionElt);
  }
}
//ajouter des produits au panier
function addToCart(product, quantity, color) {
  //On récupére le panier dans le LocalStorage
  let cart = JSON.parse(localStorage.getItem("panier")) || []; //transf. string
  //on vérifie si le produit est déjà dans le panier
  const productInCart = cart.find(
    (item) => item._id === product._id && item.color === color
  );
  //Fonction fenetre pop up
  const popupConfirmation = () => {
    if (window.confirm(`${product._id} a bien été ajouté au panier`)) {
      window.location.href = cart.html;
    } else {
      window.location.href = index.html;
    }
  };

  //si le produit est déjà dans le panier
  if (productInCart) {
    productInCart.quantity = productInCart.quantity + quantity; // si produit identique ajoute au produit similaire
    popupConfirmation();
  } else {
    //sinon ajouter le produit au panier
    cart.push({
      _id: product._id,
      quantity: quantity,
      color: color,
    });
    popupConfirmation();
  }

  const panierString = JSON.stringify(cart);
  localStorage.setItem("panier", panierString);
  console.log("panier ajouté au localStorage");
}
