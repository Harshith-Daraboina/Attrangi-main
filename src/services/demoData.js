// Demo data for therapists/doctors
export const demoTherapists = [
  {
    id: '1',
    name: 'Dr. Srijita Gupta',
    image: require('../../assets/doc1.png'),
    experience: '12+ years of experience',
    price: '₹2600 for 50 mins',
    expertise: ['Anxiety disorders', 'Depressive disorders', 'Stress management'],
    languages: ['English', 'Hindi', 'Bengali'],
    isOnline: true,
    nextSlot: 'Tomorrow, 08:00 AM',
    specialization: 'Clinical Psychology',
    rating: 4.8,
    bio: 'Specialized in cognitive behavioral therapy with extensive experience in treating anxiety and depression.',
    consultationFee: 2600,
    availability: 'Mon-Fri: 9:00 AM - 6:00 PM'
  },
  {
    id: '2',
    name: 'Dr. Nitasha Singh Bali',
    image: require('../../assets/doc2.png'),
    experience: '4+ years of experience',
    price: '₹1700 for 50 mins',
    expertise: ['Child Psychology', 'Family Therapy', 'Behavioral Issues'],
    languages: ['English', 'Hindi', 'Punjabi'],
    isOnline: true,
    nextSlot: 'Today, 2:00 PM',
    specialization: 'Child & Family Psychology',
    rating: 4.6,
    bio: 'Expert in child development and family dynamics, helping families build stronger relationships.',
    consultationFee: 1700,
    availability: 'Mon-Sat: 10:00 AM - 7:00 PM'
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    image: require('../../assets/doc3.png'),
    experience: '8+ years of experience',
    price: '₹2200 for 50 mins',
    expertise: ['Trauma Therapy', 'PTSD', 'Grief Counseling'],
    languages: ['English', 'Hindi', 'Marathi'],
    isOnline: false,
    nextSlot: 'Wednesday, 11:00 AM',
    specialization: 'Trauma Psychology',
    rating: 4.9,
    bio: 'Specialized in trauma-informed care and helping clients heal from past experiences.',
    consultationFee: 2200,
    availability: 'Tue-Sat: 9:00 AM - 5:00 PM'
  },
  {
    id: '4',
    name: 'Dr. Rajesh Kumar',
    image: require('../../assets/doc4.png'),
    experience: '15+ years of experience',
    price: '₹3000 for 50 mins',
    expertise: ['Addiction Therapy', 'Substance Abuse', 'Recovery Support'],
    languages: ['English', 'Hindi', 'Tamil'],
    isOnline: true,
    nextSlot: 'Tomorrow, 10:00 AM',
    specialization: 'Addiction Psychology',
    rating: 4.7,
    bio: 'Leading expert in addiction recovery with a compassionate approach to healing.',
    consultationFee: 3000,
    availability: 'Mon-Fri: 8:00 AM - 6:00 PM'
  },
  {
    id: '5',
    name: 'Dr. Meera Patel',
    image: require('../../assets/doc5.png'),
    experience: '6+ years of experience',
    price: '₹1900 for 50 mins',
    expertise: ['Couples Therapy', 'Relationship Issues', 'Communication Skills'],
    languages: ['English', 'Hindi', 'Gujarati'],
    isOnline: true,
    nextSlot: 'Today, 4:00 PM',
    specialization: 'Relationship Psychology',
    rating: 4.5,
    bio: 'Dedicated to helping couples build stronger, healthier relationships through effective communication.',
    consultationFee: 1900,
    availability: 'Mon-Sat: 11:00 AM - 8:00 PM'
  }
];

export const getTherapists = () => {
  return Promise.resolve(demoTherapists);
};

export const getTherapistById = (id) => {
  const therapist = demoTherapists.find(t => t.id === id);
  return Promise.resolve(therapist);
};

// Alias for API compatibility
export const getDoctor = getTherapistById;
