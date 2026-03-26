# 📚 MangaStack

A modern, full-featured manga reading and management platform built with ReactJS. MangaStack is a web application that allows users to browse, read, and manage their favorite manga titles with an intuitive interface. Administrators can manage the entire platform including users, manga, chapters, and genres.

---

## 🎯 Project Overview

**MangaStack** is a comprehensive manga library and reading application designed to provide an engaging experience for manga enthusiasts. The platform serves three main user roles:

- **Guests**: Browse and read manga content without authentication
- **Users**: Create accounts, maintain favorites lists, rate manga, and track reading progress
- **Admins**: Full control over content management, user management, and platform administration

The application uses a modern React-based frontend with a JSON-based mock backend powered by json-server, making it ideal for rapid development, testing, and demonstration purposes.

---

## ✨ Features

### Guest Features
- 🏠 **Browse Home Page**: View trending and highly-rated manga with a spotlight feature
- 🔍 **Search & Filter**: Search manga by title or description
- 📋 **Browse Catalog**: View comprehensive manga catalog with advanced filtering options
- ⚙️ **Advanced Filters**:
  - Filter by genres (include/exclude)
  - Filter by publication status (Ongoing/Completed)
  - Sort by Title, Year, or Upload Date
- 📖 **Read Chapters**: Access and read manga chapters in multiple viewing modes
- ⭐ **View Ratings**: See community ratings and chapter information
- 📱 **Responsive Design**: Optimized for desktop and mobile devices

### User Features (Authenticated)
- 👤 **User Registration & Login**: Create account or sign in with credentials
- ❤️ **Favorite List**: Add/remove manga to personal favorites
- 📊 **Rate Manga**: Rate manga on a scale to help build community ratings
- 👥 **User Profile**: View and manage account information
- 🔐 **Secure Authentication**: Password-protected accounts with bcrypt hashing
- 📚 **My List**: Dedicated page to view all favorite manga

### Admin Features
- 📊 **Admin Dashboard**: View platform statistics (users, manga, chapters, genres count)
- 👥 **User Management**:
  - View all registered users
  - Create, edit, and delete user accounts
  - Manage user roles and permissions
- 📖 **Manga Management**:
  - Create new manga entries
  - Edit manga details (title, description, cover, status, year, genres)
  - Toggle manga visibility
  - Delete manga entries
- 📄 **Chapter Management**:
  - Add chapters to manga series
  - Upload chapter pages
  - Manage chapter visibility
  - Edit chapter information
- 🏷️ **Genre Management**:
  - Create and manage genre categories
  - Organize content with genres
  - Edit and delete genres
- 🎮 **Admin Panel**: Comprehensive admin section with CRUD operations

---

## 🛠️ Technologies Used

### Frontend
- **ReactJS** (v19.2.4): Main framework for building the UI
- **React Router DOM** (v7.13.1): Client-side routing and navigation
- **React Bootstrap** (v2.10.10): Bootstrap components integrated with React
- **Bootstrap** (v5.3.8): CSS framework for styling
- **Bootstrap Icons** (v1.13.1): Icon library for UI elements

### Backend (Mock)
- **json-server** (v0.17.4): Mock REST API server using JSON database
- **Axios** (v1.13.6): HTTP client for making API requests

### Authentication & Security
- **bcryptjs** (v3.0.3): Password hashing and verification
- **localStorage**: Client-side storage for user session management

### Development & Testing
- **React Scripts** (v5.0.1): Build scripts for React applications
- **@testing-library/react**: React component testing utilities

---

## 📁 Project Structure

```
manga_stack/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Admin/           # Admin panel components
│   │   │   ├── AdminLayout.js       # Admin main layout
│   │   │   ├── AdminDashboard.js    # Dashboard with statistics
│   │   │   ├── UsersCRUD.js         # User management
│   │   │   ├── MangaCRUD.js         # Manga management
│   │   │   ├── ChaptersCRUD.js      # Chapter management
│   │   │   └── GenresCRUD.js        # Genre management
│   │   ├── Auth.js          # Login/Registration component
│   │   ├── Home.js          # Home page with spotlight
│   │   ├── Browse.js        # Manga catalog with filters
│   │   ├── MangaDetail.js   # Detailed manga view
│   │   ├── ChapterReader.js # Chapter reading interface
│   │   ├── MyList.js        # User's favorite list
│   │   ├── Profile.js       # User profile page
│   │   ├── Header.js        # Navigation header
│   │   ├── NavBar.js        # Navigation menu
│   │   ├── MangaCard.js     # Manga card component
│   │   ├── GenreChip.js     # Genre filter chip
│   │   └── ...other components
│   ├── constants/           # Application constants
│   │   └── Bcrypt.js        # Bcrypt salt rounds configuration
│   ├── css/                 # Stylesheets
│   │   ├── Auth.css         # Authentication page styles
│   │   ├── Browse.css       # Browse page styles
│   │   ├── ChapterReader.css # Chapter reader styles
│   │   ├── Home.css         # Home page styles
│   │   ├── System.css       # Global styles
│   │   └── ...other styles
│   ├── App.js               # Main application component
│   └── index.js             # React app entry point
├── db.json                  # Mock database (json-server)
├── package.json             # Project dependencies & scripts
└── README.md                # Project documentation
```

### Key Directories Explained

- **components/**: Reusable React components organized by feature
  - `Admin/`: Full admin panel with CRUD operations
  - Public components for authentication, browsing, reading

- **constants/**: Configuration constants used across the app
  - Bcrypt configuration for password hashing

- **css/**: Component-specific and global stylesheets
  - Organized by feature for maintainability

- **db.json**: JSON database file used by json-server
  - Contains users, manga, chapters, genres, ratings, and favorites data

---

## 🚀 Installation Guide

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Tiendung2005-FPT/manga_stack
cd manga_stack
```

#### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including React, React Router, Bootstrap, Axios, bcryptjs, and json-server.

#### 3. Start json-server (Backend)
Open a **new terminal** window and run:
```bash
npx json-server --watch db.json --port 9999
```

The mock backend will start at `http://localhost:9999`

**Expected output:**
```
Loading db.json
Done

Resources
http://localhost:9999/users
http://localhost:9999/manga
http://localhost:9999/chapters
http://localhost:9999/genres
http://localhost:9999/ratings
http://localhost:9999/favorites

Home
http://localhost:9999
```

#### 4. Start React Development Server
In the original terminal, run:
```bash
npm start
```

The application will automatically open at `http://localhost:3000`

#### 5. Build for Production (Optional)
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## 📖 Usage Guide

### Navigation

The application features a top navigation header with:
- **MangaStack Logo**: Click to return to home page
- **Navigation Menu**: Quick links to main sections
- **Search Bar**: Search manga by title or description
- **User Avatar**: Profile and logout options

### Main Features

#### 🏠 **Home Page**
1. Navigate to the Home page from the main menu
2. View the **Spotlight** section highlighting the most popular manga
3. Scroll to see **Trending Now** section with top-rated manga
4. Click on any manga card to view details
5. Click "Read First Chapter" button to start reading

#### 🔍 **Browse & Search**
1. Go to **Browse** section
2. Use the **Search Bar** to find manga by title or description
3. Apply **Filters**:
   - Click "Filters" button to open filter panel
   - Select status (Ongoing/Completed)
   - Toggle genres to include or exclude
4. **Sort** results by Title, Year, or Upload Date
5. Use **"↑"** and **"↓"** indicators to change sort direction
6. Click "Clear all" to reset filters

#### 📖 **Reading Chapters**
1. Select a manga from any listing
2. Choose a chapter from the chapter list
3. Reading modes available:
   - **Vertical Scroll**: Scroll through pages vertically
   - **Horizontal**: Navigate pages with prev/next buttons
4. Use page navigation:
   - Click "< Previous" or "Next >" buttons
   - Enter page number directly and press Enter
   - Toggle header visibility for better reading experience

#### ❤️ **Favorite Management (Logged-in Users)**
1. View manga details page
2. Click **"Add to Favorites"** button (heart icon)
3. View favorites in **"My List"** section
4. Remove favorites by clicking the heart icon again

#### ⭐ **Rating Manga (Logged-in Users)**
1. Go to manga detail page
2. Click on star rating section
3. Select your rating (1-5 stars)
4. Your rating is saved and contributes to the average rating

#### 👤 **User Profile**
1. Click on your avatar in the top-right corner
2. View account information:
   - Username
   - Email
   - User role
   - User ID
3. Click **"Logout"** to sign out

#### 🔐 **Authentication**
- **Login**: Use existing credentials or register a new account
- **Register**: Create a new account with:
  - Username (unique)
  - Email (unique, valid format)
  - Password (minimum 8 characters)
  - Password confirmation
- Passwords are securely hashed using bcrypt

#### 🎮 **Admin Panel (Admin Users Only)**
1. After logging in as admin, click your avatar and select "Admin Panel"
2. **Dashboard**: View platform statistics
3. **User Management**: Create, edit, view, and delete users
4. **Manga Management**: Manage manga catalog
5. **Chapter Management**: Add and manage chapters
6. **Genre Management**: Create and organize genres

---

## 🔑 Demo Accounts

Use these pre-configured accounts to test the application:

### User Account
```
Email: user1@gmail.com
Password: 0983830901
```
*(This account has full user access including favorites, ratings, and profile)*

### Admin Account
```
Email: admin1@gmail.com
Password: 0983830901
```
*(This account has administrative access to all management features)*

### Testing
1. Open the application at `http://localhost:3000`
2. Navigate to `/auth` or click "Login" in the header
3. Choose **Login** tab
4. Enter one of the demo credentials above
5. Click **"Login"** button
6. You'll be redirected to the home page with authenticated access

---

## 📝 Database Schema (db.json)

### Users Collection
```json
{
  "id": "user123",
  "username": "username",
  "email": "user@example.com",
  "password": "bcrypt_hashed_password",
  "role": "role2"  // role1 = Admin, role2 = User
}
```

### Manga Collection
```json
{
  "id": "manga123",
  "title": "Manga Title",
  "description": "Description",
  "coverUrl": "https://...",
  "status": "ongoing",  // ongoing or completed
  "year": 2024,
  "genres": ["genre1", "genre2"],
  "uploadedAt": "2024-01-01T00:00:00Z",
  "isVisible": true
}
```

### Chapters Collection
```json
{
  "id": "chapter123",
  "mangaId": "manga123",
  "chapterNumber": 1,
  "title": "Chapter Title",
  "pages": ["page_url_1", "page_url_2", ...],
  "uploadedAt": "2024-01-01T00:00:00Z",
  "isVisible": true
}
```

### Ratings Collection
```json
{
  "id": "rating123",
  "userId": "user123",
  "mangaId": "manga123",
  "rating": 5
}
```

### Favorites Collection
```json
{
  "id": "fav123",
  "userId": "user123",
  "favoriteManga": ["manga1", "manga2", ...]
}
```

### Genres Collection
```json
{
  "id": "genre123",
  "name": "Action"
}
```

---

## ⚙️ Configuration

### API Endpoints
The application connects to a local json-server running on port `9999`:
```
Base URL: http://localhost:9999
```

Endpoints:
- `GET/POST /users` - User management
- `GET/POST /manga` - Manga catalog
- `GET/POST /chapters` - Chapters
- `GET/POST /genres` - Genres
- `GET/POST /ratings` - User ratings
- `GET/POST /favorites` - User favorites

### Authentication Configuration
- **Salt Rounds**: 10 (configured in `src/constants/Bcrypt.js`)
- **Storage**: localStorage (browser's local storage)
- **Session Key**: `currentUser`

---

## 🔍 Important Notes

### Backend Mock Database
- This project uses **json-server** as a mock backend
- Data is stored in `db.json` file
- Changes made through the UI are persisted to `db.json`
- Restarting json-server will retain all data
- Perfect for development and testing environments

### Authentication & Security
- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Plain text passwords are never stored in the database
- User sessions are maintained using localStorage
- For production use, implement a real backend with secure session management

### Limitations
1. **Single Machine**: json-server is designed for single-machine development
2. **No Real-time Sync**: Changes may require page refresh in some cases
3. **Development Only**: Not suitable for production without a proper backend
4. **File-based Storage**: Limited to file system capabilities
5. **No Database Transactions**: json-server doesn't support multi-step transactions

### Visibility & Filtering
- Manga and chapters have an `isVisible` flag
- Hidden content (where `isVisible: false`) is automatically filtered from non-admin views
- Admin users can see and manage all content regardless of visibility status

### Role System
- **role1**: Administrator with full access
- **role2**: Regular user with limited features

---

## 🚀 Getting Started

1. **Clone and Install** (see Installation Guide above)
2. **Start json-server** in one terminal
3. **Start React app** in another terminal
4. **Login** with demo credentials
5. **Explore** the application features

---

## 📚 Features Roadmap

Potential future enhancements:
- [ ] User comments and reviews
- [ ] Reading history and bookmarks
- [ ] Manga recommendations based on preferences
- [ ] Social sharing features
- [ ] Push notifications for new chapters
- [ ] Mobile app version
- [ ] Backend API with real database (MongoDB, PostgreSQL)
- [ ] User following system
- [ ] Advanced search with full-text indexing

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: Port 9999 already in use
```bash
# Use a different port
npx json-server --watch db.json --port 9998
# Update API endpoints in code accordingly
```

**Problem**: React app won't connect to json-server
- Ensure json-server is running on port 9999
- Check firewall settings
- Verify API URLs in code match server address

**Problem**: CORS errors
- json-server has CORS enabled by default
- If issues persist, check browser console for detailed errors

**Problem**: Bcrypt hashing is slow
- Bcrypt is intentionally slow for security
- This is normal behavior, not a bug

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the project's component code for implementation details

---

## 🎉 Acknowledgments

- Built with [React](https://react.dev/)
- UI powered by [Bootstrap](https://getbootstrap.com/) and [React Bootstrap](https://react-bootstrap.github.io/)
- Mock backend by [json-server](https://github.com/typicode/json-server)
- Security provided by [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

**Happy Reading! 📚✨**
