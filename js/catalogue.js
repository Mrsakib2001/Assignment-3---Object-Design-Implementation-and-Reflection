export default async function showCatalogue(container) {
  container.innerHTML = `
    <h2 class="mb-4">Product Catalogue</h2>
    <div class="row" id="product-list">Loading...</div>
  `;

  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error(await response.text());

    const products = await response.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Price: $${product.price.toFixed(2)}</p>
            <label>Quantity:
              <input type="number" min="1" value="1" id="qty-${product.id}" class="form-control mb-2">
            </label>
            <button class="btn btn-primary w-100" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
              Add to Cart
            </button>
          </div>
        </div>
      `;
      productList.appendChild(card);
    });

    document.querySelectorAll('button[data-id]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const qtyInput = document.getElementById(`qty-${id}`);
        const quantity = parseInt(qtyInput.value) || 1;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push({ id, name, price, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${quantity} × ${name} added to cart.`);
      });
    });

  } catch (err) {
    document.getElementById('product-list').innerHTML = `
      <div class="alert alert-danger">Error loading products: ${err.message}</div>
    `;
  }
}
