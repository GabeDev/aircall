// Contact name generation service
// This ensures consistent naming across the application

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 
  'Linda', 'William', 'Elizabeth', 'David', 'Susan', 'Joseph', 'Jessica', 
  'Charles', 'Sarah', 'Thomas', 'Karen', 'Daniel', 'Nancy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 
  'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 
  'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
];

// Deterministic random generator based on seed
const seedRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate a consistent name for a given ID
const generateNameForId = (id) => {
  // Convert string ID to a number for seeding
  let numericId;
  if (typeof id === 'string') {
    // Simple hash for string IDs
    numericId = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  } else {
    numericId = Number(id);
  }
  
  // Use the ID to generate a consistent first and last name
  const firstNameIndex = Math.floor(seedRandom(numericId) * firstNames.length);
  const lastNameIndex = Math.floor(seedRandom(numericId + 100) * lastNames.length);
  
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
};

// Cache for already generated contact objects
const contactCache = new Map();

// Get or create a contact object for an ID
const getContactForId = (id) => {
  if (!contactCache.has(id)) {
    contactCache.set(id, {
      id: String(id),
      name: generateNameForId(id),
      phone: String(id),
      company: 'Aircall',
      favorite: seedRandom(id + 200) > 0.7 // Deterministic favorite status
    });
  }
  return contactCache.get(id);
};

export default {
  generateNameForId,
  getContactForId
}; 