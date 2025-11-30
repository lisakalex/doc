---
title: Import data in docker MySQL

---

To import data into a MySQL database running inside a Docker container, you can follow these steps. You can either
import a SQL dump file during the container creation process or use a running container to import the data.

### **1. Import Data During Docker Container Initialization**

You can place your SQL dump file (e.g., `mydatabase_dump.sql`) into a Docker volume or mount a directory from your host
and use Docker's `docker-entrypoint-initdb.d` feature. MySQL will automatically import any SQL file placed in this
directory when the container starts.

Here’s how to do it:

#### Docker Compose Example:

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: my_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: mydatabase
      MYSQL_USER: myuser
      MYSQL_PASSWORD: mypassword
    volumes:
      - ./data:/var/lib/mysql  # Volume for MySQL data
      - ./init:/docker-entrypoint-initdb.d  # Directory for initialization scripts
    ports:
      - "3306:3306"
```

Now, place your `mydatabase_dump.sql` file in the `./init/` directory (on your host system). When you start the
container, MySQL will automatically import this SQL file.

```bash
docker-compose up
```

### **2. Import Data Into a Running MySQL Container**

If your MySQL container is already running, you can import a SQL file using the following steps:

#### Step 1: Copy the SQL File Into the Container

You can use the `docker cp` command to copy the SQL dump file from the host system to the MySQL container.

```bash
docker cp mydatabase_dump.sql <container_name>:/mydatabase_dump.sql
```

For example:

```bash
docker cp mydatabase_dump.sql my_mysql:/mydatabase_dump.sql
```

#### Step 2: Execute the `mysql` Command Inside the Container

Once the file is inside the container, you can use the `mysql` command to import the database.

```bash
docker exec -i <container_name> mysql -u <username> -p<password> <database_name> < /mydatabase_dump.sql
```

For example:

```bash
docker exec -i my_mysql mysql -u myuser -pmypassword mydatabase < /mydatabase_dump.sql
```

This command will import the SQL dump into the specified MySQL database.

### **3. Import Using a Volume Mount**

You can also mount the SQL dump file directly when starting the container, and import the data using the same command:

```bash
docker run --name my_mysql -v /path/to/mydatabase_dump.sql:/mydatabase_dump.sql -e MYSQL_ROOT_PASSWORD=rootpassword -d mysql:8.0
```

Then, execute the import:

```bash
docker exec -i my_mysql mysql -u root -prootpassword mydatabase < /mydatabase_dump.sql
```

### **Troubleshooting:**

- Ensure the database (`mydatabase`) exists before importing. You can create it manually or via the `MYSQL_DATABASE`
  environment variable during container setup.
- If you're importing large datasets, ensure you adjust MySQL’s settings (like `max_allowed_packet`).
