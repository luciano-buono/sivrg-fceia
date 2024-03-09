## Glosario de estados del turno:
    "pending",
    "canceled",
    "accepted",
    "in_progress_entrada",
    "in_progress_balanza_in",
    "in_progress_balanza_out",
    "finished",

## Proceso de entrada a planta:

### Virtual
1. Cliente se registra por Auth0
2. Cliente se logea en sivrg.methizul.com.ar y se registra, creando una entrada de empresas
3. Cliente crea un vehiculo con patente definida
4. Cliente crea un chofer (por simplicidad ya posee RFID_UID ya sabido de antemano)
5. Cliente crea un turno, definiendo su vehiculo, su chofer, su dia y su producto
### Entrada a planta
1. Camion entra y presenta RFID y patente
2. GET Request a http://localhost:5000/public/turnos/validate
3. Si validate es ok, PUT request a http://localhost:5000/turnos/{id} (obtenido de paso anterior), donde se modifica el state a in_progress_entrada
4. Esto provoca la creacion automatica de una pesada a http://localhost:5000/pesadas, donde no tiene pesos, solo el turno id.
### Entrada a balanza ingreso
1. GET Request a http://localhost:5000/public/turnos/validate
2. Si validate es ok, PUT request a http://localhost:5000/turnos/{id} (obtenido de paso anterior), donde se modifica el state a in_progress_balanza_in
3. GET request a http://localhost:5000/turnos/{turno_id}/pesada pasando turno_ID, donde se obtiene la pesada_ID
4. Inicia proceso de pesado con PLC
5. Se edita la pesada con un PUT request a http://localhost:5000/pesadas, donde se agrega fecha_hora_balanza_in, peso_bruto_in
### Entrada a balanza egreso
1. GET Request a http://localhost:5000/public/turnos/validate
2. Si validate es ok, PUT request a http://localhost:5000/turnos/{id} (obtenido de paso anterior), donde se modifica el state a in_progress_balanza_out
3. GET request a http://localhost:5000/turnos/{turno_id}/pesada pasando turno ID, donde se obtiene la pesada ID
4. Inicia proceso de pesado con PLC
5. Se edita la pesada con un PUT request a http://localhost:5000/pesadas, donde se agrega fecha_hora_balanza_out, peso_bruto_out
6. Se edita el turno y su estado se pasa a finished


### Pantalla controlada solo por la orange de entrada a planta
1. Desp del /validate, se crea un array local donde se van agregando cada turno que va llegando a la planta.
2. Para actualizar la pantalla, se lleva el control del elemento N que se llamo y cuando el PLC envie finalizacion de pesada en balanza de ingreso, entonces se llama al N+1 turno por pantalla
