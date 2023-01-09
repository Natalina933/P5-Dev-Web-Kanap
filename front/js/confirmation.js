function getParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

async function main() {
  const orderId = getParam("orderId");
  document.getElementById("orderId").textContent = orderId;
}

main();
