export const allEvents = [
    // Museums (7)
    { id: 'glenbow-museum', name: 'Glenbow Museum', category: 'museum', rating: 4.5, reviews: 892, price: '$$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { id: 'heritage-park', name: 'Heritage Park Historical Village', category: 'museum', rating: 4.7, reviews: 1543, price: '$$$', hours: 'Closed • Opens 10:00 AM Tomorrow', isOpen: false },
    { id: 'telus-spark', name: 'TELUS Spark Science Centre', category: 'museum', rating: 4.6, reviews: 2108, price: '$$$', hours: 'Open • Closes 4:00 PM', isOpen: true },
    { id: 'military-museum', name: 'Military Museums', category: 'museum', rating: 4.4, reviews: 567, price: '$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { id: 'esker-foundation', name: 'Esker Foundation Contemporary Art Gallery', category: 'museum', rating: 4.3, reviews: 234, price: '$', hours: 'Closed • Opens 12:00 PM Tomorrow', isOpen: false },
    { id: 'studio-bell', name: 'Studio Bell', category: 'museum', rating: 4.8, reviews: 1876, price: '$$$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    { id: 'calgary-selfie', name: 'Calgary Selfie Museum', category: 'museum', rating: 4.2, reviews: 445, price: '$$', hours: 'Closed • Opens 9:00 AM Tomorrow', isOpen: false },
    
    // Restaurants (7)
    { id: 'porch', name: 'Porch', category: 'restaurant', rating: 4.6, reviews: 1234, price: '$$$$', hours: 'Open • Closes 10:00 PM', isOpen: true },
    { id: 'orchard', name: 'Orchard', category: 'restaurant', rating: 4.5, reviews: 987, price: '$$$', hours: 'Open • Closes 11:00 PM', isOpen: true },
    { id: 'canadian-brewhouse', name: 'The Canadian Brewhouse', category: 'restaurant', rating: 4.7, reviews: 1567, price: '$$$$$', hours: 'Closed • Opens 5:00 PM', isOpen: false },
    { id: 'bubblemania', name: 'Bubblemania', category: 'restaurant', rating: 4.4, reviews: 756, price: '$$$', hours: 'Open • Closes 10:00 PM', isOpen: true },
    { id: 'state-and-main', name: 'State & Main', category: 'restaurant', rating: 4.8, reviews: 2134, price: '$$$$', hours: 'Closed • Opens 5:30 PM', isOpen: false },
    { id: 'una', name: 'Una Pizza + Wine', category: 'restaurant', rating: 4.3, reviews: 891, price: '$$', hours: 'Open • Closes 11:00 PM', isOpen: true },
    { id: 'kinjo', name: 'Kinjo', category: 'restaurant', rating: 4.5, reviews: 1023, price: '$$$', hours: 'Open • Closes 12:00 AM', isOpen: true },
    
    // Gas Stations (6)
    { id: 'petro', name: 'Petro-Canada', category: 'gas', rating: 3.8, reviews: 145, price: '$', hours: 'Open 24 Hours', isOpen: true },
    { id: 'shell', name: 'Shell', category: 'gas', rating: 4.0, reviews: 234, price: '$', hours: 'Open 24 Hours', isOpen: true },
    { id: 'esso', name: 'Esso', category: 'gas', rating: 3.9, reviews: 198, price: '$', hours: 'Open • Closes 11:00 PM', isOpen: true },
    { id: 'co-op', name: 'Co-op Gas', category: 'gas', rating: 4.2, reviews: 312, price: '$', hours: 'Open • Closes 10:00 PM', isOpen: true },
    { id: '7-eleven', name: '7-Eleven Gas', category: 'gas', rating: 3.7, reviews: 167, price: '$', hours: 'Open 24 Hours', isOpen: true },
    { id: 'mobil', name: 'Mobil', category: 'gas', rating: 3.6, reviews: 89, price: '$', hours: 'Open • Closes 12:00 AM', isOpen: true },
    
    // Shopping/Malls (5)
    { id: 'chinook', name: 'CF Chinook Centre', category: 'shopping', rating: 4.4, reviews: 3421, price: '$$$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    { id: 'core', name: 'CORE Shopping Centre', category: 'shopping', rating: 4.3, reviews: 2876, price: '$$$', hours: 'Open • Closes 7:00 PM', isOpen: true },
    { id: 'crossiron', name: 'CrossIron Mills', category: 'shopping', rating: 4.2, reviews: 4123, price: '$$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    { id: 'market', name: 'Market Mall', category: 'shopping', rating: 4.1, reviews: 1987, price: '$$', hours: 'Open • Closes 8:00 PM', isOpen: true },
    { id: 'southcentre', name: 'Southcentre Mall', category: 'shopping', rating: 4.0, reviews: 2345, price: '$$', hours: 'Open • Closes 9:00 PM', isOpen: true },
    
    // Cafés (7)
    { id: 'phil-seb', name: 'Phil & Sebastian Coffee Roasters', category: 'cafe', rating: 4.7, reviews: 1876, price: '$$', hours: 'Open • Closes 6:00 PM', isOpen: true },
    { id: 'monogram', name: 'Monogram Coffee', category: 'cafe', rating: 4.6, reviews: 1432, price: '$$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { id: 'rosso', name: 'Rosso Coffee Roasters', category: 'cafe', rating: 4.5, reviews: 2103, price: '$', hours: 'Open • Closes 7:00 PM', isOpen: true },
    { id: 'analog', name: 'Analog Coffee', category: 'cafe', rating: 4.4, reviews: 987, price: '$', hours: 'Closed • Opens 7:00 AM Tomorrow', isOpen: false },
    { id: 'fratello', name: 'Fratello Coffee Roasters', category: 'cafe', rating: 4.3, reviews: 1234, price: '$', hours: 'Open • Closes 6:00 PM', isOpen: true },
    { id: 'higher-ground', name: 'Higher Ground Café', category: 'cafe', rating: 4.2, reviews: 678, price: '$$', hours: 'Open • Closes 5:00 PM', isOpen: true },
    { id: 'tims', name: 'Tim Hortons', category: 'cafe', rating: 4.8, reviews: 1567, price: '$$', hours: 'Closed • Opens 8:00 AM Tomorrow', isOpen: false },
  ];

  export const getEventById = (id) => {
  return allEvents.find(event => event.id === id);
};