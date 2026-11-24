from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# In amit a kliens kuld, Out amit visszakuldunk id val

class ShopIn(BaseModel):
    # Levagja a szokozoket
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1)
    city: str | None = None
    # Csak http:// vagy https:// kezdetu cim lehet
    website: str | None = Field(default=None, pattern=r"^https?://")
    founded_year: int | None = Field(default=None, ge=1800, le=2100)


class ShopOut(ShopIn):
    # Adatbazis objektumbol is tud valaszt kesziteni
    model_config = ConfigDict(from_attributes=True)

    id: int


class BikeIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1)
    brand: str | None = None
    # Felso hatar, kulonben az adatbazis hibat adna
    price: int | None = Field(default=None, ge=0, le=1_000_000_000)
    year: int | None = Field(default=None, ge=1900, le=2100)
    condition: Literal["new", "used"]
    shop_id: int


class BikeOut(BikeIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    shop_name: str
