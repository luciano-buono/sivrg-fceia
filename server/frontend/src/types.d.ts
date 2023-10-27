export interface Turno {
  turno_id: string;
  empresa_id: number | null;
  chofer_id: string;
  vehiculo_id: string;
  producto_id: string;
  turno_fecha: string | null;
  cantidad_estimada: string;
  chofer: Chofer;
  vehiculo: Vehiculo;
  producto: Producto;
}

export interface Empresa {
  empresa_nombre: string;
  empresa_RS: string;
  empresa_CUIT: number | undefined;
  empresa_direccion: string;
  empresa_localidad: string;
  empresa_provincia: string;
  empresa_pais: string;
  empresa_telefono: string;
  empresa_id: number | null;
  empresa_email: string | undefined;
}

export interface TurnoData {
  empresa_id: number | null;
  chofer_id: string;
  vehiculo_id: string;
  producto_id: string;
  turno_fecha: string | null;
  cantidad_estimada: string;
}

export interface Producto {
  producto_id: string;
  producto_nombre: string;
}

export interface Chofer {
  chofer_id: string;
  empresa_id: number | null;
  rfid_uid: number;
  nombre: string;
  apellido: string;
  dni: number;
  habilitado: boolean;
}

export interface Vehiculo {
  vehiculo_id: string;
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

export type EmpresaData = Omit<Empresa, 'empresa_id'>;
export type ChoferData = Omit<Chofer, 'chofer_id'>;
export type VehiculoData = Omit<Vehiculo, 'vehiculo_id'>;
export type ProductoData = Omit<Prodcuto, 'producto_id'>;
