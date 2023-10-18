import { Select, TextInput, Text } from '@mantine/core';
import { FC } from 'react';
import { CloseButton, Col, Row } from 'react-bootstrap';

interface SearchInputProps {
  field: string;
  data: any;
  searchValue: any;
  setSearchValue: any;
  form: any;
  searchPlaceholder: string;
  searchLabel: string;
  valueLabel: string;
}

const SearchInput: FC<SearchInputProps> = ({
  data,
  searchValue,
  setSearchValue,
  form,
  searchPlaceholder,
  searchLabel,
  field,
  valueLabel,
}) => {
  return (
    <>
      <Row>
        <Select
          label={searchLabel}
          rightSection={<i className="fa-solid fa-search" />}
          className="pb-3 col-md-6"
          placeholder={searchPlaceholder}
          withAsterisk
          error={form.errors[field]}
          clearable
          searchable
          nothingFoundMessage="No hay resultados"
          limit={4}
          data={data}
          onChange={(value) => {
            form.setFieldValue(field, value ?? '');
          }}
          searchValue={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
          }}
        />
        <TextInput
          label={valueLabel}
          readOnly
          required
          className="col-md-6"
          onChange={() => {}}
          rightSection={
            form.getInputProps(field).value ? (
              <CloseButton
                aria-label="Clear input"
                onClick={() => {
                  form.setFieldValue(field, '');
                  setSearchValue('');
                }}
              />
            ) : null
          }
          value={data?.filter((x: any) => x.value === form.values[field]).map((x: any) => x.label)[0] || ''}
        />
        <Col>
          <TextInput type="hidden" withAsterisk={false} readOnly {...form.getInputProps(field)} error={false} />
        </Col>
      </Row>
    </>
  );
};

export default SearchInput;
