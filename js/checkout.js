export default function showCheckout(container) {
  container.innerHTML = `
    <h2>Checkout</h2>
    <div class="alert alert-warning">Please add items to your cart before checking out.</div>
  `;
}
