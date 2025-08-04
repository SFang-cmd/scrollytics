export interface InstagramMetrics {
  followers: number;
  following: number;
  totalLikes: number;
  totalComments: number;
  accountsEngaged: number;
  engagementRate: number;
}

export interface FollowerMetric {
  date: string;
  followerCount: number;
  followingCount: number;
}

export interface EngagementMetric {
  date: string;
  likes: number;
  comments: number;
  accountsEngaged: number;
}

export interface PostMetric {
  id: string;
  type: 'photo' | 'video' | 'reel';
  likes: number;
  comments: number;
  date: string;
  engagementRate: number;
}

// Deterministic pseudo-random function
const seedRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate mock historical data for the past 30 days
const generateFollowerHistory = (): FollowerMetric[] => {
  const data: FollowerMetric[] = [];
  const baseFollowers = 12500;
  const baseFollowing = 847;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date('2024-01-01');
    date.setDate(date.getDate() + (29 - i));
    
    // Simulate growth with deterministic variance
    const growthFactor = (30 - i) / 30;
    const variance = (seedRandom(i * 123) - 0.5) * 100;
    const followingVariance = (seedRandom(i * 456) - 0.5) * 20;
    
    data.push({
      date: date.toISOString().split('T')[0],
      followerCount: Math.floor(baseFollowers + (growthFactor * 500) + variance),
      followingCount: Math.floor(baseFollowing + followingVariance)
    });
  }
  
  return data;
};

const generateEngagementHistory = (): EngagementMetric[] => {
  const data: EngagementMetric[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date('2024-01-01');
    date.setDate(date.getDate() + (29 - i));
    
    // Simulate daily engagement with deterministic values
    const baseLikes = 250 + seedRandom(i * 789) * 200;
    const baseComments = 15 + seedRandom(i * 101112) * 25;
    const baseEngaged = 180 + seedRandom(i * 131415) * 100;
    
    data.push({
      date: date.toISOString().split('T')[0],
      likes: Math.floor(baseLikes),
      comments: Math.floor(baseComments),
      accountsEngaged: Math.floor(baseEngaged)
    });
  }
  
  return data;
};

const generateRecentPosts = (): PostMetric[] => {
  const posts: PostMetric[] = [];
  const types: ('photo' | 'video' | 'reel')[] = ['photo', 'video', 'reel'];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date('2024-01-30');
    date.setDate(date.getDate() - i * 2);
    
    const likes = 180 + seedRandom(i * 161718) * 300;
    const comments = 8 + seedRandom(i * 192021) * 20;
    const engagementRate = ((likes + comments) / 13000) * 100;
    
    posts.push({
      id: `post_${i + 1}`,
      type: types[Math.floor(seedRandom(i * 222324) * types.length)],
      likes: Math.floor(likes),
      comments: Math.floor(comments),
      date: date.toISOString().split('T')[0],
      engagementRate: Math.round(engagementRate * 100) / 100
    });
  }
  
  return posts;
};

// Current metrics (latest values)
export const currentMetrics: InstagramMetrics = {
  followers: 13045,
  following: 842,
  totalLikes: 156780,
  totalComments: 8945,
  accountsEngaged: 2340,
  engagementRate: 3.2
};

// Historical data
export const followerHistory = generateFollowerHistory();
export const engagementHistory = generateEngagementHistory();
export const recentPosts = generateRecentPosts();

// Growth calculations
export const getGrowthMetrics = () => {
  const today = followerHistory[followerHistory.length - 1];
  const lastWeek = followerHistory[followerHistory.length - 8];
  const lastMonth = followerHistory[0];
  
  return {
    weeklyGrowth: {
      followers: today.followerCount - lastWeek.followerCount,
      percentage: ((today.followerCount - lastWeek.followerCount) / lastWeek.followerCount) * 100
    },
    monthlyGrowth: {
      followers: today.followerCount - lastMonth.followerCount,
      percentage: ((today.followerCount - lastMonth.followerCount) / lastMonth.followerCount) * 100
    }
  };
};