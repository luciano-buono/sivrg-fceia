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
}

const SearchInput: FC<SearchInputProps> = ({ data, searchValue, setSearchValue, form, searchPlaceholder, field }) => {
  return (
    <>
      <Select
        className="pb-3"
        placeholder={searchPlaceholder}
        searchable
        nothingFoundMessage="No hay resultados"
        limit={4}
        data={data}
        onChange={(value) => {
          form.setFieldValue(field, value);
        }}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <Row>
        <Col className="col-md-12 col-sm-12">
          <TextInput
            required
            readOnly
            label="Selección"
            rightSection={<CloseButton aria-label="Clear input" onClick={() => form.setFieldValue(field, '')} />}
            style={{ cursor: 'cursor' }}
            {...form.getInputProps(field)}
          />
        </Col>
      </Row>
    </>
  );
};

export default SearchInput;
