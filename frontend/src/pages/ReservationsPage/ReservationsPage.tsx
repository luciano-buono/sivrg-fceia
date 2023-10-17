import React from 'react';
import { Turno } from '../../types';
import { Card, Container } from 'react-bootstrap';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import useSession from '../../hooks/useSession';
import { Skeleton } from '@mantine/core';

const RESERVATIONS_MOCK: Turno[] = [];

// const columnHelper = createColumnHelper<Turno>();

const columns = [] as any;

const ReservationsPage = () => {
  const [data] = useState(() => [...RESERVATIONS_MOCK]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { isLoading } = useSession();

  return (
    <Container className="d-flex flex-column flex-wrap align-content-center pt-2">
      <div className="h1"> Mis turnos </div>
      <Skeleton visible={isLoading}>
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
      </Skeleton>
    </Container>
  );
};

export default ReservationsPage;
