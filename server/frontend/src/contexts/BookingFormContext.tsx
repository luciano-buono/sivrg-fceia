import { createFormContext } from '@mantine/form';
import { TurnoData } from '../types';

// You can give context variables any name
export const [BookingFormProvider, useBookingFormContext, useBookingForm] = createFormContext<TurnoData>();
