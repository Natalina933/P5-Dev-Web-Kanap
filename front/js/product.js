//On récupère l'URL de notre page actuel et l'id 
const url = new URL(window.location.href);
const id = url.searchParams.get("id");
console.log(id);
if (id) {
  //fetch product
//récupérer l'API la liste des canapés sur le localStorage
fetch("http://localhost:3000/api/products")
  .then(function (reponse) {
    if (reponse.ok) {
      return reponse.json();
    }
    throw "erreur";
  })
  .catch((error) => {
    alert("une erreur est survenue");
  })

  //
  const panier = [];
  const panierString = JSON.stringify(panier);
  localStorage.setItem("panier", panierString);
  console.log("panier ajouté au localStorage");
} else {
  alert("Aucun produit n'a été trouvé");
  window.location.href = "index.html";
}
