import { Turno } from '../../types';
import { Card } from 'react-bootstrap';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useSession from '../../hooks/useSession';
import { Button, Skeleton, em } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

const columnHelper = createColumnHelper<Turno>();

const ReservationsAdminPage = () => {
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

  const columnsDesktop: ColumnDef<Turno, string>[] = [
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
          <Button size="compact-sm" color="green" onClick={handleEditRow}>
            <i className="fa-solid fa-check"></i>
          </Button>
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

  const columnsMobile = [
    columnHelper.accessor('chofer.dni', {
      cell: (info) => <span>{`${info.row.original.chofer.dni}`}</span>,
      header: () => <span>Chofer</span>,
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
          <Button size="compact-sm" color="green" onClick={handleEditRow}>
            <i className="fa-solid fa-check"></i>
          </Button>
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

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () => api.get('/turnos/').then((res) => res.data),
  });

  const { data: turnos, isLoading: isLoadingTurnos } = queryTurno;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const table = useReactTable({
    data: turnos ? turnos : [],
    columns: isMobile ? columnsMobile : columnsDesktop,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <Card className="d-flex w-100 my-3">
        <Card.Body>
          <div className="fs-1"> Turnos </div>
          <Skeleton visible={isLoading || isLoadingTurnos}>
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
          </Skeleton>
        </Card.Body>
      </Card>
    </>
  );
};

export default ReservationsAdminPage;
