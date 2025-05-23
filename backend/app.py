from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__, static_folder="../", static_url_path="")
CORS(app)

DATA_DIR = os.path.dirname(__file__)
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")

def load_json(path):
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f)
    with open(path, "r") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/api/products", methods=["GET"])
def get_products():
    products = load_json(PRODUCTS_FILE)
    return jsonify(products)

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    users = load_json(USERS_FILE)
    if any(u["email"] == data["email"] for u in users):
        return "Email already registered", 400
    users.append({"email": data["email"], "password": data["password"]})
    save_json(USERS_FILE, users)
    return "User registered", 200

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    users = load_json(USERS_FILE)
    for user in users:
        if user["email"] == data["email"] and user["password"] == data["password"]:
            return jsonify({"email": user["email"]})
    return "Invalid credentials", 401

@app.route("/api/orders", methods=["POST"])
def create_order():
    order = request.get_json()
    orders = load_json(ORDERS_FILE)
    orders.append(order)
    save_json(ORDERS_FILE, orders)
    return "Order saved", 200

@app.route("/")
def serve_index():
    return send_from_directory("../", "index.html")

if __name__ == "__main__":
    app.run(debug=True)
