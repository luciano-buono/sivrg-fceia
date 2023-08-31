import { useState } from 'react';
import { Group } from '@mantine/core';
import { DatePicker as BaseDatePicker } from '@mantine/dates';

const DatePicker = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <Group position="center">
      <BaseDatePicker value={value} onChange={setValue} />
    </Group>
  );
};

export default DatePicker;
