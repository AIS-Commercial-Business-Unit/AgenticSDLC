# Order Management Service — API Reference

> **Status:** Draft — some sections incomplete.

Base URL: `https://api.acme-corp.com/orders/v2`

All requests require an `Authorization: Bearer <token>` header.

---

## Health Check

### `GET /health`

Returns service health status. No authentication required.

**Response**
```json
{
  "status": "ok",
  "service": "order-management-service"
}
```

---

## Orders

### `GET /orders`

Returns a list of orders. No pagination (see Known Issues).

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by order status |

**Status values:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

**Response `200`**
```json
[
  {
    "_id": "6551a2f3e4b0c12d8f9a1234",
    "customerId": "cust-9876",
    "status": "pending",
    "items": [ ... ],
    "totalAmount": 49.97,
    "createdAt": "2024-11-12T14:22:43.000Z"
  }
]
```

---

### `GET /orders/:id`

Returns a single order by ID.

**Path Parameters**

| Parameter | Description |
|-----------|-------------|
| `id` | MongoDB ObjectId of the order |

**Response `200`** — Order object (see above)

**Response `404`**
```json
{ "error": "Order not found" }
```

---

### `POST /orders`

Creates a new order.

**Request Body**
```json
{
  "customerId": "cust-9876",
  "items": [
    {
      "productId": "prod-001",
      "sku": "SKU-WIDGET-LG",
      "name": "Large Widget",
      "quantity": 2,
      "unitPrice": 14.99
    }
  ],
  "shippingAddress": {
    "line1": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62701",
    "country": "US"
  }
}
```

**Response `201`** — Created order object

**Response `400`**
```json
{
  "errors": [
    { "msg": "customerId is required", "param": "customerId" }
  ]
}
```

---

### `PUT /orders/:id`

Updates the status of an existing order.

**Request Body**
```json
{
  "status": "confirmed"
}
```

**Response `200`** — Updated order object

> **TODO:** Add support for updating shipping address and notes.

---

### `DELETE /orders/:id`

Cancels an order (sets status to `cancelled`). Does not delete the record.

**Response `200`**
```json
{
  "message": "Order cancelled",
  "order": { ... }
}
```

---

## Error Responses

| Code | Meaning |
|------|---------|
| `400` | Validation error — see `errors` array |
| `401` | Missing or invalid JWT |
| `404` | Resource not found |
| `500` | Unexpected server error |

---

## Authentication

> **TODO:** Document token issuance flow. Currently tokens are issued by the Identity Service — see that service's README.

---

## Rate Limiting

> **TODO:** Rate limiting has not been implemented yet.
