# Order Management Service

A REST API service for managing customer orders. Handles order creation, status tracking, and fulfillment workflows for the e-commerce platform.

## Overview

The Order Management Service (OMS) is responsible for:

- Creating and persisting customer orders
- Updating order status through the fulfillment lifecycle
- Exposing order data to downstream services (inventory, shipping, billing)
- Providing order history to the customer portal

**Tech stack:** Node.js, Express, MongoDB

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6.x (local or Atlas)
- npm 9+

### Installation

```bash
git clone https://github.com/acme-corp/order-management-service.git
cd order-management-service
npm install
```

### Configuration

Copy the example environment file and fill in values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/orders` |
| `JWT_SECRET` | Secret for JWT validation | *(required)* |
| `NODE_ENV` | Runtime environment | `development` |

### Running Locally

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The service will be available at `http://localhost:3000`.

### Running Tests

```bash
npm test
```

## API

See [docs/api.md](docs/api.md) for endpoint documentation.

### Quick Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/orders` | List orders |
| `POST` | `/orders` | Create order |
| `GET` | `/orders/:id` | Get order by ID |
| `PUT` | `/orders/:id` | Update order |
| `DELETE` | `/orders/:id` | Cancel order |

## Project Structure

```
src/
  index.js          # App entry point
  routes/
    orders.js       # Order CRUD routes
  middleware/
    auth.js         # JWT authentication middleware
  models/
    order.js        # Order data model
tests/
  orders.test.js    # Unit tests
docs/
  api.md            # API documentation
```

## Deployment

The service is deployed to AWS ECS via the CI/CD pipeline. Deployments are triggered on merge to `main`.

> **Note:** Deployment runbooks are maintained in Confluence (internal access required).

## Known Issues

- Pagination is not yet implemented on `GET /orders`
- Order search/filtering is limited to status only
- Bulk order operations not supported

## Contact

Team: **Fulfillment Engineering**  
Slack: `#fulfillment-engineering`  
On-call: See PagerDuty rotation (internal)
