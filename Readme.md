# SIVRG

Sistema de identificación, validación, registro y gestión en el pesaje y descarga de una planta industrial (SIVRG)

Frontend: https://sivrg.methizul.com.ar/login
Backend: https://api.sivrg.methizul.com.ar/docs
DB: https://pgadmin.k3s.methizul.com.ar/ (Usar VPN)
CD: https://deploy.methizul.com.ar/ (Usar VPN)

# Pedir turnos en webpage

## Autorizacion de camiones

Ademas de pedir la patente, si el camion es la 1era vez que se registra, entonces deberia pedir
alguna documentacion mas, como el modelo, el año, la marca, el seguro

## Build/run local frontend

On sivrg-fceia/frontend run:

```
npm install
npm run dev
```

Then to the local url on the browser (default: http://localhost:5173/)
