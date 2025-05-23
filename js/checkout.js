export default function showCheckout(container) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="alert alert-warning">Your cart is empty. <a href="#catalogue">Shop now</a>.</div>
    `;
    return;
  }

  let total = 0;
  let list = '<ul class="list-group mb-3">';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    list += `<li class="list-group-item d-flex justify-content-between">
      ${item.quantity} × ${item.name}
      <span>$${itemTotal.toFixed(2)}</span>
    </li>`;
  });

  list += '</ul>';

  container.innerHTML = `
    <h2>Checkout</h2>
    ${list}
    <p class="fw-bold">Total: $${total.toFixed(2)}</p>
    <button id="confirm-btn" class="btn btn-success">Confirm Order</button>
    <div id="confirmation-msg" class="mt-3"></div>
  `;

  document.getElementById('confirm-btn').addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    try {
      const order = { user: user.email, items: cart, total };
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        document.getElementById('confirmation-msg').innerHTML = `
          <div class="alert alert-success">✅ Order placed successfully!</div>
        `;
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      document.getElementById('confirmation-msg').innerHTML = `
        <div class="alert alert-danger">❌ Error: ${err.message}</div>
      `;
    }
  });
}
