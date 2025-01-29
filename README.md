
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
