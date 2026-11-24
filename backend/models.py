from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str]


class Shop(Base):
    __tablename__ = "shops"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    city: Mapped[str | None]
    website: Mapped[str | None]
    founded_year: Mapped[int | None]

    bikes: Mapped[list["Bike"]] = relationship(back_populates="shop")


class Bike(Base):
    __tablename__ = "bikes"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    brand: Mapped[str | None]
    price: Mapped[int | None]
    year: Mapped[int | None]
    condition: Mapped[str]

    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id"))
    shop: Mapped["Shop"] = relationship(back_populates="bikes")

    # Nem oszlop, a bolt nevet adja vissza a valaszhoz
    @property
    def shop_name(self) -> str:
        return self.shop.name