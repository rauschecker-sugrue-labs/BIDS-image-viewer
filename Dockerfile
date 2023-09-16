# ---- Build Stage ----
FROM node:14 AS build-stage

WORKDIR /app

# Copy client files and install client dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Build the React app
COPY client/ ./client/
RUN cd client && npm run build

# ---- Production Stage ----
FROM python:3.12-rc-slim

WORKDIR /app

# Copy Flask app files and install server dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir -r pyproject.toml

# Copy backend and frontend build files
COPY server/ ./server/
COPY --from=build-stage /app/client/build/ ./client/build/

# Adjustments for Flask to serve React app's static files
EXPOSE 3001

CMD ["python", "./server/server.py"]