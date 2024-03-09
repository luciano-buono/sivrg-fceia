FROM node:18 as build

WORKDIR /app
COPY ./frontend /app/

RUN npm install
RUN npm install axios
RUN npm run build

FROM ubuntu:jammy-20231004
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html-methizul.com.ar/
#Add certificates
COPY ./nginx/sivrg.crt /etc/nginx/certs/sivrg.crt
COPY ./nginx/sivrg.key /etc/nginx/certs/sivrg.key
COPY ./nginx/api-sivrg.crt /etc/nginx/certs/api-sivrg.crt
COPY ./nginx/api-sivrg.key /etc/nginx/certs/api-sivrg.key


EXPOSE 80 443

COPY ./nginx/sivrg.methizul.com.ar.conf /etc/nginx/sites-available/sivrg.methizul.com.ar.conf
RUN ln -s /etc/nginx/sites-available/sivrg.methizul.com.ar.conf /etc/nginx/sites-enabled/sivrg.methizul.com.ar.conf

COPY ./nginx/api-sivrg.methizul.com.ar.conf /etc/nginx/sites-available/api-sivrg.methizul.com.ar.conf
RUN ln -s /etc/nginx/sites-available/api-sivrg.methizul.com.ar.conf /etc/nginx/sites-enabled/api-sivrg.methizul.com.ar.conf

CMD ["nginx","-g","daemon off;"]
