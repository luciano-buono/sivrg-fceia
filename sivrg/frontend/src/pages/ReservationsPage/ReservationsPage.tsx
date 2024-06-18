import { Turno } from '../../types';
import { Card } from 'react-bootstrap';
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import useSession from '../../hooks/useSession';
import { Button, Skeleton, em } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import useTurno from '../../hooks/useTurno';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { IconCaretDown, IconCaretUp, IconCaretUpDown } from '@tabler/icons-react';

const columnHelper = createColumnHelper<Turno>();

const stateLabels: { [key: string]: string } = {
  accepted: 'Aceptado',
  finished: 'Finalizado',
  canceled: 'Cancelado',
  pending: 'Pendiente',
  in_progress_balanza_in: 'En progreso IN',
  in_progress_balanza_out: 'En progreso OUT',
};

type ReservationsAdminPageProps = {
  filterByDay: boolean;
};

const ReservationsAdminPage: FC<ReservationsAdminPageProps> = ({ filterByDay }) => {
  const { isLoading, isEmployee } = useSession();
  const { acceptTurno, deleteTurno } = useTurno();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [sorting, setSorting] = useState<SortingState>([]);

  let url = '/turnos/';

  const queryParams = {
    date: filterByDay ? `start_date=${yesterday.toISOString()}&end_date=${today.toISOString()}` : null,
    sort: sorting.length > 0 ? `?&sort=${sorting[0].desc ? '-' : ''}${sorting[0].id}` : null,
  };

  const hasQueryParams = queryParams.date || queryParams.sort;

  url = hasQueryParams ? `${url}?${queryParams.date}&${queryParams.sort}` : url;

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () => api.get(url).then((res) => res.data),
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

  const columnsDesktop: ColumnDef<Turno, any>[] = [
    columnHelper.accessor('chofer.nombre', {
      cell: (info) => (
        <span>{`${info.row.original.chofer.nombre} ${info.row.original.chofer.apellido}, DNI: ${info.row.original.chofer.dni}, Patente: ${info.row.original.vehiculo.patente}`}</span>
      ),
      header: () => <span>Chofer</span>,
      enableSorting: false,
      minSize: 500,
    }),
    columnHelper.accessor('producto.nombre', {
      cell: (info) => <div className="d-flex justify-content-center">{info.renderValue()}</div>,
      header: () => <span>Producto</span>,
      enableSorting: false,
    }),
    columnHelper.accessor('cantidad_estimada', {
      id: 'cantidad_estimada',
      cell: (info) => <span>{info.renderValue()} kg</span>,
      header: () => 'Cantidad',
      enableSorting: false,
    }),
    columnHelper.accessor('state', {
      id: 'state',
      header: () => 'Estado',
      cell: (info) => (
        <div className="d-flex justify-content-center align-items-center">
          {stateLabels[info.renderValue()] ?? info.renderValue()}{' '}
        </div>
      ),
    }),
    columnHelper.accessor('pesada', {
      id: 'pesada',
      enableSorting: false,
      header: () => 'Pesada',
      cell: (info) => {
        const peso_bruto_in = info.row.original.pesada?.peso_bruto_in;
        const peso_bruto_out = info.row.original.pesada?.peso_bruto_out;
        if (!peso_bruto_in || !peso_bruto_out) {
          return <span className="d-flex justify-content-center">-</span>;
        }
        const pesada = peso_bruto_in - peso_bruto_out;
        return <span className="d-flex justify-content-center">{`${pesada}kg`}</span>;
      },
    }),
    columnHelper.accessor('fecha', {
      id: 'fecha',
      header: () => 'Fecha',
      cell: (info) => <div className="d-flex justify-content-center">{info.renderValue()?.slice(0, 10)}</div>,
      minSize: 150,
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
          {info.cell.row.original.state === 'pending' && isEmployee ? (
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
          {info.cell.row.original.state === 'pending' && isEmployee ? (
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
    state: { sorting },
    onSortingChange: setSorting,
  });
  return (
    <>
      <Card className="d-flex w-100 my-3">
        <Card.Header>
          <div className="fs-1"> Turnos </div>
        </Card.Header>
        <Card.Body>
          <Skeleton visible={isLoading || isLoadingTurnos}>
            <table className="table table-bordered">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                                : undefined
                            }
                          >
                            <div className="d-flex justify-content-center">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && !header.column.getIsSorted() ? (
                                <IconCaretUpDown />
                              ) : (
                                {
                                  asc: <IconCaretUp />,
                                  desc: <IconCaretDown />,
                                }[header.column.getIsSorted() as string] ?? null
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        style={{
                          width: cell.column.getSize(),
                          alignContent: 'center',
                        }}
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
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
