// Récupérer l'API la liste des canapés sur le serveur- création d'une promesse
dataFetch();
function dataFetch() {
  let resapi = "http://localhost:3000/api/products";

  fetch(resapi)
    .then((res) => res.json()) //promesse en demande une autre promesse
    //boucle - parcourir l'api
    .then((products) => {
      for (let article of products) {
        let display = ""// affiche le html
        display += `
        <a href="./product.html?id=${article._id}">
          <article>
            <img src="${article.imageUrl}" alt="${article.altTxt}">
            <h3 class="productName">${article.name}</h3>
            <p class="productDescription">${article.description}</p>
          </article>
        </a>
`;
        document //pointer sur l'élément items et injecter l' html dans le dom  
          .getElementById("items")
          .insertAdjacentHTML("beforeend", display);
      }
    })
    .catch((err) => console.log(err));
}

