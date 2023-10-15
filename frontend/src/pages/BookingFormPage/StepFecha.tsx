import { FC } from 'react';
import { Card } from 'react-bootstrap';
import { DatePicker } from '@mantine/dates';
import { useBookingFormContext } from '../../contexts/BookingFormContext';

const StepFecha: FC = () => {
  const form = useBookingFormContext();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const excludedDates = [today, tomorrow];

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="pt-2 pb-2 fw-bold"> Seleccione una fecha:</div>
        <Card className="d-flex justify-content-center flex-wrap align-content-center">
          <Card.Body>
            <DatePicker
              allowDeselect
              excludeDate={(date) =>
                excludedDates.some((excludedDate) => excludedDate.toLocaleDateString() === date.toLocaleDateString())
              }
              getDayProps={(date) => {
                if (
                  excludedDates.some((excludedDate) => excludedDate.toLocaleDateString() === date.toLocaleDateString())
                ) {
                  return {
                    style: () => ({
                      backgroundColor: 'red',
                      color: 'white',
                      pointerEvents: 'none',
                    }),
                  };
                }

                return {};
              }}
              {...form.getInputProps('bookingDate')}
            />
          </Card.Body>
        </Card>
        <div className="d-flex mt-4 w-auto justify-content-center flex-column">
          <span className="pb-2 w-auto d-flex justify-content-center text-danger  ">{form.errors.bookingDate}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StepFecha;
