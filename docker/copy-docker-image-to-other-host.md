---
title: Copy Docker image to other host
---

To copy a Docker image from one host to another, you can follow these steps. The general process involves saving the Docker image as a `.tar` file, transferring it to the other host, and then loading the image on the destination host.

### **1. Save the Docker Image as a `.tar` File:**

On the source host, save the Docker image to a file using the `docker save` command.

```bash
docker save -o my_image.tar <image_name>
```

For example:
```bash
docker save -o my_image.tar my_app:latest
```

This command creates a file called `my_image.tar` containing the specified Docker image.

### **2. Transfer the Image to the Destination Host:**

Now, transfer the `my_image.tar` file to the destination host. You can use tools like `scp` or `rsync` for this:

- **Using `scp`:**
  ```bash
  scp my_image.tar user@destination_host:/path/to/destination/
  ```

  Example:
  ```bash
  scp my_image.tar user@192.168.1.100:/home/user/
  ```

- **Using `rsync`:**
  ```bash
  rsync -avz my_image.tar user@destination_host:/path/to/destination/
  ```

Alternatively, you can use other file transfer methods such as SFTP, FTP, or even a USB drive if needed.

### **3. Load the Docker Image on the Destination Host:**

Once the `.tar` file is transferred to the destination host, load it into Docker with the `docker load` command.

```bash
docker load -i /path/to/my_image.tar
```

For example:
```bash
docker load -i /home/user/my_image.tar
```

This will import the image into Docker on the destination host. You can then verify that the image has been loaded by running:

```bash
docker images
```

### **4. (Optional) Tag the Image:**

If needed, you can retag the image on the destination host using the `docker tag` command:

```bash
docker tag <image_id> new_tag_name:latest
```

For example:
```bash
docker tag my_app:latest my_new_app:latest
```

### Summary:
1. **Save the image on the source host:**
   ```bash
   docker save -o my_image.tar my_app:latest
   ```
2. **Transfer the `.tar` file to the destination host using `scp`, `rsync`, or another method.**
3. **Load the image on the destination host:**
   ```bash
   docker load -i /path/to/my_image.tar
   ```
4. **(Optional) Retag the image if necessary.**

Once done, the Docker image will be available on the other host.
