# ImoPanorama API Documentation

## Overview

ImoPanorama provides a comprehensive REST API for managing real estate properties, terrains, contacts, and content in Madagascar. This API is built with Next.js 15 and uses Better Auth for authentication.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## API Documentation Access

Access the interactive Swagger UI documentation at:

- **Admin Panel**: `http://localhost:3000/admin/api-docs`
- **JSON Spec**: `http://localhost:3000/api/docs`

## Authentication

The API uses **Better Auth** with two authentication methods:

### 1. Cookie-Based Authentication (Recommended for Web)
```javascript
// Login returns a session cookie automatically
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  }),
  credentials: 'include' // Important for cookies
});
```

### 2. Bearer Token Authentication
```javascript
fetch('/api/properties', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

## User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| `CLIENT` | Standard user | View properties, submit contacts, manage own favorites |
| `AGENT` | Real estate agent | Create/edit properties, upload images |
| `ADMIN` | Administrator | Full access except user management |
| `SUPER_ADMIN` | Super administrator | Full system access including user management |

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/create-admin` - Create admin user (Super Admin only)

### Properties (`/api/properties`)
- `GET /api/properties` - List properties (including Terrains) with filters
- `POST /api/properties` - Create property (Admin/Agent)
- `GET /api/properties/{id}` - Get property details
- `PUT /api/properties/{id}` - Update property (Admin/Agent)
- `DELETE /api/properties/{id}` - Delete property (Admin)

### Contacts (`/api/contacts`, `/api/contact`)
- `POST /api/contact` - Simple contact form (Public, rate limited)
- `GET /api/contacts` - List contacts (Admin only)
- `POST /api/contacts` - Create contact with property reference
- `GET /api/contacts/{id}` - Get contact details (Admin)
- `PUT /api/contacts/{id}` - Update contact (Admin)
- `PUT /api/contacts/{id}/read` - Mark as read (Admin)
- `GET /api/contacts/count` - Get count (Admin)
- `GET /api/contacts/stats` - Get statistics (Admin)
- `GET /api/contacts/user` - Get user's contacts (Auth required)

### Favorites (`/api/favorites`)
- `GET /api/favorites` - List user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Clear all favorites
- `GET /api/favorites/{propertyId}` - Check if favorited
- `DELETE /api/favorites/{propertyId}` - Remove from favorites

### News (`/api/news`, `/api/admin/news`)
- `GET /api/news` - List published news (Public)
- `GET /api/news/{slug}` - Get news by slug (Public)
- `GET /api/news/id/{id}` - Get news by ID (Public)
- `GET /api/admin/news` - List all news (Admin)
- `POST /api/admin/news` - Create news (Admin)
- `GET /api/admin/news/{id}` - Get news details (Admin)
- `PUT /api/admin/news/{id}` - Update news (Admin)
- `DELETE /api/admin/news/{id}` - Delete news (Admin)

### FAQs (`/api/faqs`)
- `GET /api/faqs` - List FAQs (Public)
- `POST /api/faqs` - Create FAQ (Admin)
- `GET /api/faqs/{id}` - Get FAQ details
- `PUT /api/faqs/{id}` - Update FAQ (Admin)
- `DELETE /api/faqs/{id}` - Delete FAQ (Admin)
- `GET /api/faqs/categories` - List categories (Public)

### Partners (`/api/partners`, `/api/admin/partners`)
- `GET /api/partners` - List active partners (Public)
- `GET /api/admin/partners` - List all partners (Admin)
- `POST /api/admin/partners` - Create partner (Admin)
- `GET /api/admin/partners/{id}` - Get partner details (Admin)
- `PUT /api/admin/partners/{id}` - Update partner (Admin)
- `DELETE /api/admin/partners/{id}` - Delete partner (Admin)

### BatiPanorama - Construction Services

#### Projects (`/api/bati-projects`)
- `GET /api/bati-projects` - List projects (Public)
- `POST /api/bati-projects` - Create project (Admin)
- `GET /api/bati-projects/{id}` - Get project details
- `PUT /api/bati-projects/{id}` - Update project (Admin)
- `DELETE /api/bati-projects/{id}` - Delete project (Admin)

#### Services (`/api/bati-services`)
- `GET /api/bati-services` - List services (Public)
- `POST /api/bati-services` - Create service (Admin)
- `GET /api/bati-services/{id}` - Get service details
- `PUT /api/bati-services/{id}` - Update service (Admin)
- `DELETE /api/bati-services/{id}` - Delete service (Admin)

#### Process (`/api/bati-process`)
- `GET /api/bati-process` - List process steps (Public)
- `POST /api/bati-process` - Create process step (Admin)
- `GET /api/bati-process/{id}` - Get process step
- `PUT /api/bati-process/{id}` - Update process step (Admin)
- `DELETE /api/bati-process/{id}` - Delete process step (Admin)

#### Quotes (`/api/bati-quotes`)
- `GET /api/bati-quotes` - List quotes (Admin only)
- `POST /api/bati-quotes` - Submit quote request (Public)
- `GET /api/bati-quotes/{id}` - Get quote details (Admin)
- `PUT /api/bati-quotes/{id}` - Update quote (Admin)
- `DELETE /api/bati-quotes/{id}` - Delete quote (Admin)

### Search (`/api/search`)
- `GET /api/search` - Semantic search with Qdrant vector DB
- `POST /api/search/sync` - Sync search index for properties (Admin)

### Analytics (`/api/analytics`)
- `POST /api/analytics/track` - Track page views and events (Public)
- `GET /api/analytics/data` - Get analytics data (Admin)

### Media (`/api/upload`, `/api/admin/upload`)
- `POST /api/upload` - Upload single/multiple images (Admin/Agent)
- `GET /api/upload` - List images in directory (Admin/Agent)
- `DELETE /api/upload` - Delete image (Admin/Agent)
- `POST /api/admin/upload` - Admin proxy to upload (Admin)
- `PUT /api/admin/upload` - Update images (Admin)
- `DELETE /api/admin/upload` - Delete via admin (Admin)

### Users (`/api/users`, `/api/admin/users`)
- `GET /api/users` - List all users (Admin)
- `GET /api/users/{id}/toggle-active` - Toggle user status (Admin)
- `GET /api/admin/users` - List users (Admin)
- `GET /api/admin/users/{id}` - Get user details (Admin)
- `POST /api/admin/users/{id}` - Update user (Admin)

### Settings (`/api/settings`)
- `GET /api/settings` - Get settings (Admin)
- `PUT /api/settings` - Update settings (Admin)
- `DELETE /api/settings` - Delete setting (Admin)

## Common Query Parameters

### Pagination
```
page=1          # Page number (default: 1)
limit=10        # Items per page (default: 10-20)
```

### Filtering
```
search=term     # Text search
city=City       # Filter by city
status=AVAILABLE # Filter by status
type=TYPE       # Filter by type
```

### Sorting
```
sort=price_asc      # Sort by price ascending
sort=price_desc     # Sort by price descending
sort=date_desc      # Sort by date (newest first)
sort=size_desc      # Sort by size
```

### View Modes
```
view=list       # Minimal fields for listing
view=full       # Full details
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - External service down |

## Rate Limiting

Rate limiting is applied to:
- **Contact forms**: Limited to prevent spam
- **Public endpoints**: Throttled for fair usage

Rate limit headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1234567890
```

## Security Features

1. **JWT Tokens**: Secure session management
2. **HTTP-Only Cookies**: XSS protection
3. **Rate Limiting**: Prevent abuse
4. **reCAPTCHA**: Bot protection (optional)
5. **Honeypot Fields**: Anti-spam for forms
6. **Email Validation**: Regex pattern validation
7. **Role-Based Access Control**: Granular permissions

## Data Validation

All endpoints validate incoming data:
- **Email**: Must be valid format
- **Required fields**: Cannot be empty
- **Type checking**: Enums validated
- **Size limits**: Images max 10MB
- **String length**: Reasonable limits

## File Uploads

**Supported formats**: JPEG, PNG, WebP, GIF
**Max size**: 10MB per file
**Storage**: BunnyCDN

```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);

fetch('/api/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

## Search & Filtering Examples

### Search Properties (including Terrains)
```
GET /api/properties?propertyType=APARTMENT&city=Antananarivo&minPrice=100000000&maxPrice=500000000&bedrooms=3&sort=price_asc
```

### Semantic Search
```
GET /api/search?q=modern+apartment+near+airport&limit=10&city=Antananarivo
```

## Error Handling

```javascript
try {
  const response = await fetch('/api/properties');
  const data = await response.json();

  if (!response.ok) {
    // Handle HTTP errors
    console.error(data.error);
    return;
  }

  if (!data.success) {
    // Handle application errors
    console.error(data.error);
    return;
  }

  // Success
  console.log(data.data);
} catch (error) {
  // Handle network errors
  console.error('Network error:', error);
}
```

## Development Tips

1. **Use Swagger UI**: Test endpoints interactively at `/admin/api-docs`
2. **Check Roles**: Ensure your user has the correct role for protected endpoints
3. **Enable Cookies**: Use `credentials: 'include'` for authenticated requests
4. **Rate Limits**: Be mindful of rate limits during testing
5. **Error Messages**: Read error messages carefully for debugging

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=your-secret-key

# CDN
BUNNYCDN_ACCESS_KEY=your-cdn-key

# Search
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-api-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password

# reCAPTCHA (Optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

## Support & Resources

- **GitHub**: [Your GitHub Repo]
- **Email**: contact@imopanorama.mg
- **Documentation**: Access Swagger UI for detailed API reference

## Changelog

### v1.0.0 (2025-01-18)
- Initial API documentation
- Swagger/OpenAPI integration
- Comprehensive endpoint documentation
- Authentication with Better Auth
- Role-based access control
- Rate limiting implementation

---

**Note**: This API is under active development. Breaking changes will be communicated in advance.
