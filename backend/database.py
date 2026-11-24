from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Adatbazis fajl eleresi utvonala, akkor is ha mas helyrol fut a program
DB_PATH = Path(__file__).resolve().parent / "bike_locator.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    # Mivel tobb szalon jonnek a keresek, az egy szalas uzemmodot kikapcsoljuk
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()