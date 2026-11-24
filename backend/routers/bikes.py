from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Bike, Shop
from schemas import BikeIn, BikeOut

router = APIRouter(prefix="/api/bikes", tags=["Hirdetések"], dependencies=[Depends(get_current_user)])


def find_bike(db: Session, bike_id: int) -> Bike:
    bike = db.get(Bike, bike_id)
    if bike is None:
        raise HTTPException(status_code=404, detail="Nincs ilyen hirdetés")
    return bike


def check_shop_exists(db: Session, shop_id: int):
    # Az SQLite nem ellenorzi az idegen kulcsot, ezert itt nezzuk meg
    if db.get(Shop, shop_id) is None:
        raise HTTPException(status_code=400, detail="A megadott bolt nem létezik")


@router.get("", response_model=list[BikeOut])
def list_bikes(db: Session = Depends(get_db)):
    return db.scalars(select(Bike).order_by(Bike.id)).all()


@router.get("/{bike_id}", response_model=BikeOut)
def get_bike(bike_id: int, db: Session = Depends(get_db)):
    return find_bike(db, bike_id)


@router.post("", response_model=BikeOut, status_code=201)
def create_bike(data: BikeIn, db: Session = Depends(get_db)):
    check_shop_exists(db, data.shop_id)
    bike = Bike(
        title=data.title,
        brand=data.brand,
        price=data.price,
        year=data.year,
        condition=data.condition,
        shop_id=data.shop_id,
    )
    db.add(bike)
    db.commit()
    db.refresh(bike)
    return bike


@router.put("/{bike_id}", response_model=BikeOut)
def update_bike(bike_id: int, data: BikeIn, db: Session = Depends(get_db)):
    bike = find_bike(db, bike_id)
    check_shop_exists(db, data.shop_id)
    bike.title = data.title
    bike.brand = data.brand
    bike.price = data.price
    bike.year = data.year
    bike.condition = data.condition
    bike.shop_id = data.shop_id
    db.commit()
    db.refresh(bike)
    return bike


@router.delete("/{bike_id}", status_code=204)
def delete_bike(bike_id: int, db: Session = Depends(get_db)):
    bike = find_bike(db, bike_id)
    db.delete(bike)
    db.commit()
