export interface Turno {
  turno_id: string;
  empresa_id: string;
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
  empresa_id: number;
  rfid_uid: number;
  nombre: string;
  apellido: string;
  dni: number;
  habilitado: boolean;
}

export interface Vehiculo {
  vehiculo_id: string;
  empresa_id: string;
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

export type ChoferData = Omit<Chofer, 'chofer_id'>;
export type VehiculoData = Omit<Vehiculo, 'vehiculo_id'>;
export type ProductoData = Omit<Prodcuto, 'producto_id'>;
export type TurnoData = Omit<Turno, 'turno_id'>;
