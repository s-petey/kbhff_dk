# Docker Setup for KBHFF Member System

## Quick Start

1. Start the containers:
```bash
docker compose up -d --build
```

2. Access the application:
- Main site: http://localhost:8080
- Admin login: http://localhost:8080/janitor/admin/login
- Admin setup (if first run): http://localhost:8080/janitor/admin/setup.php
  - UN: `admin@kbhff.dk`
  - UP: `admin123`

3. Database credentials:
- Host: `db` (inside containers) or `localhost` (from host)
- Port: `3306`
- Database: `kbhff_dk`
- Username: `kbhff`
- Password: `kbhff`
- Root password: `root`

## Stopping

```bash
docker compose down
```

## Stopping and removing data

```bash
docker compose down -v
```

## Viewing logs

```bash
docker compose logs -f
```
