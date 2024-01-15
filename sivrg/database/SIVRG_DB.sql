GRANT ALL PRIVILEGES ON attendancesystem.* TO 'sivrg_admin'@'192.168.100.36';

CREATE USER 'sivrg_admin'@'192.168.100.36' IDENTIFIED BY 'proyectofinal';

use attendancesystem;
create table attendance(
   id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
   user_id INT UNSIGNED NOT NULL,
   clock_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY ( id )
);

create table rfid(
  rfid_uid PRIMARY
  chofer_id FOREIGN
);

create table choferes(
   chofer_id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
   rfid_uid VARCHAR(255) NOT NULL,
   nombre VARCHAR(255) NOT NULL,
   apellido VARCHAR(255) NOT NULL,
   dni INT UNSIGNED NOT NULL,
   empresa_id INT UNSIGNED NOT NULL,
   habilitado TINYINT NOT NULL,
   created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY ( chofer_id )
  --  Agregar FOREIGN key de empresa
);

CREATE TABLE `empresas` (
  `empresa_id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `empresa_nombre` VARCHAR(255) NOT NULL,
  `empresa_RS` VARCHAR(255) NOT NULL,
  `empresa_CUIT` VARCHAR(255) NOT NULL,
  `empresa_direccion` VARCHAR(255) NOT NULL,
  `empresa_localidad` VARCHAR(255) NOT NULL,
  `empresa_provincia` VARCHAR(255) NOT NULL,
  `empresa_pais` VARCHAR(255) NOT NULL,
  `empresa_telefono` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`empresa_id`)
);

CREATE TABLE `productos` (
  `producto_id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `producto_nombre` VARCHAR(255) NOT NULL,
  `unidad` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`producto_id`)
);

CREATE TABLE `pesadasIn` (
  `pesadaIn_id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `fecha_hora` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chofer_id` INT UNSIGNED NOT NULL,
  `peso_bruto` DECIMAL(9,2) NOT NULL,
  `patente` INT UNSIGNED NOT NULL,
  `empresa_id` INT UNSIGNED NOT NULL,
  `producto_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`pesadaIn_id`),
  KEY `chofer_id` (`chofer_id`),
  KEY `empresa_id` (`empresa_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `pesadasIn_ibfk_1` FOREIGN KEY (`chofer_id`) REFERENCES `choferes` (`chofer_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesadasIn_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesadasIn_ibfk_3` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `pesadasOut` (
  `pesadaOut_id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `fecha_hora` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chofer_id` INT UNSIGNED NOT NULL,
  `peso_bruto` DECIMAL(9,2) NOT NULL,
  `patente` INT UNSIGNED NOT NULL,
  `empresa_id` INT UNSIGNED NOT NULL,
  `producto_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`pesadaOut_id`),
  KEY `chofer_id` (`chofer_id`),
  KEY `empresa_id` (`empresa_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `pesadasOut_ibfk_1` FOREIGN KEY (`chofer_id`) REFERENCES `choferes` (`chofer_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesadasOut_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesadasOut_ibfk_3` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `silos` (
  `silo_id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `producto_id` INT UNSIGNED NOT NULL,
  `capacidad` INT NOT NULL,
  `utilizado` INT NOT NULL,
  `estado` TINYINT NOT NULL,
  PRIMARY KEY (`silo_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `silos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `turnos` (
  `turno_id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `turno_fecha_hora` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chofer_id` INT UNSIGNED NOT NULL,
  `patente` INT UNSIGNED NOT NULL, -- FOREIGN KEY DE vehiculos
  `empresa_id` INT UNSIGNED NOT NULL,
  `producto_id` INT UNSIGNED NOT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`turno_id`),
  KEY `chofer_id` (`chofer_id`),
  KEY `empresa_id` (`empresa_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`chofer_id`) REFERENCES `choferes` (`chofer_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `vehiculos`(
  patente PRIMARY |  en las otras tablas, referencian a esta como una FOREIGN key
  capidad max de toneladas a trasnportar
  seguro
  modelo
  año
  marca
  habilitado
)