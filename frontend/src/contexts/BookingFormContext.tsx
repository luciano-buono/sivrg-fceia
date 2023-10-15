import { createFormContext } from '@mantine/form';

interface BookingFormValues {
  chofer: number | string | null;
  bookingDate: Date | null;
  plate: string;
  truckType: string;
  trailersQuantity: number;
  grainType: string;
  totalWeight: number;
}

// You can give context variables any name
export const [BookingFormProvider, useBookingFormContext, useBookingForm] = createFormContext<BookingFormValues>();
