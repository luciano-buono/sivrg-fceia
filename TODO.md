Pantalla en python con turnos . Mostrar por un lado el sig camion a la balanza con su patente
por otro lado mostrar el camion acutalmente en balanza, en que silo tiene que ir


en todos los endpoints como /choferes /turnos etc debo mirar el jwt
con el email y rol

desde el back yo tengo que ver eso y filtrar solo yo en base a eso



Recibir eh header el auth0id o empresa_id

alembic

endpoint dias disponibles

orangepi usuaraio de servicio

endpoins segurixzar role o scpode


-----
2023/01/15

- chequear como cargar a posterior el RFID UID al chofer ya creado sin eso
- crear pesada y ver como se conecta con el turno


01/20
Tema pantalla y llamado de turnos
- hacer 3 pantallas, una en cada orange
- ORANGE1: la 1er pantalla de ingreso a playon, seria simple, donde diga solo Bienvenido...CLIENTE A  (siempre lo mismo)
- ORANGE2:, ingreso a balanza: Esto va a tener 2 pantallas, replicando lo mismo. Una en el playon y otra en la balanza
  - el orden de los turnos se da por dia, no por fecha. Por lo que en cada dia particular, el orden se da en base a quien entro primero a la planta. Para esto habria que hacer una tabla donde guardamos el orden de quien entro cada dia
  - Despues la la balanza de ingreso deberia preguntar por esta tabla y ir llamando en ese orden por la pantalla

  Ver si es mejor hacer una tabla nueva o una columna en la tabla TURNOS


- ORANGE3:, balanza de salida: solo mostraria un fijo " Gracias por venir"


Se llama turno o cupo?
