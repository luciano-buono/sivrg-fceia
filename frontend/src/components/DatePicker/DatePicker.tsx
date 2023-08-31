import { useState } from 'react';
import { Group } from '@mantine/core';
import { DatePicker as BaseDatePicker } from '@mantine/dates';
import { Card } from 'react-bootstrap';

const DatePicker = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center">
      <Card.Body>
        <Group position="center">
          <BaseDatePicker value={value} onChange={setValue} />
        </Group>
      </Card.Body>
    </Card>
  );
};

export default DatePicker;
