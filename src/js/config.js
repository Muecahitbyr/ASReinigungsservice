// Zentrale Unternehmensdaten – hier pflegen, die Seite liest alles von hier.

export const business = {
  name: 'AS Reinigungsservice',
  owner: 'Daniel Bongartz',
  phoneDisplay: '0155 62644577',
  phoneHref: 'tel:+4915562644577',
  // Nummer für WhatsApp-Anfragen (internationales Format ohne +)
  whatsapp: '4915562644577',
  street: 'In der Welheimer Mark 154/156',
  zip: '46238',
  city: 'Bottrop',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('AS Reinigungsservice Daniel Bongartz, In der Welheimer Mark 154, 46238 Bottrop'),
};

// Reihenfolge Montag bis Sonntag. `null` = geschlossen.
export const openingHours = [
  { day: 'Montag', hours: ['08:00', '17:30'] },
  { day: 'Dienstag', hours: ['08:00', '17:30'] },
  { day: 'Mittwoch', hours: ['08:30', '17:30'] },
  { day: 'Donnerstag', hours: ['08:30', '17:30'] },
  { day: 'Freitag', hours: ['08:30', '17:30'] },
  { day: 'Samstag', hours: ['08:00', '17:30'] },
  { day: 'Sonntag', hours: null },
];

// Google-Rezensionen. Neue Bewertungen einfach ergänzen – das Laufband
// dupliziert sie automatisch, damit kein Anfang und kein Ende sichtbar ist.
export const reviews = [
  {
    name: 'Julian Pewinski',
    rating: 5,
    text: 'Ich bin mehr als zufrieden mit der Arbeit. Die Fenster wurden äußerst gründlich und professionell gereinigt – sie sind jetzt so sauber, dass man kaum noch …',
  },
  {
    name: 'Robin Müllmann',
    rating: 5,
    text: 'Top Service! Die Fenster wurden gründlich und streifenfrei gereinigt. Pünktlich, freundlich und sehr zuverlässig. Klare Empfehlung!',
  },
  {
    name: 'F W',
    rating: 5,
    text: 'Ich bin wirklich begeistert von diesem Reinigungsservice! Von der Terminvereinbarung bis zur Ausführung hat alles perfekt funktioniert …',
  },
];
