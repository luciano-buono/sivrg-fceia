import { createFormContext } from '@mantine/form';

interface BookingFormValues {
  chofer_id: number | string | null;
  empresa_id: number | string | null;
  producto_id: number | string | null;
  bookingDate: Date | null;
  cantidad_estimada: number;
}

// You can give context variables any name
export const [BookingFormProvider, useBookingFormContext, useBookingForm] = createFormContext<BookingFormValues>();
