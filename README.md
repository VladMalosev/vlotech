## Overview
Main page:
![image](https://github.com/user-attachments/assets/0c91f630-abc9-41bf-bdc8-7af4c222b31d)
![image](https://github.com/user-attachments/assets/bf048179-ccc1-46af-9217-cbfdafd4c7c1)

Product-list:
![image](https://github.com/user-attachments/assets/b5bf424c-ce81-49c7-9505-fc0d27ae83a7)

Product-details:
![image](https://github.com/user-attachments/assets/096d2eee-c7e1-42c7-a3a0-28327fd24f49)

Cart:
![image](https://github.com/user-attachments/assets/51e9da7b-fc97-4cc3-9a0f-685cb0d647ed)

Login:
![image](https://github.com/user-attachments/assets/b6f301f8-b827-40c2-a490-60807af4a392)

Register:
![image](https://github.com/user-attachments/assets/959a61a7-4c68-4018-a67b-8a52ae21b517)


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
- Fix header(hide login when not authenticated):
- Add User page
- Create filtering (rn just placeholder)
- Implement checkout page
- Add wishlist (rn only cart)

