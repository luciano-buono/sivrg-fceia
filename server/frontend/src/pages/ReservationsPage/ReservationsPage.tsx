import { Turno } from '../../types';
import { Card, Container } from 'react-bootstrap';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useSession from '../../hooks/useSession';
import { Button, Skeleton } from '@mantine/core';
import api from '../../api';
import { useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

const columnHelper = createColumnHelper<Turno>();

const ReservationsPage = () => {
  const { isLoading } = useSession();

  const handleEditRow = () => {
    notifications.show({
      title: 'Turno editado!',
      color: 'green',
      message: `Se ha creado el turno`,
    });
  };

  const handleDeleteRow = () => {
    notifications.show({
      title: 'Turno eliminado!',
      color: 'green',
      message: `Se ha eliminado el turno`,
    });
  };

  const columns: ColumnDef<Turno, string>[] = [
    columnHelper.accessor('chofer.nombre', {
      cell: (info) => (
        <span>{`${info.row.original.chofer.nombre} ${info.row.original.chofer.apellido}, ${info.row.original.chofer.dni}`}</span>
      ),
      header: () => <span>Chofer</span>,
    }),
    columnHelper.accessor('vehiculo.patente', {
      cell: (info) => info.renderValue(),
      header: () => <span>Patente</span>,
    }),
    columnHelper.accessor('producto.producto_nombre', {
      cell: (info) => info.renderValue(),
      header: () => <span>Producto</span>,
    }),
    columnHelper.accessor('cantidad_estimada', {
      id: 'cantidad_estimada',
      cell: (info) => <span>{info.renderValue()} kg</span>,
      header: () => <span>Cantidad estimada</span>,
    }),
    columnHelper.accessor('turno_fecha', {
      id: 'turno_fecha',
      header: () => 'Fecha',
      cell: (info) => info.renderValue()?.slice(0, 10),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Acciones',
      cell: () => (
        <div className="d-flex justify-content-around">
          <Button size="compact-sm" color="yellow" onClick={handleEditRow}>
            <i className="fa-solid fa-pencil"></i>
          </Button>
          <Button size="compact-sm" color="red" onClick={handleDeleteRow}>
            <i className="fa-solid fa-xmark"></i>
          </Button>
        </div>
      ),
    }),
  ];

  const { data: turnos, isLoading: isLoadingTurnos } = useQuery({
    queryKey: ['turnos'],
    queryFn: () => api.get<Turno[]>('/turnos/').then((res) => res.data),
  });

  const table = useReactTable({
    data: turnos ? turnos : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Container className="d-flex flex-column flex-wrap align-content-center pt-2 col-md-9">
      <Skeleton visible={isLoading || isLoadingTurnos}>
        <Card className="d-flex w-100">
          <Card.Body>
            <div className="h1"> Mis turnos </div>
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
