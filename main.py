from user_account import UserAccount
from product import Product
from shopping_cart import ShoppingCart
from sales_report import SalesReport

cart = ShoppingCart()

products = [
    Product("Laptop", 1000),
    Product("Mouse", 25),
    Product("Keyboard", 45)
]


def create_account():
    email = input("Enter email: ")
    password = input("Enter password: ")
    account = UserAccount(email, password)
    account.save()


def browse_products():
    print("\nAvailable Products:")
    for idx, product in enumerate(products):
        print(f"{idx + 1}. {product.name} - ${product.price}")


def add_to_cart():
    browse_products()
    choice = int(input("Select product number: ")) - 1
    cart.add_product(products[choice])


def checkout():
    cart.checkout()


def view_report():
    report = SalesReport()
    report.generate()


while True:
    print("\nMain Menu:")
    print("1. Create Account")
    print("2. Browse Products")
    print("3. Add to Cart")
    print("4. Checkout")
    print("5. Admin: View Sales Report")
    print("0. Exit")

    option = input("Choose an option: ")

    if option == "1":
        create_account()
    elif option == "2":
        browse_products()
    elif option == "3":
        add_to_cart()
    elif option == "4":
        checkout()
    elif option == "5":
        view_report()
    elif option == "0":
        print("Goodbye!")
        break
    else:
        print("Invalid choice. Try again.")
