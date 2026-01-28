# ePay - E-Commerce Authentication System

## ✅ Working Features

- **User Registration** with email verification via OTP
- **Email OTP Verification** using Nodemailer
- **Login** with JWT authentication
- **Delivery Form** after successful login
- **Product Checkout Flow**

## 🔧 Setup Instructions

### 1. Database Configuration
Your MySQL database `dummy` has been created with the following tables:
- **User** - User accounts with verification status
- **VerificationToken** - OTP tokens for email verification
- **Order** - Order records

### 2. Environment Variables
Your `.env.local` is configured with:
- ✅ Database connection (MySQL)
- ✅ SMTP settings (Gmail)
- ✅ JWT secrets
- ✅ Next.js auth settings

### 3. Run the Application
```bash
npm run dev
```
Visit: **http://localhost:3001**

## 📋 User Flow

### 1. **Homepage** (/)
- Product card with "Buy Now" button
- Click to proceed to checkout

### 2. **Login Page** (/checkout)
- Email and password login form
- Link to signup if no account
- Account must be verified to login

### 3. **Signup Page** (/checkout/signup)
- Enter: Full Name, Email, Phone, Password
- Receives **6-digit OTP** on email
- Enters OTP to verify account
- Account is now verified and ready to login

### 4. **Delivery Details** (/checkout/delivery)
- Available after successful login
- Enter: Full Name, Phone, Delivery Address
- Place order with free delivery

## 🔐 API Endpoints

### POST `/api/auth/signup`
Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+977 98...",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "message": "Account created. OTP sent to your email.",
  "userId": "...",
  "email": "john@example.com"
}
```

### POST `/api/auth/verify-otp`
Verify email with OTP
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### POST `/api/auth/login`
Login with email and password
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```
Sets HTTP-only cookie with JWT token

## 📧 Email Configuration

**SMTP Settings:**
- Host: smtp.gmail.com
- Port: 587
- Email: dharmub376@gmail.com
- Password: hkzcpdcuhpptbpnw (Gmail App Password)

**OTP Email Template:**
- Includes branded header with ePay logo
- 6-digit verification code
- 10-minute expiration time
- Clear instructions

## 🔒 Security Features

✅ Password hashing with bcryptjs  
✅ JWT tokens with httpOnly cookies  
✅ Email verification required  
✅ OTP expiration (10 minutes)  
✅ Unique email constraint  
✅ Input validation  

## 📱 Testing the Flow

### Step 1: Sign Up
1. Visit http://localhost:3001
2. Click "Buy Now"
3. Click "Create one here" link
4. Fill signup form with:
   - Name: Test User
   - Email: test@example.com
   - Phone: +977 9800000000
   - Password: TestPass123

### Step 2: Verify Email
1. Check email (dharmub376@gmail.com or your configured email)
2. Copy the 6-digit OTP
3. Enter OTP on signup page
4. Account verified!

### Step 3: Login
1. Go back to /checkout
2. Enter email and password
3. Successfully logged in
4. Redirected to delivery page

### Step 4: Place Order
1. Enter delivery details
2. Click "Place Order"
3. Order confirmed!

## 🐛 Troubleshooting

### Issue: "Email not verified" on login
- Solution: Complete signup and OTP verification first

### Issue: OTP not received
- Check spam folder
- Verify SMTP settings in .env.local
- Check email configuration is correct

### Issue: Database connection error
- Ensure MySQL is running
- Verify DATABASE_URL in .env.local
- Confirm `dummy` database exists

### Issue: Port 3000 in use
- Application automatically uses port 3001
- Or kill process on port 3000

## 📦 Dependencies

- **Prisma**: ORM for database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **nodemailer**: Email sending
- **Next.js 16**: Framework
- **React 19**: UI library
- **Tailwind CSS**: Styling

## 🎯 Next Steps

1. ✅ Test complete signup → OTP → login flow
2. ✅ Verify emails are being sent
3. ✅ Create account and place orders
4. Add payment integration
5. Add order tracking
6. Add admin dashboard

---

**Status:** ✅ Authentication fully working with OTP email verification
