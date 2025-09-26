export const slides = [
  {
    id: 1,
    title: "welcome to",
    subtitle: "Toydacity",
    tagline: "Sustainable Toy Marketplace",
    image: "/Group.png",
  },
  {
    id: 2,
    title: "Discover",
    subtitle: "Fun Toys",
    tagline: "For Every Child's Imagination",
    image: "/Group.png",
  },
  {
    id: 3,
    title: "Explore",
    subtitle: "Creativity",
    tagline: "With Educational Toys",
    image: "/Group.png",
  },
  {
    id: 4,
    title: "Quality",
    subtitle: "Playtime",
    tagline: "Safe and Durable Toys",
    image: "/Group.png",
  },
  {
    id: 5,
    title: "Join",
    subtitle: "The Fun",
    tagline: "New Arrivals Every Month",
    image: "/Group.png",
  },
];

export const slideKeys = [
  { id: 1, key: 'slide1', image: '/Group.png' },
  { id: 2, key: 'slide2', image: '/Group.png' },
  { id: 3, key: 'slide3', image: '/Group.png' },
  { id: 4, key: 'slide4', image: '/Group.png' },
  { id: 5, key: 'slide5', image: '/Group.png' },
];

export const getSlideImage = (id: number) => `/onboarding/slide-${id}.png`; // opcional: mejora las rutas