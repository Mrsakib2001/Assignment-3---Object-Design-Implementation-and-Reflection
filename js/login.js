export default function showLogin(container) {
  container.innerHTML = `
    <h2>Login</h2>
    <form class="w-50 mx-auto">
      <div class="mb-3">
        <label>Email</label>
        <input type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input type="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Log In</button>
    </form>
  `;
}
