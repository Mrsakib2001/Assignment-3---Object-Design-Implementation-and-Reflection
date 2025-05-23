export default function showRegister(container) {
  container.innerHTML = `
    <h2>Register</h2>
    <form id="register-form" class="w-50 mx-auto">
      <div class="mb-3">
        <label>Email</label>
        <input type="email" name="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input type="password" name="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-success w-100">Create Account</button>
    </form>
    <div id="register-msg" class="mt-3 text-center"></div>
  `;

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const msgDiv = document.getElementById('register-msg');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        msgDiv.innerHTML = `<div class="alert alert-success">Account created!</div>`;
        form.reset();
      } else {
        const error = await response.text();
        msgDiv.innerHTML = `<div class="alert alert-danger">${error}</div>`;
      }
    } catch (err) {
      msgDiv.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  });
}
