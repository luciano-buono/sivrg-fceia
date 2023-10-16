export interface Reservation {
  firstname: string;
  lastname: string;
  documentNumber: string;
  birthdate: string;
  email: string;
  bookingDate: string;
  plate: string;
  truckType: string;
  trailersQuantity: number;
  grainType: string;
  totalWeight: number;
}

export interface Producto {
  producto_nombre: string;
}

interface Chofer {
  rfid_uid: number;
  nombre: string;
  apellido: string;
  dni: number;
  empresa_id: number;
  habilitado: boolean;
  chofer_id: number;
}

interface Vehiculo {
  patente: string;
  seguro: string;
  modelo: string;
  año: number | undefined;
  marca: string;
  habilitado: boolean;
  empresa_id: string;
}

type ChoferData = Omit<Chofer, 'chofer_id'>;
