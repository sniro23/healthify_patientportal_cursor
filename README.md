# Healthify Patient Portal

A modern patient portal for managing medical appointments and healthcare services.

## Features

- Appointment booking system
- Home visit scheduling
- Real-time availability checking
- Secure authentication
- Responsive design

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Google OAuth credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthify-patient-portal.git
cd healthify-patient-portal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Option 1: Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/healthify-patient-portal.git
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account.

3. Click "New Project" and import your repository.

4. Configure the environment variables in Vercel's project settings:
   - Add all the environment variables from your `.env` file
   - For `NEXTAUTH_URL`, use your Vercel deployment URL

5. Click "Deploy"

### Option 2: Deploy to GitHub Pages

1. Install the `gh-pages` package:
```bash
npm install gh-pages --save-dev
# or
yarn add gh-pages --dev
```

2. Update `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d out"
  }
}
```

3. Build the project:
```bash
npm run build
# or
yarn build
```

4. Deploy to GitHub Pages:
```bash
npm run deploy
# or
yarn deploy
```

## Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database migrations:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20240320000000_create_appointments.sql`
   - Run the SQL script

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
