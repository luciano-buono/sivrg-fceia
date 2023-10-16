FROM python:3.11
WORKDIR /code
COPY ./requirements/development.txt /code
RUN pip install -r development.txt
COPY ./sql_app /code
CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]