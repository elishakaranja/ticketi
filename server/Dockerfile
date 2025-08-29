FROM python:3.8-slim

WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN pip install pipenv && pipenv install --system --deploy --ignore-pipfile

COPY . /app/

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
