from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Shop
from schemas import ShopIn, ShopOut

# Minden vegpont csak bejelentkezve erheto el
router = APIRouter(prefix="/api/shops", tags=["Boltok"], dependencies=[Depends(get_current_user)])


def find_shop(db: Session, shop_id: int) -> Shop:
    shop = db.get(Shop, shop_id)
    if shop is None:
        raise HTTPException(status_code=404, detail="Nincs ilyen bolt")
    return shop


@router.get("", response_model=list[ShopOut])
def list_shops(db: Session = Depends(get_db)):
    return db.scalars(select(Shop).order_by(Shop.id)).all()


@router.get("/{shop_id}", response_model=ShopOut)
def get_shop(shop_id: int, db: Session = Depends(get_db)):
    return find_shop(db, shop_id)


@router.post("", response_model=ShopOut, status_code=201)
def create_shop(data: ShopIn, db: Session = Depends(get_db)):
    shop = Shop(
        name=data.name,
        city=data.city,
        website=data.website,
        founded_year=data.founded_year,
    )
    db.add(shop)
    db.commit()
    db.refresh(shop)  # Visszaolvassa az uj id-t
    return shop


@router.put("/{shop_id}", response_model=ShopOut)
def update_shop(shop_id: int, data: ShopIn, db: Session = Depends(get_db)):
    shop = find_shop(db, shop_id)
    shop.name = data.name
    shop.city = data.city
    shop.website = data.website
    shop.founded_year = data.founded_year
    db.commit()
    db.refresh(shop)
    return shop


@router.delete("/{shop_id}", status_code=204)
def delete_shop(shop_id: int, db: Session = Depends(get_db)):
    shop = find_shop(db, shop_id)
    # Hirdeteses boltot nem torlunk
    if shop.bikes:
        raise HTTPException(
            status_code=400,
            detail=f"A bolt nem törölhető, mert {len(shop.bikes)} hirdetése van. Előbb azokat töröld.",
        )
    db.delete(shop)
    db.commit()
