import { FC } from 'react';
import { Card, Row } from 'react-bootstrap';
import { DateInput } from '@mantine/dates';
import { NumberInput } from '@mantine/core';

import { useBookingFormContext } from '../../contexts/BookingFormContext';

const StepDetalles: FC = () => {
  const form = useBookingFormContext();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const excludedDates = [today, tomorrow];

  return (
    <Card className="h-100">
      <Card.Body>
        <Row>
          <DateInput
            label="Seleccione una fecha"
            allowDeselect
            valueFormat="DD/MM/YYYY"
            placeholder="Seleccione la fecha del turno"
            className="col-md-8"
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
            {...form.getInputProps('turno_fecha')}
          />
          <NumberInput
            className="col-md-4 pb-2"
            hideControls
            suffix="kg"
            placeholder="Kilos estimados..."
            label="Cantidad estimada"
            {...form.getInputProps('cantidad_estimada')}
          />
        </Row>
        <div className="d-flex mt-4 pb-4 w-auto justify-content-center flex-column">
          <span className="pb-2 w-auto d-flex justify-content-center text-danger  ">{form.errors.bookingDate}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StepDetalles;
