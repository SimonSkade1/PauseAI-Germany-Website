export interface LocalGroup {
  id: string;
  city: string;
  lat: number;
  lng: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  links: {
    whatsapp?: string;
    signal?: string;
    telegram?: string;
  };
  lumaUrl: string;
  meetingSchedule: string;
  description: string;
}
