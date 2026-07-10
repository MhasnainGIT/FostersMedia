# Fosters Media Backend

Production-ready backend for Influencer & Event Management Platform.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + Refresh Tokens
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **File Uploads**: Multer + Cloudinary
- **Email**: Nodemailer
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, Express Rate Limiter

## Setup

1. Clone repository
2. Create `.env` file from `.env.example`
3. Install dependencies: `npm install`
4. Start server: `npm run dev`

## API Endpoints

### Auth

- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/register` - Register admin
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout admin
- `GET /api/v1/auth/me` - Get current user

### Dashboard

- `GET /api/v1/dashboard` - Get dashboard stats
- `GET /api/v1/dashboard/growth` - Monthly growth data
- `GET /api/v1/dashboard/activities` - Recent activities
- `GET /api/v1/dashboard/notifications` - Latest notifications

### Influencers

- `GET /api/v1/influencers` - Get all influencers (paginated)
- `POST /api/v1/influencers` - Create influencer
- `GET /api/v1/influencers/:id` - Get single influencer
- `PUT /api/v1/influencers/:id` - Update influencer
- `DELETE /api/v1/influencers/:id` - Delete influencer

### Brands

- `GET /api/v1/brands` - Get all brands
- `POST /api/v1/brands` - Create brand
- `GET /api/v1/brands/:id` - Get single brand
- `PUT /api/v1/brands/:id` - Update brand
- `DELETE /api/v1/brands/:id` - Delete brand

### Events

- `GET /api/v1/events` - Get all events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events/:id` - Get single event
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event

### Portfolio

- `GET /api/v1/portfolio` - Get all portfolio items
- `POST /api/v1/portfolio` - Create portfolio item
- `GET /api/v1/portfolio/:id` - Get single item
- `PUT /api/v1/portfolio/:id` - Update item
- `DELETE /api/v1/portfolio/:id` - Delete item

### Gallery

- `GET /api/v1/gallery` - Get all gallery items
- `POST /api/v1/gallery` - Upload media (image/video)
- `DELETE /api/v1/gallery/:id` - Delete media

### Testimonials

- `GET /api/v1/testimonials` - Get all testimonials
- `POST /api/v1/testimonials` - Create testimonial
- `GET /api/v1/testimonials/:id` - Get single testimonial
- `PUT /api/v1/testimonials/:id` - Update testimonial
- `DELETE /api/v1/testimonials/:id` - Delete testimonial

### Enquiries

- `GET /api/v1/enquiries` - Get all enquiries
- `POST /api/v1/enquiries` - Create enquiry (public)
- `GET /api/v1/enquiries/:id` - Get single enquiry
- `PUT /api/v1/enquiries/:id` - Update enquiry
- `DELETE /api/v1/enquiries/:id` - Delete enquiry

### Website Settings

- `GET /api/v1/settings` - Get website settings
- `PUT /api/v1/settings` - Update website settings

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=cloud-name
CLOUDINARY_API_KEY=api-key
CLOUDINARY_API_SECRET=api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=app-password
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Folder Structure

```
├── config/          # Configuration files
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Custom middleware
├── validators/      # Zod validation schemas
├── utils/           # Helper utilities
├── constants/       # App constants
├── database/        # DB connection
├── app.js           # Express app
└── server.js        # Entry point
```
