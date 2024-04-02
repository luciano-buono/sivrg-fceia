import { Turno } from '../../types';
import { Card } from 'react-bootstrap';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useSession from '../../hooks/useSession';
import { Button, Skeleton, em } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import useTurno from '../../hooks/useTurno';
import { FC, useEffect } from 'react';
import { useLocation } from 'react-router';

const columnHelper = createColumnHelper<Turno>();

type ReservationsAdminPageProps = {
  filterByDay: boolean;
};

const ReservationsAdminPage: FC<ReservationsAdminPageProps> = ({ filterByDay }) => {
  const { isLoading, isEmployee } = useSession();
  const { acceptTurno, deleteTurno } = useTurno();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () =>
      api
        .get(
          filterByDay ? `/turnos/?start_date=${yesterday.toISOString()}&end_date=${today.toISOString()}${isEmployee ? '' : '&state=accepted'}` : '/turnos/',
        )
        .then((res) => res.data),
  });
  const location = useLocation();

  // Sorry
  useEffect(() => {
    queryTurno.refetch();
  }, [location, queryTurno]);

  const { data: turnos, isLoading: isLoadingTurnos } = queryTurno;

  const handleDeleteRow = async (id: string) => {
    await deleteTurno.mutateAsync(id);

    notifications.show({
      title: 'Turno eliminado!',
      color: 'green',
      message: `Se ha eliminado el turno`,
    });
  };

  const handleSubmitRow = async (info: any) => {
    await acceptTurno.mutateAsync(info.row.original.id);
    // acceptTurno(info.row.original.id)
    notifications.show({
      title: 'Turno editado!',
      color: 'green',
      message: `Se ha aceptado el turno`,
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
    columnHelper.accessor('producto.nombre', {
      cell: (info) => info.renderValue(),
      header: () => <span>Producto</span>,
    }),
    columnHelper.accessor('cantidad_estimada', {
      id: 'cantidad_estimada',
      cell: (info) => <span>{info.renderValue()} kg</span>,
      header: () => <span>Cantidad estimada</span>,
    }),
    columnHelper.accessor('state', {
      id: 'state',
      header: () => 'Estado',
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('fecha', {
      id: 'fecha',
      header: () => 'Fecha',
      cell: (info) => info.renderValue()?.slice(0, 10),
    }),
    columnHelper.accessor('empresa.nombre', {
      id: 'empresa',
      header: () => 'Empresa',
      cell: (info) => <div className="text-center">{info.renderValue()}</div>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Acciones',
      cell: (info) => (
        <div className="d-flex justify-content-around">
          {info.cell.row.original.state !== 'accepted' && isEmployee ? (
            <Button size="compact-sm" color="green" onClick={() => handleSubmitRow(info)}>
              <i className="fa-solid fa-check"></i>
            </Button>
          ) : null}
          <Button size="compact-sm" color="red" onClick={() => handleDeleteRow(info.cell.row.original.id)}>
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
    columnHelper.accessor('fecha', {
      id: 'turno_fecha',
      header: () => 'Fecha',
      cell: (info) => info.renderValue()?.slice(0, 10),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Acciones',
      cell: (info) => (
        <div className="d-flex justify-content-around">
          {info.cell.row.original.state !== 'accepted' && isEmployee ? (
            <Button size="compact-sm" color="green" onClick={handleSubmitRow}>
              <i className="fa-solid fa-check"></i>
            </Button>
          ) : null}
          <Button size="compact-sm" color="red" onClick={() => handleDeleteRow(info.cell.row.original.id)}>
            <i className="fa-solid fa-xmark"></i>
          </Button>
        </div>
      ),
    }),
  ];

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const table = useReactTable({
    data: turnos ? turnos : [],
    columns: isMobile ? columnsMobile : columnsDesktop,
    getCoreRowModel: getCoreRowModel(),
    initialState: { columnVisibility: { empresa: isEmployee } },
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
