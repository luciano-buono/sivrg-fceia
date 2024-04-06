export type Turno= {
  id: string;
  empresa_id: string | null;
  chofer_id: string;
  vehiculo_id: string;
  producto_id: string;
  fecha: string | null;
  cantidad_estimada: string;
  state: string;
  pesada: Pesada | null
  chofer: Chofer;
  vehiculo: Vehiculo;
  producto: Producto;
  empresa: Empresa;
}

export type Silo= {
  producto_id: number,
  capacidad: number,
  utilizado: number,
  habilitado: boolean,
  id: number,
  producto: Producto
}

export type Pesada= {
  fecha_hora_balanza_in: string | null;
  fecha_hora_balanza_out: string | null;
  peso_bruto_in: number | null;
  peso_bruto_out: number | null;
  turno_id: number | null;
  id: number | null;
  fecha_hora_planta_in: string | null;
}
export type Empresa= {
  nombre: string;
  RS: string;
  CUIT: number | undefined;
  direccion: string;
  localidad: string;
  provincia: string;
  pais: string;
  telefono: string;
  id: number | null;
  email: string | undefined;
}

export type TurnoData= {
  empresa_id: number | null;
  chofer_id: string;
  vehiculo_id: string;
  producto_id: string;
  fecha: string | null;
  cantidad_estimada: string;
}

export type Producto= {
  id: string;
  nombre: string;
}

export type Chofer= {
  id: string;
  empresa_id: number | null;
  rfid_uid: number;
  nombre: string;
  apellido: string;
  dni: number;
  habilitado: boolean;
}

export type Vehiculo= {
  id: string;
  empresa_id: number | null;
  patente: string;
  seguro: string;
  modelo: string;
  año: number | undefined;
  marca: string;
  habilitado: boolean;
}

export type ModelForm= {
  updateSearch: (value: string) => void;
  updateValue: (value: string) => void;
  closeFn: () => void;
}

export type EmpresaData = Omit<Empresa, 'id'>;
export type ChoferData = Omit<Chofer, 'id'>;
export type VehiculoData = Omit<Vehiculo, 'id'>;
export type ProductoData = Omit<Prodcuto, 'id'>;
