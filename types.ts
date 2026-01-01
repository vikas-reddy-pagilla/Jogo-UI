export type Locale = 'pt-BR' | 'en';
export type UserRole = 'player' | 'owner';

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PRO = 'pro',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl: string;
  skillLevel: SkillLevel;
  rating: number; // 0-5
  role: UserRole;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  rating: number;
  imageUrl: string;
  sports: string[];
  pricePerHour: number;
  distanceKm: number;
  courts: Court[];
}

export interface Court {
  id: string;
  name: string;
  sport: string;
}

export interface GameEvent {
  id: string;
  title: string;
  sport: string;
  skillLevel: SkillLevel;
  venueId?: string;
  venueName: string;
  date: string; // ISO string
  hostId: string;
  hostName: string;
  maxPlayers: number;
  currentPlayers: number;
  joinedPlayerIds: string[];
  isPrivate: boolean;
  description?: string;
  status: 'open' | 'full' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  courtName: string;
  sport: string;
  date: string;
  slot: string;
  price: number;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface BookingRequest {
  id: string;
  bookingId: string;
  userName: string;
  venueName: string;
  courtName: string;
  date: string;
  slot: string;
  status: 'pending' | 'approved' | 'declined';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Translation {
  welcome: string;
  login: string;
  register: string;
  email: string;
  password: string;
  home: string;
  book: string;
  events: string;
  profile: string;
  searchPlaceholder: string;
  nearbyVenues: string;
  openGames: string;
  myBookings: string;
  myEvents: string;
  settings: string;
  language: string;
  logout: string;
  hostGame: string;
  join: string;
  leave: string;
  hostedBy: string;
  perHour: string;
  selectSport: string;
  selectVenue: string;
  selectDate: string;
  selectTime: string;
  confirmBooking: string;
  success: string;
  rating: string;
  skillLevel: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  pro: string;
  loading: string;
  error: string;
  retry: string;
  noData: string;
  languageName: string;
  distance: string;
  players: string;
  cancel: string;
  submit: string;
  discover: string;
  privacy: string;
  publicGame: string;
  inviteOnly: string;
  maxPlayers: string;
  description: string;
  createGame: string;
  court: string;
  slotsAvailable: string;
  total: string;
  date: string;
  time: string;
  venue: string;
  sport: string;
  joined: string;
  host: string;
  yourRating: string;
  ratePlayers: string;
  role: string;
  player: string;
  courtOwner: string;
  dashboard: string;
  requests: string;
  calendar: string;
  pendingRequests: string;
  approve: string;
  decline: string;
  chat: string;
  typeMessage: string;
  ownerDashboard: string;
  manageVenues: string;
  name: string;
  phone: string;
  confirmPassword: string;
  alreadyHaveAccount: string;
  createAccount: string;
  passwordsDoNotMatch: string;
  verifyTitle: string;
  codeSentTo: string;
  enterCode: string;
  verify: string;
  resendCode: string;
  invalidCode: string;
}