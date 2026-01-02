
import { Venue, GameEvent, Booking, User, SkillLevel, BookingRequest, ChatMessage } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@example.com',
  phoneNumber: '(11) 99999-0001',
  avatarUrl: 'https://i.pravatar.cc/150?u=u1',
  skillLevel: SkillLevel.INTERMEDIATE,
  rating: 4.5,
  role: 'player',
};

export const MOCK_OWNER: User = {
  id: 'o1',
  name: 'Carlos Arena',
  email: 'admin@arena.com',
  phoneNumber: '(21) 98888-1234',
  avatarUrl: 'https://i.pravatar.cc/150?u=o1',
  skillLevel: SkillLevel.ADVANCED,
  rating: 5.0,
  role: 'owner',
};

export const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    ownerId: 'o1',
    name: 'Arena Copacabana',
    address: 'Av. Atlântica, Rio de Janeiro',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400',
    sports: ['football', 'beach_volleyball', 'beach_tennis'],
    services: ['showers', 'bar'],
    pricePerHour: 150,
    distanceKm: 2.5,
    courts: [
      { id: 'c1', name: 'Quadra 1 (Areia)', sport: 'beach_volleyball' },
      { id: 'c2', name: 'Quadra 2 (Sintético)', sport: 'football' },
      { id: 'c3', name: 'Quadra 3 (Sintético)', sport: 'football' },
      { id: 'c8', name: 'Arena Beach Tennis', sport: 'beach_tennis' }
    ]
  },
  {
    id: 'v2',
    ownerId: 'o1',
    name: 'São Paulo Tennis Club',
    address: 'Jardins, São Paulo',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400',
    sports: ['tennis', 'badminton'],
    services: ['parking', 'wifi', 'lockers'],
    pricePerHour: 200,
    distanceKm: 5.0,
    courts: [
      { id: 'c4', name: 'Quadra Central (Saibro)', sport: 'tennis' },
      { id: 'c5', name: 'Quadra Coberta', sport: 'tennis' },
      { id: 'c9', name: 'Quadra Badminton 1', sport: 'badminton' }
    ]
  },
  {
    id: 'v3',
    ownerId: 'o2', // Different owner
    name: 'Parque Ibirapuera Courts',
    address: 'Vila Mariana, São Paulo',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ee3?auto=format&fit=crop&q=80&w=400',
    sports: ['basketball', 'football', 'volleyball'],
    services: ['parking'],
    pricePerHour: 80,
    distanceKm: 1.2,
    courts: [
      { id: 'c6', name: 'Quadra Externa 1', sport: 'basketball' },
      { id: 'c7', name: 'Quadra Externa 2', sport: 'football' },
      { id: 'c10', name: 'Quadra Poliesportiva', sport: 'volleyball' }
    ]
  },
];

export const MOCK_EVENTS: GameEvent[] = [
  {
    id: 'e1',
    title: 'Futebol de Domingo',
    sport: 'football',
    skillLevel: SkillLevel.INTERMEDIATE,
    venueId: 'v1',
    venueName: 'Arena Copacabana',
    date: new Date(Date.now() + 86400000).toISOString(),
    hostId: 'u2',
    hostName: 'Carlos M.',
    maxPlayers: 12,
    currentPlayers: 8,
    joinedPlayerIds: ['u2', 'u3', 'u4'],
    isPrivate: false,
    status: 'open',
  },
  {
    id: 'e2',
    title: 'Treino de Basquete',
    sport: 'basketball',
    skillLevel: SkillLevel.BEGINNER,
    venueId: 'v3',
    venueName: 'Parque Ibirapuera',
    date: new Date(Date.now() + 172800000).toISOString(),
    hostId: 'u3',
    hostName: 'Ana P.',
    maxPlayers: 6,
    currentPlayers: 2,
    joinedPlayerIds: ['u3'],
    isPrivate: false,
    status: 'open',
  },
  {
    id: 'e3',
    title: 'Beach Tennis Fun',
    sport: 'beach_tennis',
    skillLevel: SkillLevel.BEGINNER,
    venueId: 'v1',
    venueName: 'Arena Copacabana',
    date: new Date(Date.now() + 200000000).toISOString(),
    hostId: 'u4',
    hostName: 'Mariana L.',
    maxPlayers: 4,
    currentPlayers: 3,
    joinedPlayerIds: ['u4', 'u2'],
    isPrivate: false,
    status: 'open',
  },
  {
    id: 'e4',
    title: 'Badminton Duplas',
    sport: 'badminton',
    skillLevel: SkillLevel.ADVANCED,
    venueId: 'v2',
    venueName: 'São Paulo Tennis Club',
    date: new Date(Date.now() + 300000000).toISOString(),
    hostId: 'u1',
    hostName: 'João Silva',
    maxPlayers: 4,
    currentPlayers: 1,
    joinedPlayerIds: ['u1'],
    isPrivate: false,
    status: 'open',
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    venueId: 'v1',
    venueName: 'Arena Copacabana',
    courtName: 'Quadra 2 (Sintético)',
    sport: 'football',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    slot: '19:00 - 20:00',
    price: 150,
    status: 'confirmed',
  }
];

export const MOCK_REQUESTS: BookingRequest[] = [
  {
    id: 'req1',
    bookingId: 'b_new_1',
    userName: 'Pedro Santos',
    venueName: 'Arena Copacabana',
    courtName: 'Quadra 1 (Areia)',
    date: new Date(Date.now() + 100000000).toISOString(),
    slot: '18:00 - 19:00',
    status: 'pending',
    timestamp: new Date().toISOString()
  },
  {
    id: 'req2',
    bookingId: 'b_new_2',
    userName: 'Mariana Costa',
    venueName: 'Arena Copacabana',
    courtName: 'Quadra 3 (Sintético)',
    date: new Date(Date.now() + 200000000).toISOString(),
    slot: '20:00 - 21:00',
    status: 'pending',
    timestamp: new Date().toISOString()
  }
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    eventId: 'e1',
    userId: 'u2',
    userName: 'Carlos M.',
    userAvatar: 'https://i.pravatar.cc/150?u=u2',
    content: 'E aí pessoal, tudo confirmado para domingo?',
    timestamp: new Date(Date.now() - 10000000).toISOString()
  },
  {
    id: 'm2',
    eventId: 'e1',
    userId: 'system',
    userName: 'System',
    userAvatar: '',
    content: 'João Silva entrou no jogo',
    timestamp: new Date(Date.now() - 5000000).toISOString(),
    isSystem: true
  }
];
