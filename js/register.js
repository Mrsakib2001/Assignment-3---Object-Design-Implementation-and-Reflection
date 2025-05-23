export default function showRegister(container) {
  container.innerHTML = `
    <h2>Register</h2>
    <form class="w-50 mx-auto">
      <div class="mb-3">
        <label>Email</label>
        <input type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input type="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-success w-100">Create Account</button>
    </form>
  `;
}
