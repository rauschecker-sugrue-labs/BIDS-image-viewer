# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in Docker to /app
WORKDIR /app

# Copy the current directory (server) contents into the container at /app
COPY . /app

# Install the Python dependencies
RUN pip install --upgrade pip
# RUN pip install --no-cache-dir pyproject.toml
RUN pip install --no-cache-dir -r requirements.txt

# Specify the command to run on container start
CMD ["python", "server.py"]
