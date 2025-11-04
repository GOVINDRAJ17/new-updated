# Velocity - Modern Ride Sharing Platform

**URL**: https://lovable.dev/projects/694863b8-29a0-4685-a70b-4b3321bf61d5

## 🚀 Features

### Core Functionality
- **Book Rides**: Search and book rides with real-time fare estimates
- **Offer Rides**: Share your car and earn while helping others
- **Smart Scheduling**: Plan future rides with an interactive calendar
- **Payment Splitting**: Split ride costs easily like GPay
- **Ride Radio**: Enjoy music, podcasts, and news during your journey
- **Weather Integration**: Check weather conditions before your ride
- **Location Services**: Find nearby rides with map preview

### User Experience
- **Authentication**: Secure login/signup with email
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Beautiful UI on all devices
- **Real-time Updates**: Live ride tracking and notifications
- **Profile Management**: Manage your account and preferences

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **State Management**: React Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation

## 🗄️ Database Schema

### Tables
- **profiles**: User profile information
- **rides**: Ride bookings and offers
- **schedules**: Scheduled future rides
- **split_payments**: Payment splitting records

### Security
- Row Level Security (RLS) enabled on all tables
- User data isolation with auth.uid()
- Secure triggers and functions

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Purple gradient
- Accent: Vibrant purple/cyan

### Typography
- Font: Inter (Google Fonts)
- Modern, clean, and minimal aesthetic

### Animations
- Smooth transitions (0.3s cubic-bezier)
- Hover effects with shadows
- Gradient animations on hero section

## 🔐 Authentication

- Email/Password authentication
- Auto-confirm email for faster development
- Protected routes for authenticated users
- Session management with Supabase Auth

## 🚦 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd velocity

# Install dependencies
npm i

# Start development server
npm run dev
```

### Environment Setup
The project uses Lovable Cloud (Supabase) which is pre-configured. No additional environment variables needed.

## 📱 Usage

1. **Sign Up**: Create an account with email
2. **Browse**: Explore available rides or offer your own
3. **Book**: Select pickup/drop-off locations and time
4. **Split**: Share ride costs with fellow passengers
5. **Schedule**: Plan future rides in advance
6. **Enjoy**: Listen to music while you ride!

## 🎯 Roadmap

- [ ] Real-time ride tracking with GPS
- [ ] In-app messaging between riders
- [ ] Rating and review system
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Google Maps integration
- [ ] Multi-language support

## 🤝 Contributing

This project is built with Lovable. To contribute:

1. Visit the [Lovable Project](https://lovable.dev/projects/694863b8-29a0-4685-a70b-4b3321bf61d5)
2. Make changes via prompts or code editor
3. Changes are committed automatically

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🔗 Links

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Cloud](https://docs.lovable.dev/features/cloud)
- [Project URL](https://lovable.dev/projects/694863b8-29a0-4685-a70b-4b3321bf61d5)

## 💡 Support

For issues or questions:
- Check the [Lovable Docs](https://docs.lovable.dev/)
- Join the [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

Built with ❤️ using [Lovable](https://lovable.dev)
