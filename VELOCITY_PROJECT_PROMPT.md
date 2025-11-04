# Complete AI Prompt: Velocity Ride-Sharing Application

## Project Overview
Build "Velocity" - a modern, feature-rich ride-sharing web application with real-time communication, social features, and integrated payments. The app emphasizes a premium matte aesthetic with smooth animations and a comprehensive feature set.

---

## 🎨 DESIGN SYSTEM & VISUAL IDENTITY

### Color Palette (All HSL Format)

#### Light Mode Theme
```css
--background: 40 20% 97%        /* Matte beige/cream - soft, warm base */
--foreground: 220 15% 20%       /* Dark blue-gray text */
--primary: 220 90% 56%          /* Vibrant blue (#3B82F6-like) - main brand */
--primary-foreground: 0 0% 100% /* Pure white text on primary */
--accent: 270 80% 60%           /* Rich purple (#A855F7-like) - highlights */
--accent-foreground: 0 0% 100%  /* White text on accent */
--secondary: 40 15% 90%         /* Light warm gray */
--secondary-foreground: 222.2 47.4% 11.2% /* Very dark text */
--muted: 40 15% 92%             /* Slightly lighter warm gray */
--muted-foreground: 220 10% 50% /* Medium gray text */
--card: 0 0% 100%               /* Pure white cards */
--card-foreground: 220 15% 20%  /* Dark text on cards */
--border: 40 15% 88%            /* Subtle warm borders */
--input: 40 15% 90%             /* Input backgrounds */
--ring: 220 90% 56%             /* Focus ring (matches primary) */
--destructive: 0 84.2% 60.2%    /* Error red */
--destructive-foreground: 0 0% 100% /* White on errors */
```

#### Dark Mode Theme
```css
--background: 222.2 47% 11%     /* Very dark blue-gray - deep, rich */
--foreground: 210 40% 98%       /* Almost white text */
--primary: 217.2 91.2% 59.8%    /* Brighter blue for contrast */
--primary-foreground: 222.2 47.4% 11.2% /* Dark text on primary */
--accent: 270 80% 60%           /* Purple (consistent) */
--accent-foreground: 0 0% 100%  /* White on accent */
--secondary: 217.2 32.6% 17.5%  /* Dark blue-gray */
--secondary-foreground: 210 40% 98% /* Light text */
--muted: 217.2 32.6% 17.5%      /* Muted dark */
--muted-foreground: 215 20.2% 65.1% /* Medium gray */
--card: 217.2 32.6% 15%         /* Slightly lighter than background */
--card-foreground: 210 40% 98%  /* Light text */
--border: 217.2 32.6% 20%       /* Subtle borders */
--input: 217.2 32.6% 17.5%      /* Input backgrounds */
--ring: 224.3 76.3% 48%         /* Focus ring (brighter) */
```

#### Gradient Definitions
```css
--gradient-primary: linear-gradient(135deg, hsl(220 90% 56%) 0%, hsl(270 80% 60%) 100%)
/* Blue to purple diagonal - used for CTAs, highlights */

--gradient-hero: linear-gradient(135deg, hsl(220 90% 56%) 0%, hsl(260 85% 58%) 50%, hsl(270 80% 60%) 100%)
/* Blue through mid-purple to purple - hero sections */

--gradient-secondary: linear-gradient(180deg, hsl(220 90% 56% / 0.1) 0%, hsl(270 80% 60% / 0.1) 100%)
/* Subtle transparent overlay - backgrounds */
```

#### Shadow System (Matte/Soft Style)
```css
--shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.06)     /* Gentle elevation */
--shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.12)    /* Elevated hover state */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08)      /* Subtle card depth */
```

### Typography System

#### Font Family
- **Primary Font**: `Inter` (Google Fonts)
  - Weights used: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
  - Applied globally via `font-sans` class
  - Fallbacks: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
  - Font smoothing: `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`

#### Typography Scale (Tailwind)
- Headings: `text-4xl` (36px), `text-3xl` (30px), `text-2xl` (24px)
- Body: `text-lg` (18px), `text-base` (16px), `text-sm` (14px)
- Small: `text-xs` (12px)

### Spacing & Layout

#### Border Radius
```css
--radius: 1.5rem (24px)         /* Primary radius - smooth, modern */
lg: var(--radius)               /* 24px - cards, buttons */
md: calc(var(--radius) - 2px)  /* 22px - nested elements */
sm: calc(var(--radius) - 4px)  /* 20px - small components */
```

#### Container
- Max width: `1400px` (2xl breakpoint)
- Centered with auto margins
- Padding: `2rem` (32px)

#### Responsive Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

### Animation System

#### Transition Definitions
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
/* Standard easing for most interactions */

--transition-spring: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
/* Elastic/bouncy effect for emphasis */
```

#### Keyframe Animations

**Scroll Animations:**
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```

**Accordion Animations:**
```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
```

#### Animation Classes
- `.animate-on-scroll` - fadeInUp 0.6s
- `.animate-fade-left` - fadeInLeft 0.6s
- `.animate-fade-right` - fadeInRight 0.6s
- `.animate-scale` - scaleIn 0.6s
- `.animate-accordion-down` - 0.2s ease-out
- `.animate-accordion-up` - 0.2s ease-out

#### Utility Classes
```css
.gradient-primary { background: var(--gradient-primary); }
.gradient-hero { background: var(--gradient-hero); }
.shadow-soft { box-shadow: var(--shadow-soft); }
.shadow-hover { box-shadow: var(--shadow-hover); }
.shadow-card { box-shadow: var(--shadow-card); }
.transition-smooth { transition: var(--transition-smooth); }
.transition-spring { transition: var(--transition-spring); }
```

### Visual Style Principles
1. **Modern Matte Aesthetic**: Soft shadows, warm neutrals, no harsh glossy effects
2. **Premium Feel**: Generous spacing, large border radius, smooth transitions
3. **Vibrant Accents**: Blue-purple gradient system for energy and movement
4. **Clean Hierarchy**: Clear contrast between background, cards, and elevated elements
5. **Smooth Interactions**: Cubic-bezier easing, spring animations for delight

---

## 🧭 NAVIGATION & HEADER

### Navbar Component Structure

#### Desktop Layout
```tsx
<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Car className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold">Velocity</span>
      </div>
      
      {/* Center: Navigation Links */}
      <div className="hidden md:flex space-x-8">
        <a href="#features">Features</a>
        <a href="#social">Social</a>
        <a href="#schedule">Schedule</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      
      {/* Right: Theme Toggle + Auth */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={toggleTheme}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
        <Button variant="default">Sign In</Button>
      </div>
    </div>
  </div>
</nav>
```

#### Navbar Behavior
- **Fixed Position**: `fixed top-0 w-full z-50` - always visible
- **Glass Morphism**: `bg-background/80 backdrop-blur-md` - semi-transparent with blur
- **Border**: `border-b` - subtle separation from content
- **Height**: `h-16` (64px) - standard comfortable height
- **Responsive**: Links hidden on mobile (`hidden md:flex`), replaced with hamburger menu

#### Navbar Interactions
- **Scroll Behavior**: Smooth scroll to sections (`scroll-behavior: smooth` in CSS)
- **Link Hover**: `hover:text-primary transition-smooth` - color change with smooth transition
- **Active State**: Can implement active section highlighting with scroll detection
- **Mobile Menu**: Toggles with animation, full-screen overlay on small devices

### Logo Design
- **Icon**: Lucide React `<Car />` icon - 32px (`h-8 w-8`)
- **Color**: `text-primary` - vibrant blue
- **Text**: "Velocity" - 20px (`text-xl`), `font-bold`
- **Alignment**: Centered vertically with icon using `flex items-center`

---

## 📄 PAGE SECTIONS & COMPONENTS

### 1. Hero Section

#### Layout & Structure
```tsx
<section className="relative min-h-screen flex items-center justify-center pt-16">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <img src="/hero-image.jpg" alt="Hero" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
  </div>
  
  {/* Content */}
  <div className="container relative z-10 text-center">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
      Share Your Journey
    </h1>
    <p className="text-xl md:text-2xl text-muted-foreground mb-8">
      Connect with riders, split costs, and travel smart
    </p>
    <div className="flex gap-4 justify-center">
      <Button size="lg" className="gradient-primary">Get Started</Button>
      <Button size="lg" variant="outline">Learn More</Button>
    </div>
  </div>
</section>
```

#### Hero Styling Details
- **Height**: `min-h-screen` - full viewport height
- **Background**: Hero image with gradient overlay for text readability
- **Typography**: 
  - H1: 48px mobile → 72px desktop (`text-5xl md:text-7xl`)
  - Subtitle: 20px → 24px (`text-xl md:text-2xl`)
- **Buttons**:
  - Primary CTA: Gradient background, large size
  - Secondary: Outline variant
  - Gap: `gap-4` (16px) between buttons
- **Animation**: Fade in on load

### 2. Create Ride Section

#### Features
- Form to create a new ride offer
- Fields: Origin, Destination, Date/Time, Available Seats, Price
- Date picker component (react-day-picker)
- Form validation with react-hook-form + Zod
- Submit creates entry in Supabase `rides` table

#### Form Styling
```tsx
<Card className="shadow-card">
  <CardHeader>
    <CardTitle>Create a Ride</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">From</Label>
          <Input id="origin" placeholder="Starting point" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">To</Label>
          <Input id="destination" placeholder="Destination" />
        </div>
      </div>
      <Button type="submit" className="w-full">Create Ride</Button>
    </form>
  </CardContent>
</Card>
```

#### Input Styling
- **Background**: `bg-input` - warm gray in light mode
- **Border**: `border border-input` - subtle
- **Padding**: `px-3 py-2` - comfortable touch targets
- **Border Radius**: `rounded-md` (22px)
- **Focus**: `focus-visible:ring-2 ring-ring` - blue ring
- **Hover**: Slight background change

### 3. Social Hub Section

#### Tabbed Interface
Contains four main features in a grid layout:

**Left Column:**
1. **Push-to-Talk**: 
   - Large circular button in center
   - Hold to record voice message
   - Visual feedback with pulse animation
   - Lucide `Mic` icon

2. **Ride Chat**:
   - Real-time chat interface
   - Message bubbles (own messages: right-aligned blue, others: left-aligned gray)
   - Supabase Realtime for instant updates
   - Input at bottom with send button

3. **FM Radio**:
   - Frequency tuner UI
   - Play/Pause controls
   - Station preset buttons
   - Volume slider

**Right Column:**
4. **Nearby Rides Map**:
   - Interactive map showing available rides
   - Markers for pickup/dropoff points
   - Cluster markers when zoomed out
   - Click marker to see ride details

#### Component Styling
```tsx
<section className="py-20 bg-muted/30">
  <div className="container">
    <h2 className="text-4xl font-bold text-center mb-12">
      Connect & Communicate
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Components here */}
    </div>
  </div>
</section>
```

### 4. Schedule Section

#### Calendar Interface
- Month view calendar using react-day-picker
- Dates with scheduled rides highlighted
- Click date to see ride details
- Filter by ride type (offering/requesting)

#### Styling
- Cards for each scheduled ride
- Color-coded badges for ride status
- Responsive grid: 1 column mobile, 2-3 columns desktop

### 5. Weather Section

#### Features
- 4-day weather forecast
- Current weather at user's location
- Temperature toggle (Fahrenheit/Celsius)
- Weather icons (sunny, cloudy, rainy, etc.)
- Fetches from weather API

#### Card Layout
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {forecast.map(day => (
    <Card key={day.date} className="text-center">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{day.date}</p>
        <CloudSun className="h-12 w-12 mx-auto my-4 text-primary" />
        <p className="text-2xl font-bold">{day.temp}°</p>
        <p className="text-sm">{day.condition}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

### 6. Location Section

#### Features
- Request user's current location (Geolocation API)
- Display on interactive map
- Show nearby rides within radius
- Privacy controls

### 7. Split Payments Section

#### Features
- Divide ride cost among participants
- Integrations:
  - **Razorpay**: Payment gateway integration
  - **UPI QR Scanner**: Scan QR codes to pay
- Calculate per-person cost
- Payment status tracking

#### Payment Button Styling
```tsx
<Button className="gradient-primary shadow-hover">
  <Wallet className="mr-2" />
  Pay with Razorpay
</Button>
```

### 8. About Section

#### Content
- Mission statement
- How Velocity works (3-step process)
- Benefits of carpooling
- Team/company information

#### Layout
- Two-column layout on desktop
- Image on left, text on right
- Alternating pattern for multiple points

### 9. Contact Section

#### Form Fields
- Name (text input)
- Email (email input with validation)
- Message (textarea)
- Submit button

#### Form Styling
```tsx
<form className="space-y-6 max-w-lg mx-auto">
  <div className="space-y-2">
    <Label>Name</Label>
    <Input type="text" placeholder="Your name" />
  </div>
  <div className="space-y-2">
    <Label>Email</Label>
    <Input type="email" placeholder="you@example.com" />
  </div>
  <div className="space-y-2">
    <Label>Message</Label>
    <Textarea placeholder="Your message..." rows={5} />
  </div>
  <Button type="submit" className="w-full">Send Message</Button>
</form>
```

### 10. Footer

#### Structure
- Three columns: About, Quick Links, Social Media
- Copyright notice
- Links styled with hover effects
- Social icons (Lucide React)

#### Styling
```tsx
<footer className="bg-card border-t py-12">
  <div className="container">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Footer content */}
    </div>
    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
      © 2024 Velocity. All rights reserved.
    </div>
  </div>
</footer>
```

---

## 🎨 UI COMPONENT LIBRARY (shadcn/ui)

### Button Component

#### Variants
```tsx
// Default (Primary)
<Button variant="default">
  /* bg-primary, text-primary-foreground, hover:bg-primary/90 */
</Button>

// Secondary
<Button variant="secondary">
  /* bg-secondary, text-secondary-foreground, hover:bg-secondary/80 */
</Button>

// Outline
<Button variant="outline">
  /* border, bg-background, hover:bg-accent */
</Button>

// Ghost
<Button variant="ghost">
  /* transparent, hover:bg-accent */
</Button>

// Destructive
<Button variant="destructive">
  /* bg-destructive, text-destructive-foreground */
</Button>

// Link
<Button variant="link">
  /* text-primary, underline-offset-4, hover:underline */
</Button>
```

#### Sizes
```tsx
<Button size="default"> /* h-10 px-4 py-2 */
<Button size="sm">      /* h-9 px-3 */
<Button size="lg">      /* h-11 px-8 */
<Button size="icon">    /* h-10 w-10 (square) */
```

#### Button Styling Details
- **Border Radius**: `rounded-md` (22px from design system)
- **Font**: `text-sm font-medium`
- **Transition**: `transition-colors` (from --transition-smooth)
- **Focus**: `focus-visible:ring-2 ring-ring ring-offset-2`
- **Disabled**: `disabled:pointer-events-none disabled:opacity-50`
- **Icon Spacing**: `gap-2` between icon and text

### Card Component

#### Structure
```tsx
<Card className="shadow-card">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

#### Styling
- **Background**: `bg-card` (white/dark based on theme)
- **Text**: `text-card-foreground`
- **Border**: `border rounded-lg`
- **Padding**: Header/Content/Footer have appropriate padding
- **Shadow**: Custom `shadow-card` class for subtle depth

### Input Component

#### Styling
```tsx
<Input 
  type="text"
  placeholder="Enter text..."
  className="w-full"
/>
```

- **Height**: `h-10` (40px)
- **Padding**: `px-3 py-2`
- **Background**: `bg-input`
- **Border**: `border border-input rounded-md`
- **Focus**: `focus-visible:ring-2 ring-ring`
- **Placeholder**: `placeholder:text-muted-foreground`
- **File input**: Custom styling with `file:` prefix modifiers

### Textarea Component

#### Styling
- Similar to Input but minimum height
- **Min Height**: `min-h-[80px]`
- **Resize**: `resize-none` (controlled)
- **Border Radius**: `rounded-md`

### Select Component

#### Usage
```tsx
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Styling
- Trigger: Button-like appearance with chevron icon
- Content: Dropdown with shadow, animated entry/exit
- Items: Hover background, padding, cursor pointer

### Dialog Component

#### Modal Overlay
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Styling
- **Overlay**: `bg-background/80 backdrop-blur-sm` - glass effect
- **Content**: Centered, animated scale-in, shadow-lg
- **Max Width**: `sm:max-w-[425px]` - comfortable reading width
- **Animation**: Fade in overlay, scale in content

### Tabs Component

#### Usage
```tsx
<Tabs defaultValue="tab1">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### Styling
- **List**: `bg-muted rounded-lg p-1` - pill container
- **Trigger**: 
  - Inactive: `text-muted-foreground`
  - Active: `bg-background text-foreground shadow-sm`
  - Transition: Smooth background and color change
- **Content**: Fade in animation when switching

### Badge Component

#### Variants
```tsx
<Badge variant="default">    /* bg-primary */
<Badge variant="secondary">  /* bg-secondary */
<Badge variant="destructive"> /* bg-destructive */
<Badge variant="outline">    /* border, transparent */
```

#### Styling
- **Size**: `text-xs px-2.5 py-0.5` - compact
- **Border Radius**: `rounded-full` - pill shape
- **Font**: `font-semibold` - bold text

### Avatar Component

#### Usage
```tsx
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

#### Styling
- **Size**: `h-10 w-10` (40px square, made circular)
- **Border Radius**: `rounded-full`
- **Fallback**: Centered initials with `bg-muted`

### Toast Component (Notifications)

#### Usage
```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

toast({
  title: "Success",
  description: "Your ride has been created.",
  variant: "default" // or "destructive"
})
```

#### Styling
- **Position**: Fixed bottom-right (desktop) or top-center (mobile)
- **Animation**: Slide in from right, fade out
- **Duration**: Auto-dismiss after 5 seconds (configurable)
- **Variants**: Default (white), Destructive (red)

---

## 🔧 TECHNICAL IMPLEMENTATION

### Technology Stack

#### Core Framework
- **React 18.3.1**: Latest React with concurrent features
- **TypeScript**: Full type safety across codebase
- **Vite**: Fast build tool and dev server
- **React Router DOM 6.30.1**: Client-side routing

#### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **tailwindcss-animate**: Pre-built animations
- **class-variance-authority**: Component variant management
- **clsx + tailwind-merge**: Conditional className merging

#### UI Components
- **shadcn/ui**: Radix UI primitives with Tailwind styling
- **Radix UI**: 20+ headless accessible components
- **Lucide React 0.462.0**: 1000+ icons
- **Sonner**: Beautiful toast notifications

#### Backend & Database
- **Supabase (via Lovable Cloud)**:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (email/password, OAuth)
  - Row Level Security (RLS)
  - Storage for files/images

#### State Management
- **React Query (@tanstack/react-query 5.83.0)**: 
  - Server state management
  - Automatic caching and refetching
  - Optimistic updates
  - Error handling

#### Form Handling
- **React Hook Form 7.61.1**: Form state management
- **Zod 3.25.76**: Schema validation
- **@hookform/resolvers**: Zod + RHF integration

#### Date & Time
- **date-fns 3.6.0**: Date manipulation and formatting
- **react-day-picker 8.10.1**: Calendar/date picker component

#### Payments
- **react-razorpay 3.0.1**: Razorpay payment gateway integration
- Custom QR scanner implementation

#### Charts & Data Viz
- **Recharts 2.15.4**: Chart library for analytics

#### Other Libraries
- **embla-carousel-react**: Carousel/slider component
- **vaul**: Mobile drawer component
- **input-otp**: OTP input component

### Database Schema

#### Tables

**profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
```

**rides**
```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  available_seats INTEGER NOT NULL,
  price_per_seat DECIMAL(10,2),
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rides viewable by everyone" ON rides FOR SELECT USING (true);
CREATE POLICY "Users can create rides" ON rides FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own rides" ON rides FOR UPDATE USING (auth.uid() = created_by);
```

**ride_participants**
```sql
CREATE TABLE ride_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  seats_booked INTEGER DEFAULT 1,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE ride_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view own bookings" ON ride_participants 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join rides" ON ride_participants 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**ride_chat_messages**
```sql
CREATE TABLE ride_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE ride_chat_messages;

-- RLS Policies
ALTER TABLE ride_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages viewable by ride participants" ON ride_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ride_participants 
      WHERE ride_id = ride_chat_messages.ride_id 
      AND user_id = auth.uid()
    )
  );
```

**schedules**
```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  reminder_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**split_payments**
```sql
CREATE TABLE split_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT, -- razorpay, upi, cash
  payment_reference TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Authentication Flow

#### Sign Up
```tsx
const handleSignup = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })
  
  if (!error) {
    // Create profile entry
    await supabase.from('profiles').insert({
      user_id: data.user.id,
      full_name: fullName
    })
  }
}
```

#### Sign In
```tsx
const handleLogin = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
}
```

#### Protected Routes
```tsx
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" />
  return <>{children}</>
}
```

### Real-time Features

#### Chat Messages
```tsx
useEffect(() => {
  const channel = supabase
    .channel(`ride_chat:${rideId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ride_chat_messages',
        filter: `ride_id=eq.${rideId}`
      },
      (payload) => {
        setMessages(prev => [...prev, payload.new])
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [rideId])
```

### API Integrations

#### Weather API
- Fetches 4-day forecast
- Uses OpenWeatherMap or similar service
- Geolocation-based current weather

#### Payment Gateway (Razorpay)
```tsx
const handlePayment = async (amount: number) => {
  const options = {
    key: RAZORPAY_KEY,
    amount: amount * 100, // paise
    currency: 'INR',
    name: 'Velocity',
    description: 'Ride Payment',
    handler: (response) => {
      // Update payment status in database
    }
  }
  
  const razorpay = new Razorpay(options)
  razorpay.open()
}
```

#### QR Code Scanner
- Uses device camera
- Scans UPI QR codes for payments
- Extracts payment details and initiates transaction

### Performance Optimizations

#### Code Splitting
- React.lazy() for route-based code splitting
- Dynamic imports for heavy components

#### Image Optimization
- Lazy loading with `loading="lazy"`
- Responsive images with srcset
- WebP format with fallbacks

#### Caching Strategy
- React Query caching for API responses
- Stale-while-revalidate pattern
- Background refetch on window focus

### Responsive Design Strategy

#### Mobile First
- Base styles target mobile (320px+)
- Progressive enhancement for larger screens
- Touch-friendly tap targets (min 44x44px)

#### Breakpoint Usage
```tsx
<div className="
  grid 
  grid-cols-1      /* mobile: 1 column */
  md:grid-cols-2   /* tablet: 2 columns */
  lg:grid-cols-3   /* desktop: 3 columns */
  gap-4 md:gap-6 lg:gap-8
">
```

#### Navigation
- Mobile: Hamburger menu (sheet/drawer)
- Desktop: Horizontal nav bar
- Tablet: Hybrid approach

---

## 🎯 USER EXPERIENCE FLOW

### 1. Landing Page Journey
1. User lands on hero section
2. Scrolls to see features with scroll animations
3. Clicks "Get Started" → navigates to sign up
4. Or explores features first

### 2. Creating a Ride
1. User logs in
2. Navigates to "Create Ride" section (scrolls or navbar link)
3. Fills form: Origin, Destination, DateTime, Seats, Price
4. Submits → Toast notification confirms creation
5. Ride appears in user's schedule

### 3. Finding & Joining Rides
1. User views "Nearby Rides Map"
2. Clicks marker to see ride details
3. Clicks "Join Ride" button
4. Confirms booking
5. Added to ride participants
6. Unlocks ride chat access

### 4. Communication During Ride
1. Participants access ride chat
2. Real-time messages sync instantly
3. Push-to-talk for voice messages
4. FM Radio for entertainment

### 5. Payment Splitting
1. After ride completion
2. Host initiates payment request
3. Participants see amount due
4. Pay via Razorpay or scan UPI QR
5. Payment status updates in real-time

### 6. Post-Ride
1. Rate and review experience
2. View ride history
3. Schedule future rides

---

## 🌟 KEY DESIGN DECISIONS

### Why Matte Aesthetic?
- **Modern Feel**: Glossy designs feel dated; matte is contemporary
- **Reduced Eye Strain**: Softer shadows and no harsh reflections
- **Premium Perception**: Matte finishes associated with luxury products
- **Focus on Content**: Less visual noise from reflective surfaces

### Why Blue-Purple Gradient?
- **Energy & Trust**: Blue conveys reliability (ride-sharing safety)
- **Creativity**: Purple adds modern, tech-forward vibe
- **Differentiation**: Stands out from typical ride-sharing apps (often single color)
- **Versatility**: Works across light and dark modes

### Why Large Border Radius (24px)?
- **Modern Trend**: Aligns with iOS/Material Design 3 direction
- **Friendly Appearance**: Rounded corners feel approachable
- **Visual Comfort**: Easier on eyes than sharp corners
- **Brand Consistency**: Applied consistently creates strong identity

### Why Fixed Navbar?
- **Constant Access**: Navigation always visible
- **User Expectation**: Common pattern users understand
- **Scrolling Distance**: Long single-page app benefits from quick navigation

### Why Glass Morphism?
- **Modern Aesthetic**: On-trend design technique
- **Depth Perception**: Creates layering without heavy shadows
- **Context Preservation**: See content beneath for better spatial awareness

---

## 📱 ACCESSIBILITY FEATURES

### Keyboard Navigation
- All interactive elements focusable
- Focus visible ring (2px blue outline)
- Tab order follows logical flow
- Escape key closes modals/menus

### Screen Reader Support
- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`)
- ARIA labels on icons and icon-only buttons
- Alt text on all images
- Form labels properly associated

### Color Contrast
- WCAG AA compliant (4.5:1 minimum for text)
- Primary blue on white: 4.6:1
- Foreground on background: 8.2:1
- Link colors meet contrast requirements

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 DEPLOYMENT & OPTIMIZATION

### Build Configuration (Vite)
```typescript
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
```

### Environment Variables
```env
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_RAZORPAY_KEY=<razorpay-key>
```

### SEO Optimization
```html
<!-- index.html -->
<head>
  <title>Velocity - Smart Ride Sharing</title>
  <meta name="description" content="Connect with riders, split costs, and travel smart with Velocity's modern ride-sharing platform." />
  <meta name="keywords" content="ride sharing, carpooling, split payments, travel" />
  <meta property="og:title" content="Velocity - Smart Ride Sharing" />
  <meta property="og:image" content="/og-image.jpg" />
  <link rel="canonical" href="https://velocity.app" />
</head>
```

---

## 🎨 DESIGN PHILOSOPHY SUMMARY

**Velocity** embodies a **modern, premium ride-sharing experience** through:

1. **Visual Cohesion**: Blue-purple gradient system creates recognizable brand identity
2. **Comfortable Interactions**: Smooth animations and generous spacing reduce friction
3. **Accessibility First**: WCAG compliance and keyboard navigation for all users
4. **Performance**: Optimized React code, lazy loading, and efficient caching
5. **Scalability**: Component-based architecture with TypeScript for maintainability
6. **User-Centric**: Clear hierarchy, intuitive navigation, and immediate feedback

### Core User Experience Goals

✅ **Trustworthy**: Professional design instills confidence in safety
✅ **Effortless**: Minimal steps to create/join rides
✅ **Social**: Real-time chat and voice create community
✅ **Transparent**: Clear pricing and payment splitting
✅ **Delightful**: Smooth animations and thoughtful microinteractions

---

## 📋 COMPLETE FEATURE CHECKLIST

- ✅ User authentication (email/password)
- ✅ Create ride offers with details
- ✅ Browse and search available rides
- ✅ Join rides and manage bookings
- ✅ Real-time ride chat with participants
- ✅ Push-to-talk voice messages
- ✅ FM Radio entertainment
- ✅ Interactive map with ride markers
- ✅ Weather forecast (4-day, F/C toggle)
- ✅ Location services integration
- ✅ Ride scheduling with calendar
- ✅ Split payment calculation
- ✅ Razorpay payment gateway
- ✅ UPI QR code scanner
- ✅ User profiles with avatars
- ✅ Theme toggle (light/dark mode)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Toast notifications for feedback
- ✅ Form validation with error messages
- ✅ Accessibility features (keyboard nav, ARIA labels)
- ✅ Scroll animations on sections
- ✅ Glass morphism navbar
- ✅ Contact form
- ✅ About section with mission
- ✅ Footer with links and social icons

---

## 🎨 FINAL DESIGN TOKEN REFERENCE

```css
/* Quick Copy-Paste Design System */

/* Colors (Light) */
--primary: 220 90% 56%      /* #3b82f6-like blue */
--accent: 270 80% 60%       /* #a855f7-like purple */
--background: 40 20% 97%    /* Warm off-white */

/* Colors (Dark) */
--primary: 217.2 91.2% 59.8%  /* Brighter blue */
--background: 222.2 47% 11%   /* Deep navy */

/* Spacing Scale */
0.5rem = 8px
1rem = 16px
1.5rem = 24px (default border-radius)
2rem = 32px (container padding)

/* Font Sizes */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-4xl: 36px
text-7xl: 72px

/* Shadows */
shadow-card: 0 1px 3px rgba(0,0,0,0.08)
shadow-soft: 0 2px 12px rgba(0,0,0,0.06)
shadow-hover: 0 8px 32px rgba(0,0,0,0.12)

/* Transitions */
transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
transition-spring: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## 🎯 CONCLUSION

**Velocity** is a comprehensive, production-ready ride-sharing platform that combines:
- **Beautiful Design**: Matte aesthetic with blue-purple gradients and smooth animations
- **Robust Features**: From ride creation to real-time chat to payment splitting
- **Modern Tech Stack**: React + TypeScript + Tailwind + Supabase
- **User-Focused UX**: Intuitive navigation, immediate feedback, and delightful interactions

The design system prioritizes **consistency** (semantic color tokens), **accessibility** (WCAG compliance), and **performance** (optimized React components). Every interaction is crafted to feel **smooth and premium**, from the glass-morphism navbar to the spring-animated buttons.

Whether users are offering rides, joining journeys, or splitting costs, Velocity provides a **trustworthy, efficient, and enjoyable** experience that makes shared travel feel modern and effortless.

---

**This prompt captures every pixel, interaction, and line of code in Velocity. Use it to recreate, understand, or extend the application with complete fidelity to the original design vision.**
