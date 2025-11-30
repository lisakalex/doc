---
title: Docker create image from running container
---


To create a Docker image from a running container, you can use the `docker commit` command. This allows you to capture the current state of a running container and save it as a new image.

Here’s a step-by-step guide on how to create an image from a running Docker container:

### Steps:

1. **List Running Containers**: First, identify the container you want to create an image from.

   ```bash
   docker ps
   ```

   This will show a list of running containers along with their container IDs and names. Note the **container ID** or **name** of the container you want to create an image from.

2. **Commit the Running Container to an Image**: Use the `docker commit` command to create an image from the running container.

   ```bash
   docker commit <container_id_or_name> <repository_name>:<tag>
   ```

   - `<container_id_or_name>`: The ID or name of the container you want to commit.
   - `<repository_name>`: The name you want to give the new image.
   - `<tag>`: Optional tag to give the image (e.g., `v1`, `latest`). If omitted, Docker will use `latest` by default.

   Example:
   ```bash
   docker commit abc12345 my_custom_image:latest
   ```

   This creates an image called `my_custom_image` with the tag `latest` from the container with the ID `abc12345`.

3. **List Docker Images**: Once the image has been created, you can confirm it by listing all images.

   ```bash
   docker images
   ```

   You should see your newly created image in the list.

### Example of Committing a Container to an Image:

```bash
# List running containers
docker ps

# Assuming you have a running container with ID abc12345
docker commit abc12345 my_custom_image:latest

# Verify that the image was created
docker images
```

### Optional: Adding a Commit Message
You can also add a commit message to describe the changes you made:

```bash
docker commit -m "Added custom configurations" abc12345 my_custom_image:latest
```

### Optional: Pausing the Container
While this is optional, some users prefer to **pause** the container before committing it to ensure that no changes are made while creating the image.

```bash
docker pause <container_id_or_name>
docker commit <container_id_or_name> <repository_name>:<tag>
docker unpause <container_id_or_name>
```

### Using the Newly Created Image:
After creating the image, you can start a new container from it using `docker run`:

```bash
docker run -d my_custom_image:latest
```

### Summary:
- Use `docker commit` to create an image from a running container.
- Specify the container ID and the name of the new image.
- Optionally, add tags and commit messages to describe the changes.
