import { CloseButton, Select, TextInput } from '@mantine/core';
import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

interface SearchInputProps {
  field: string;
  data: any;
  searchValue: any;
  setSearchValue: any;
  form: any;
  searchPlaceholder: string;
  valuePlaceholder: string;
  searchLabel: string;
  valueLabel: string;
}

const SearchInput: FC<SearchInputProps> = ({
  data,
  searchValue,
  setSearchValue,
  form,
  searchPlaceholder,
  valueLabel,
  valuePlaceholder,
  searchLabel,
  field,
}) => {
  return (
    <>
      <Row className="justify-content-center">
        <Select
          label={searchLabel}
          rightSection={<i className="fa-solid fa-search" />}
          className="pb-3 col-md-8"
          placeholder={searchPlaceholder}
          searchable
          nothingFoundMessage="No hay resultados"
          limit={4}
          data={data}
          onChange={(value) => {
            form.setFieldValue(field, value);
          }}
          searchValue={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
            if (value === '') {
              form.setFieldValue(field, '');
            }
          }}
        />
        <Col className="col-md-4 col-sm-4">
          <TextInput
            required
            readOnly
            placeholder={valuePlaceholder}
            label={valueLabel}
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
            style={{ cursor: 'cursor', boxShadow: 'none' }}
            {...form.getInputProps(field)}
          />
        </Col>
      </Row>
    </>
  );
};

export default SearchInput;
