export interface Barber {
  id: string;
  name: string;
  specialty: string | null;
  barber_code: string;
  photo_url: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  duration_mins: number;
  price: number;
  created_at: string;
}

export interface Booking {
  id: string;
  barber_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  appointment_time: string;
  comment: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  // joined fields
  services?: { name: string; price: number };
  barbers?: { name: string };
}

export interface AvailabilitySlot {
  id: string;
  barber_id: string;
  slot_time: string;
  is_booked: boolean;
  created_at: string;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5;
  selectedBarberId: string | null;
  selectedBarberName: string | null;
  selectedServiceId: string | null;
  selectedServiceName: string | null;
  selectedServicePrice: number | null;
  selectedSlotId: string | null;
  selectedSlotTime: string | null;
  customerName: string;
  customerPhone: string;
  comment: string;
  confirmedBookingId: string | null;
}
