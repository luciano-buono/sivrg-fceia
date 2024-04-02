export interface Turno {
  id: string;
  empresa_id: string | null;
  chofer_id: string;
  vehiculo_id: string;
  producto_id: string;
  fecha: string | null;
  cantidad_estimada: string;
  state: string;
  chofer: Chofer;
  vehiculo: Vehiculo;
  producto: Producto;
  empresa: Empresa;
}

export interface Empresa {
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

export interface TurnoData {
  empresa_id: number | null;
  chofer_id: string;
  vehiculo_id: string;
  producto_id: string;
  fecha: string | null;
  cantidad_estimada: string;
}

export interface Producto {
  id: string;
  nombre: string;
}

export interface Chofer {
  id: string;
  empresa_id: number | null;
  rfid_uid: number;
  nombre: string;
  apellido: string;
  dni: number;
  habilitado: boolean;
}

export interface Vehiculo {
  id: string;
  empresa_id: number | null;
  patente: string;
  seguro: string;
  modelo: string;
  año: number | undefined;
  marca: string;
  habilitado: boolean;
}

export interface ModelForm {
  updateSearch: (value: string) => void;
  updateValue: (value: string) => void;
  closeFn: () => void;
}

export type EmpresaData = Omit<Empresa, 'id'>;
export type ChoferData = Omit<Chofer, 'id'>;
export type VehiculoData = Omit<Vehiculo, 'id'>;
export type ProductoData = Omit<Prodcuto, 'id'>;
