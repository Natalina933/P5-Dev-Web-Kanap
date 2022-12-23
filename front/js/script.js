/**
 * 2 construire le html
 * 3 injecter l' html dans le dom
 *  3.1 Pointer sur l'élément items
 *  3.2 injecter dans le dom
 */
//1 récupérer l'API la liste des canapés sur le serveur- création d'une promesse
dataFetch();
async function dataFetch() {
  let resapi = "http://localhost:3000/api/products";

  await fetch(resapi)
    .then((res) => res.json()) //promesse en demande une autre promesse
    //boucle - parcourir l'api
    .then((products) => {
      for (let article of products) {
        let display = ""
        display += `
        <a href="./product.html?id=${article._id}">
          <article>
            <img src="${article.imageUrl}" alt="${article.altTxt}">
            <h3 class="productName">${article.name}</h3>
            <p class="productDescription">${article.description}</p>
          </article>
        </a>
`;
        document
          .getElementById("items")
          .insertAdjacentHTML("beforeend", display);
      }
    })
    .catch((err) => console.log(err));
}

//2 construire le html
// <!--            -->
