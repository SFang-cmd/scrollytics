# Scrollytics - Instagram Analytics Dashboard

<div align="center">

![Scrollytics](https://img.shields.io/badge/Scrollytics-Instagram%20Analytics-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

</div>

## 🎯 Project Overview

Scrollytics is a comprehensive Instagram analytics dashboard platform that provides content creators with actionable insights into their Instagram accounts. Unlike generic dashboards, Scrollytics combines automated data polling, persistent historical tracking, customized metrics, and polished real-time dashboards to empower creators with the information they need to grow their influence.

Built for scalability and product engineering excellence, Scrollytics showcases backend, infrastructure, and data handling skills at a high standard.

# 🚀 Scrollytics Demo

**💡 Demo Notice:**  
The analytics and dashboards shown here feature sample data taken from a random Instagram account just for demonstration purposes.

**🔑 Want to use your own Instagram stats?**  
You can connect your own Instagram account and automatically fetch data using the [Instagram API](https://developers.facebook.com/docs/instagram-api/). Just clone this repo and follow the setup steps to connect your profile!

**🌐 Try the live demo:**  
👉 [scrollytics.vercel.app](https://scrollytics.vercel.app/)

## 🚀 Key Features

### Core Functionality
- **Instagram API Integration**: OAuth-based user authentication with periodic polling of creator stats
- **Historical Analytics**: Persistent time-series data showing daily/weekly/monthly growth patterns  
- **Custom Dashboards**: Clean, responsive web frontend with interactive visualizations
- **Multi-User Support**: Foundation for multiple creators/accounts with role-based access
- **Real-Time Data**: Manual refresh capabilities with optional notifications for rapid changes

### Technical Capabilities
- **Multi-Service Architecture**: Clear separation between frontend, backend, poller, and database
- **Containerized Services**: All services dockerized for easy local development and deployment
- **Modern Tech Stack**: Next.js, TypeScript, React, PostgreSQL, Node.js, Express.js, Python
- **Responsive Design**: Mobile-first approach with full tablet/desktop compatibility

## 🏗️ Architecture

Scrollytics follows a microservices architecture with clear separation of concerns:

```
scrollytics/
├── frontend/          # Next.js dashboard application
├── backend/           # Express.js API server  
├── poller/           # Python Instagram data fetching service
├── db/               # PostgreSQL schema and migrations
└── infra/            # Docker Compose and deployment configs
```

### Component Responsibilities

- **Frontend**: React dashboard serving analytics visualizations to end users
- **Backend**: RESTful API server providing data to frontend and managing user authentication
- **Poller**: Background service fetching Instagram data and writing to database
- **Database**: PostgreSQL storing user accounts, metrics, and historical data

## 📊 Dashboard Features

### Overview Page
- **KPI Cards**: Followers, following, likes, comments, engagement rate, accounts engaged
- **Growth Trends**: Interactive line charts showing 30-day progression
- **Engagement Metrics**: Daily likes, comments, and account engagement
- **Content Analysis**: Performance breakdown by post type (photo, video, reel)

### Detailed Analytics Pages
- **Followers**: Comprehensive follower growth analysis with daily change tracking
- **Engagement**: Deep-dive into likes, comments, and engagement rate trends
- **Comments**: Comment-focused analytics with conversation pattern analysis  
- **Reach**: Accounts engaged metrics with audience composition insights

### Technical Highlights
- **Responsive Charts**: Built with Recharts for interactive data visualization
- **Real-time Updates**: Refresh functionality for latest data sync
- **Type Safety**: Full TypeScript implementation across all components
- **Performance Optimized**: Efficient data structures and rendering patterns

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend (Planned)
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL 
- **Authentication**: JWT + OAuth2
- **API**: RESTful endpoints

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload and live updates
- **Deployment**: Vercel (frontend), cloud hosting (backend)

## 📁 Project Structure

```
scrollytics/
├── README.md                    # Project documentation
├── .gitignore                   # Git ignore patterns
│
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx         # Overview dashboard
│   │   │   ├── followers/       # Follower analytics page  
│   │   │   ├── engagement/      # Engagement analytics page
│   │   │   ├── comments/        # Comments analytics page
│   │   │   └── reach/           # Reach analytics page
│   │   ├── components/          # Reusable React components
│   │   │   ├── Layout.tsx       # Main layout with sidebar
│   │   │   ├── KPICards.tsx     # Metrics cards component
│   │   │   ├── FollowerGrowthChart.tsx
│   │   │   ├── EngagementChart.tsx
│   │   │   └── AccountsEngagedMetrics.tsx
│   │   └── lib/
│   │       └── mockData.ts      # Mock Instagram data for development
│   ├── package.json             # Dependencies and scripts
│   └── next.config.js           # Next.js configuration
│
├── backend/                     # Express.js API server
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── index.js                 # Server entry point
│   ├── package.json             # Node.js dependencies
│   └── Dockerfile               # Container configuration
│
├── poller/                      # Instagram data fetching service
│   ├── insta-poller.py         # Main polling logic
│   ├── insta-db.py             # Database integration
│   ├── pgdb.py                 # PostgreSQL utilities
│   ├── requirements.txt        # Python dependencies
│   └── tests/                  # Unit tests
│
└── db/                         # Database schema and migrations
    ├── create-tables.sql       # DDL statements
    └── tables.md              # Database documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scrollytics
   ```

2. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the dashboard**
   - Open http://localhost:3000
   - Navigate between Overview, Followers, Engagement, Comments, and Reach pages

### Current Status
- ✅ **Frontend**: Complete with responsive dashboard and detailed analytics pages
- 🔄 **Backend**: API structure in place, needs Instagram integration
- 🔄 **Poller**: Python service framework ready for Instagram API connection
- 🔄 **Database**: Schema defined, needs setup and migrations

## 🎨 Design Philosophy

### User Experience
- **Creator-Centric**: Built specifically for content creators who need actionable insights
- **Mobile-First**: Responsive design ensuring usability across all devices
- **Performance-Focused**: Fast loading with efficient data visualization
- **Intuitive Navigation**: Clear information hierarchy with logical page organization

### Technical Excellence
- **Scalable Architecture**: Microservices design supporting future multi-platform expansion
- **Type Safety**: Full TypeScript implementation preventing runtime errors
- **Modern Patterns**: Latest React patterns with hooks and functional components
- **Production Ready**: Built with deployment and monitoring considerations

## 🚀 Future Roadmap

### Phase 1: MVP (Current)
- [x] Responsive frontend dashboard
- [x] Mock data visualization
- [x] Complete page navigation
- [ ] Instagram API integration
- [ ] User authentication
- [ ] Data persistence

### Phase 2: Enhancement
- [ ] Real-time data polling
- [ ] Advanced analytics features
- [ ] Export functionality (CSV/JSON)
- [ ] Alert system for growth changes
- [ ] Mobile app companion

### Phase 3: Scale
- [ ] Multi-platform support (YouTube, TikTok)
- [ ] Team collaboration features
- [ ] Advanced reporting
- [ ] API for third-party integration

## 🤝 Contributing

This project showcases modern full-stack development practices suitable for roles at top-tier technology companies. The codebase demonstrates:

- **System Design**: Microservices architecture with clear service boundaries
- **Frontend Excellence**: Modern React patterns with TypeScript and responsive design
- **Data Engineering**: Time-series data handling with efficient visualization
- **Product Thinking**: Creator-focused features solving real user problems

## 📄 License

This project is part of a portfolio demonstrating software engineering capabilities for senior full-stack positions at companies like Meta, Amazon, and other tech leaders.

---

<div align="center">
<b>Built with ❤️ for content creators by Sean Fang</b>
</div>
