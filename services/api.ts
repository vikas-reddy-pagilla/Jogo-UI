
import { MOCK_VENUES, MOCK_EVENTS, MOCK_BOOKINGS, MOCK_USER, MOCK_OWNER, MOCK_REQUESTS, MOCK_MESSAGES } from './mockData';
import { User, Venue, GameEvent, Booking, BookingRequest, ChatMessage, UserRole, SkillLevel } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Api = {
  login: async (email: string, role: UserRole = 'player'): Promise<User> => {
    await delay(1000);
    return role === 'owner' ? { ...MOCK_OWNER, role } : { ...MOCK_USER, role };
  },

  register: async (name: string, email: string, phone: string, role: UserRole): Promise<User> => {
    await delay(1500);
    return {
      id: Math.random().toString(),
      name,
      email,
      phoneNumber: phone,
      avatarUrl: `https://i.pravatar.cc/150?u=${Math.random()}`,
      skillLevel: SkillLevel.BEGINNER,
      rating: 0,
      role
    };
  },

  updateUser: async (user: User): Promise<User> => {
    await delay(1000);
    // In a real app, this would update the backend
    return user;
  },

  getVenues: async (): Promise<Venue[]> => {
    await delay(800);
    return MOCK_VENUES;
  },

  getOwnerVenues: async (ownerId: string): Promise<Venue[]> => {
    await delay(800);
    return MOCK_VENUES.filter(v => v.ownerId === ownerId);
  },

  updateVenue: async (venue: Venue): Promise<Venue> => {
    await delay(1000);
    // Mock update: in reality, we'd update database
    return venue;
  },

  getEvents: async (): Promise<GameEvent[]> => {
    await delay(800);
    return MOCK_EVENTS;
  },

  getBookings: async (): Promise<Booking[]> => {
    await delay(600);
    return MOCK_BOOKINGS;
  },

  bookVenue: async (venueId: string, courtName: string, date: string, slot: string, sport: string): Promise<boolean> => {
    await delay(1500);
    return true; // Always success for mock
  },

  joinEvent: async (eventId: string): Promise<boolean> => {
    await delay(1000);
    return true;
  },

  hostGame: async (event: Partial<GameEvent>): Promise<boolean> => {
    await delay(1500);
    return true;
  },

  getBookingRequests: async (): Promise<BookingRequest[]> => {
    await delay(800);
    return MOCK_REQUESTS;
  },

  handleBookingRequest: async (requestId: string, action: 'approve' | 'decline'): Promise<boolean> => {
    await delay(500);
    return true;
  },

  getEventMessages: async (eventId: string): Promise<ChatMessage[]> => {
    await delay(300);
    return MOCK_MESSAGES.filter(m => m.eventId === eventId);
  },

  sendMessage: async (eventId: string, message: Partial<ChatMessage>): Promise<ChatMessage> => {
    await delay(300);
    return {
      id: Math.random().toString(),
      eventId,
      userId: message.userId!,
      userName: message.userName!,
      userAvatar: message.userAvatar!,
      content: message.content!,
      timestamp: new Date().toISOString(),
    };
  }
};
