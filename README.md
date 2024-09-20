# MilvusUI

MilvusUI is an application developed as practical part of bachelor's thesis, enabling efficient management and interaction with the Milvus database.

## Technologies Used

- **Angular 18**: A frontend framework for building user interfaces.
- **FastAPI (Python)**: A web framework used for developing high-performance APIs.
- **Milvus**: A high-performance database optimized for managing vector data.
- **Nginx**: A web server used for request management and load balancing.

## Application screenshots

# Connection page
![image](https://github.com/user-attachments/assets/7a0beb67-d773-4faa-af14-a2e8a3409c2b)

# Databases overview
![image](https://github.com/user-attachments/assets/5768648f-3653-4f59-818c-fb00e04065df)

# Collections overview
![image](https://github.com/user-attachments/assets/9233b22f-f294-46db-a04c-af84a92cb65a)

# Add new collection
![image](https://github.com/user-attachments/assets/49e7e3a1-939c-4516-b345-b31e91b4e3d1)
![image](https://github.com/user-attachments/assets/428179fb-530b-484c-bf2a-eaf6a8cee382)

# Collection overview
![image](https://github.com/user-attachments/assets/7c4d3224-0ab4-45d1-ae87-67fc689d5c76)
![image](https://github.com/user-attachments/assets/51ca806a-4f32-4986-8b06-22f6eb769324)
![image](https://github.com/user-attachments/assets/0cc9c106-37e1-4e7c-b2f0-906614566768)

## Requirements

- Docker engine

## Installation

1. Clone the repository:

 ```bash
git clone https://github.com/frke001/Milvus-UI.git
```

2. Start project and Milvus containers using Docker Compose in cloned direcotry:

 ```bash
docker compose up -d
```

3. When all containers are up, visit URL:

 ```bash
http://localhost
```
