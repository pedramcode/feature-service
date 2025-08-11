# Feature Toggle Service

A scalable feature toggle management service built with Node.js, Express, PostgreSQL, Redis, and Prisma ORM. This service allows you to create, activate, deactivate, and manage feature flags with dependency support.

## Features

- RESTful API for feature toggle management
- Dependency-aware activation and deactivation
- PostgreSQL for persistent storage
- Redis for caching and rate limiting
- Robust error handling and logging
- Dockerized for easy deployment


## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
HTTP_PORT=8080
HTTP_HOST=0.0.0.0
LOG_PATH=/var/log
RUNTIME=dev | prod
REDIS_URL=redis://user-service-redis:6379/2
DATABASE_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/feature
```

## Important:
Before running docker compose up, you must set the following environment variables in your host OS:

```env
POSTGRES_USER
POSTGRES_PASSWORD
```
These are required for the PostgreSQL container to start correctly.

Example (Linux/macOS):

```bash
export POSTGRES_USER=yourusername
export POSTGRES_PASSWORD=yourpassword
```

# Running the Service
Build and start all services using Docker Compose:

```docker
docker compose up --build
```

This will start:

The feature toggle service (Node.js/Express)
PostgreSQL database
Redis cache

## Test

For running tests run

```bash
npm run test
```

# API Endpoints

## Health Check
* GET /ping

    Returns PONG if the service is running.

## Feature Management

* POST /api/feature

    Create a new feature toggle.

* GET /api/feature

    List all features.

* PUT /api/feature/on/:key

    Activate a feature (with dependency checks).

* PUT /api/feature/off/:key

    Deactivate a feature (recursively deactivates dependents).


# Database Migrations
Migrations are managed by Prisma.
On container startup, migrations are automatically applied via `npm run db:deploy`.

# Logging
Logs are written to the console and to the file specified by `LOG_PATH`.

