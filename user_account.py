class UserAccount:
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def save(self):
        with open("accounts.txt", "a") as file:
            file.write(f"{self.email},{self.password}\n")
        print("Account created and saved.")
