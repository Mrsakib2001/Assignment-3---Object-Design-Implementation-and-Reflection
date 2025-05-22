class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_product(self, product):
        self.items.append(product)
        print(f"{product.name} added to cart.")

    def checkout(self):
        total = sum(item.price for item in self.items)
        print("Checking out...")
        for item in self.items:
            print(f"- {item.name}: ${item.price}")
        print(f"Total: ${total:.2f}")
