import { Reservation } from '../../types';
import { Card, Container } from 'react-bootstrap';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

const now = new Date(Date.now());

const RESERVATIONS_MOCK: Reservation[] = [
  {
    firstname: 'Julio',
    lastname: 'Guella',
    documentNumber: '1234567',
    birthdate: now.toLocaleString('es-AR'),
    email: 'test@hola.com',
    bookingDate: now.toLocaleString('es-AR'),
    plate: '1234',
    truckType: 'grande',
    trailersQuantity: 123,
    grainType: 'Trigo',
    totalWeight: 123,
  },
  {
    firstname: 'Lucho',
    lastname: 'Buono',
    documentNumber: '1234567',
    birthdate: now.toLocaleString('es-AR'),
    email: 'test@hola.com',
    bookingDate: now.toLocaleString('es-AR'),
    plate: '1234',
    truckType: 'grande',
    trailersQuantity: 123,
    grainType: 'Trigo',
    totalWeight: 123,
  },
];

const columnHelper = createColumnHelper<Reservation>();

const columns = [
  columnHelper.accessor('firstname', {
    id: 'name',
    cell: (info) => (
      <span className="number">
        {info.row.original.firstname} {info.row.original.lastname}
      </span>
    ),
    header: () => <span>Nombre</span>,
  }),
  columnHelper.accessor((row) => row.documentNumber, {
    id: 'documentNumber',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Documento</span>,
  }),
  columnHelper.accessor('bookingDate', {
    id: 'bookingDate',
    header: () => 'Fecha',
    cell: (info) => info.renderValue(),
  }),
];

const ReservationsPage = () => {
  const [data] = useState(() => [...RESERVATIONS_MOCK]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container className="d-flex flex-column flex-wrap align-content-center pt-2">
      <div className="h1"> Mis turnos </div>
      <Card className="d-flex w-100">
        <Card.Body>
          <table className="table table-bordered">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReservationsPage;
