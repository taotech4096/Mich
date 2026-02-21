// Utility functions for delivery management

export function getNextDeliveryDays(count: number = 4): Date[] {
  const deliveryDays: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Tuesday = 2, Friday = 5
  const targetDays = [2, 5];
  let currentDate = new Date(today);
  
  while (deliveryDays.length < count) {
    currentDate.setDate(currentDate.getDate() + 1);
    if (targetDays.includes(currentDate.getDay())) {
      // Skip if it's tomorrow (need at least 1 day notice)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (currentDate > tomorrow) {
        deliveryDays.push(new Date(currentDate));
      }
    }
  }
  
  return deliveryDays;
}

export function formatDeliveryDay(date: Date): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  
  return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}`;
}

export function isValidDeliveryZone(city: string): boolean {
  const validCities = ["puebla", "cholula", "san andrés cholula", "san pedro cholula"];
  return validCities.includes(city?.toLowerCase()?.trim() ?? "");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `ORD-${year}${month}${day}-${random}`;
}

export function getNextSubscriptionDelivery(frequency: string, preferredDay: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayMap: Record<string, number> = {
    "martes": 2,
    "viernes": 5,
  };
  
  const targetDay = dayMap[preferredDay.toLowerCase()] ?? 2;
  let nextDate = new Date(today);
  
  // Find next occurrence of preferred day
  while (nextDate.getDay() !== targetDay) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  // If it's less than 2 days away, skip to next week
  const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 2) {
    nextDate.setDate(nextDate.getDate() + 7);
  }
  
  return nextDate;
}
