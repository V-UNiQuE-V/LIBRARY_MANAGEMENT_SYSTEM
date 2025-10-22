# Google OAuth Setup Guide

This guide explains how to configure Google OAuth authentication for the Library Management System.

## Prerequisites

1. A Google Cloud Platform account
2. Access to the server configuration files

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"

## Step 2: Configure OAuth Consent Screen

1. Click on "OAuth consent screen" in the left sidebar
2. Select "External" user type (or "Internal" if using Google Workspace)
3. Fill in the required information:
   - App name: Library Management System
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to "Credentials" tab
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Configure the settings:
   - Name: Library Management System OAuth
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Add your production URL when deploying
   - Authorized redirect URIs:
     - `http://localhost:4000/api/v1/auth/google/callback` (for development)
     - Add your production callback URL when deploying
5. Click "Create"
6. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Add the following environment variables to your `server/config/config.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# Frontend URL (already configured)
FRONTEND_URL=http://localhost:3000
```

Replace `your_google_client_id_here` and `your_google_client_secret_here` with the values you copied from the Google Cloud Console.

## Step 5: Update for Production

When deploying to production, update:

1. In Google Cloud Console:
   - Add production domain to Authorized JavaScript origins
   - Add production callback URL to Authorized redirect URIs

2. In `config.env`:
   - Update `GOOGLE_CALLBACK_URL` to your production callback URL
   - Update `FRONTEND_URL` to your production frontend URL

## How It Works

1. User clicks "Sign in with Google" button on Login or Register page
2. User is redirected to Google's OAuth consent screen
3. After authorization, Google redirects back to the callback URL
4. Server creates or links the user account and sets authentication cookie
5. User is redirected to the home page with a success message

## Security Notes

- Never commit `config.env` to version control
- Keep your Client Secret secure
- Use HTTPS in production
- Regularly rotate credentials
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Ensure the callback URL in your code matches exactly what's configured in Google Cloud Console
- Check for trailing slashes and protocol (http vs https)

### Error: "access_denied"
- User cancelled the OAuth flow
- Check OAuth consent screen configuration

### User not found after authentication
- Verify the User model is saving Google accounts correctly
- Check server logs for errors
