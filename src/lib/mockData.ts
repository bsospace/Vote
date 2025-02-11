import { Poll, PollOption, Vote } from '../types/database';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  password: string; // In a real app, this would be hashed
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    password: 'user123',
  },
];

export const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What programming language do you enjoy working with the most?',
    start_time: '2025-02-01T00:00:00Z',
    end_time: '2025-12-31T23:59:59Z',
    created_by: '1',
    created_at: '2025-02-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Next Team Event',
    description: 'What should we do for our next team building event?',
    start_time: '2025-03-01T00:00:00Z',
    end_time: '2025-03-15T23:59:59Z',
    created_by: '1',
    created_at: '2025-02-15T00:00:00Z',
  },
];

export const mockPollOptions: Record<string, PollOption[]> = {
  '1': [
    {
      id: '1',
      poll_id: '1',
      title: 'JavaScript',
      description: 'Including TypeScript and Node.js',
      created_at: '2025-02-01T00:00:00Z',
    },
    {
      id: '2',
      poll_id: '1',
      title: 'Python',
      description: 'Great for data science and backend',
      created_at: '2025-02-01T00:00:00Z',
    },
    {
      id: '3',
      poll_id: '1',
      title: 'Rust',
      description: 'Systems programming with safety',
      created_at: '2025-02-01T00:00:00Z',
    },
  ],
  '2': [
    {
      id: '4',
      poll_id: '2',
      title: 'Escape Room',
      description: 'Test our problem-solving skills',
      created_at: '2025-02-15T00:00:00Z',
    },
    {
      id: '5',
      poll_id: '2',
      title: 'Cooking Class',
      description: 'Learn to cook together',
      created_at: '2025-02-15T00:00:00Z',
    },
    {
      id: '6',
      poll_id: '2',
      title: 'Paintball',
      description: 'Outdoor team activity',
      created_at: '2025-02-15T00:00:00Z',
    },
  ],
};

export const mockVotes: Vote[] = [
  {
    id: '1',
    poll_id: '1',
    option_id: '1',
    user_id: '2',
    created_at: '2025-02-02T10:00:00Z',
  },
  {
    id: '2',
    poll_id: '1',
    option_id: '2',
    user_id: '3',
    created_at: '2025-02-02T11:00:00Z',
  },
  {
    id: '3',
    poll_id: '1',
    option_id: '1',
    user_id: '4',
    created_at: '2025-02-02T12:00:00Z',
  },
];

export const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]