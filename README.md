## Overview

### Main page:
![Main page](https://github.com/user-attachments/assets/0c91f630-abc9-41bf-bdc8-7af4c222b31d)
![Main page](https://github.com/user-attachments/assets/bf048179-ccc1-46af-9217-cbfdafd4c7c1)

### Product-list:
![Product list](https://github.com/user-attachments/assets/bccfdbd4-b131-4b5f-b982-b1877fbc1734)

### Product-details:
![Product details](https://github.com/user-attachments/assets/8d6a8bed-a3ca-40ee-9452-521ea0894536)

### Cart:
![Cart](https://github.com/user-attachments/assets/535a30db-41ab-4840-bf4f-e0a60f190043)

### WishList:
![Wishlist](https://github.com/user-attachments/assets/e653ddcf-9045-4300-846b-d4742b2f8296)

### Profile page:
![Profile page](https://github.com/user-attachments/assets/fc05bd75-78b8-4330-b9e8-7830d5e6a93e)
All tabs in the profile are working, with corresponding API endpoints and re-encryption based on the new password. You can change the password, email, and user data.
![Profile page settings](https://github.com/user-attachments/assets/506cac91-2ba2-4109-9cab-ea09a7a553c5)

### Delivery Address:
Google Cloud API has been integrated for maps and location autocomplete functionality.
![Delivery address](https://github.com/user-attachments/assets/5f5cc12a-02f9-4104-9ba3-20a84c1ac568)
![Delivery address map](https://github.com/user-attachments/assets/95fa3322-8605-4f6d-8fa9-0fb1c7cc9f8e)

### Login:
![Login](https://github.com/user-attachments/assets/b6f301f8-b827-40c2-a490-60807af4a392)

### Register:
![Register](https://github.com/user-attachments/assets/7d723ce7-8811-4f22-bd8f-d62465581d95)


### How to start website in docker:
- **Step 1**: Clone the repository and navigate to the project directory
  Clone the repository to your local machine and navigate to the project directory:
```bash
git clone https://github.com/VladMalosev/vlotech.git
``` 
- **Step 2**: Build the backend JAR
```bash
cd java-backend
./mvnw clean package -DskipTests  # For Windows: mvnw.cmd clean package -DskipTests
cd ..
```

- **Step 3**: Use Docker Compose to build and start the containers for the frontend, backend, and PostgreSQL services:
```bash
docker-compose up --build
```
- **Step 4**: Stop the Containers
```bash
docker-compose down
```
- **Step 5**: To remove all containers and images:
```bash
docker-compose down --rmi all
```



#### TODO
- fix heart icons, right now broken
- Add wishlist (rn only cart)

