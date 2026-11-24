from fastapi import FastAPI

import auth
import models # Lefuttatja a modelleket, tablak letrehozasa a Base-be
from database import Base, SessionLocal, engine
from routers import bikes, shops
from seed import seed

Base.metadata.create_all(bind=engine)

# Ha inditaskor ures az adatbazis, feltolti
with SessionLocal() as db:
    seed(db)

app = FastAPI(title="Bike Locator")
app.include_router(auth.router)
app.include_router(shops.router)
app.include_router(bikes.router)

@app.get("/api/health")
def health():
    return{"status": "ok"}
