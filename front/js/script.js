//récupérer l'API la liste des canapés sur le serveur- création d'une promesse
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

  //création d'un élèment par canapé et l'ajouter dans le DOM
  .then(function (products) {
    for (const product of products) {
      let link = document.createElement("a");
      link.href = "./product.html?id=" + product._id;

      let article = document.createElement("article");
      //déclarer article comme enfant de link
      link.appendChild(article);

      let img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.altTxt;
      article.appendChild(img);

      let productName = document.createElement("h3");
      productName.textContent = product.name;
      productName.classList.add("productName");
      article.appendChild(productName);

      let productDescription = document.createElement("p");
      productDescription.textContent = product.description;
      productDescription.classList.add("productDescription");
      article.appendChild(productDescription);

      document.getElementById("items").appendChild(link);
    }
  });

