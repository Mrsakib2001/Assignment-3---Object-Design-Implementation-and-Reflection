export default function showLogin(container) {
  container.innerHTML = `
    <h2>Login</h2>
    <form id="login-form" class="w-50 mx-auto">
      <div class="mb-3">
        <label>Email</label>
        <input type="email" name="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input type="password" name="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Log In</button>
    </form>
    <div id="login-msg" class="mt-3 text-center"></div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const msgDiv = document.getElementById('login-msg');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        msgDiv.innerHTML = `<div class="alert alert-success">Login successful!</div>`;
      } else {
        const error = await response.text();
        msgDiv.innerHTML = `<div class="alert alert-danger">${error}</div>`;
      }
    } catch (err) {
      msgDiv.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  });
}
