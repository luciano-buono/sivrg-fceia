from main import get_db
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
import crud, models
import datetime


def read_turnos_expired(
    start_date: str,
    end_date: str,
    db: Session = next(get_db()),
):
    q = db.query(models.Turno)
    q = q.filter(
        and_(models.Turno.state != "finished", models.Turno.state != "canceled")
    )
    q = q.filter(models.Turno.fecha.between(start_date, end_date))
    return q.all()


def update_turnos_expired(
    id: int,
    db: Session = next(get_db()),
):
    return crud.update_turno(db=db, id=id, state="canceled")


def main():
    start_date = (datetime.datetime.today() - datetime.timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    end_date = datetime.datetime.today().replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    print(f"Date range: {start_date} up to  {end_date}")
    expired_turnos = read_turnos_expired(start_date=start_date, end_date=end_date)
    for turno in expired_turnos:
        print("Turnos to be canceled:")
        print(f"TURNO ID: {turno.id} | TURNO state: {turno.state}")
        update_turnos_expired(id=turno.id)
        print("DONE")


if __name__ == "__main__":
    main()
