---
title: Connect to MySQL Database with PDO
---

To connect to a MySQL database using PHP's PDO (PHP Data Objects), you need to follow these steps. PDO is a flexible and secure way to interact with databases and is highly recommended for use in modern PHP applications.

Here’s a basic example of how to connect to a MySQL database using PDO:

### Steps to Connect to MySQL Database with PDO:

#### 1. **Basic PDO Connection Example**:

```php
<?php
$host = '127.0.0.1'; // or 'localhost' or the IP address of the MySQL server
$db = 'dashboard'; // Database name
$user = 'jenkins'; // MySQL username
$pass = 'Zaichik1.&'; // MySQL password
$charset = 'utf8mb4'; // Charset for proper encoding

$dsn = "mysql:host=$host;dbname=$db;charset=$charset"; // Data Source Name

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch data as associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false, // Disable emulation of prepared statements
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options); // Create PDO instance
    echo "Connected to the database successfully!";
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
```

#### 2. **Explanation of the Code**:

- `$host`: This is the hostname or IP address of your MySQL server. If you are using Docker, and MySQL is in a different container, replace `'127.0.0.1'` with the service name of the MySQL container from the `docker-compose.yml` file (e.g., `mysql`).
- `$db`: The name of the database you're connecting to (in your case, `dashboard`).
- `$user` and `$pass`: Credentials for connecting to MySQL.
- `$charset`: Setting the character set to ensure proper encoding, especially for special characters.
- `$dsn`: Data Source Name string, used by PDO to define the connection type, host, and database.
- `$options`: Additional options to make the PDO connection more secure and easier to handle errors.

#### 3. **Using PDO in a Docker Environment**:

In a Docker environment, if you're trying to connect to a MySQL container from a PHP container (e.g., in your `docker-compose.yml` setup), you need to ensure the `host` is the service name of the MySQL container. For your setup, it would likely look like this:

```php
<?php
$host = 'mysql'; // Service name from docker-compose.yml
```

So your connection string might look like this:

```php
<?php
$host = 'mysql'; // Service name from docker-compose.yml
$db = 'dashboard';
$user = 'jenkins';
$pass = 'Zaichik1.&';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Connected to the database successfully!";
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
```

#### 4. **Testing the Connection**:

To test the connection, you can create a simple PHP script using the above code, save it as `test_pdo.php`, and run it in your web server or PHP environment (within your Docker container).

- Place this script in the root of your application (`/application` in your setup).
- Access it via your browser or by using `docker exec` to run the script inside the PHP container:
  
```bash
docker exec -it <php-fpm-container-name> php /application/test_pdo.php
```

#### 5. **Troubleshooting**:
- **Database connection errors**: If the connection fails, the error message returned by `$e->getMessage()` will help debug the issue.
- **Container hostnames**: Ensure that you're using the correct service name (e.g., `mysql`) as the host if you're running MySQL inside a Docker container.
- **Ports**: Make sure the correct MySQL port (`3306`) is exposed in the `docker-compose.yml` and is accessible.

### Next Steps:

- Once you're connected, you can run queries using PDO’s `prepare`, `execute`, and `fetch` methods for safe and efficient database interaction.

Let me know if you need further clarification!
