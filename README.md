# Bike Locator

Egyszerű kerékpárhirdetés-kezelő webalkalmazás: **boltok** és a hozzájuk tartozó
**hirdetések** kezelése (létrehozás, listázás, szerkesztés, törlés), JWT-alapú
belépéssel.

## Technológiák

- **Backend:** Python, FastAPI, SQLAlchemy 2, SQLite, Pydantic, PyJWT, bcrypt
- **Frontend:** React, TypeScript, Vite, natív `fetch`, sima CSS

## Előfeltételek

- **Python 3.11 vagy újabb** (3.11-en kipróbálva)
- **Node.js 20.19+ vagy 22.12+** (a Vite 8 miatt) és npm
- Git

## Telepítés és indítás

### Windows

```bat
setup.bat
start.bat
```

A `setup.bat` csak az első alkalommal kell. A `start.bat` két ablakban indítja a
backendet és a frontendet, és megnyitja a böngészőt. Leállítás: a két ablak bezárása.

### macOS / Linux

```bash
./setup.sh
./start.sh
```

Leállítás: `Ctrl+C`.

### Kézzel (bármilyen rendszeren)

```bash
# 1. terminál - backend
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload

# 2. terminál - frontend
cd frontend
npm install
npm run dev
```

### Címek

| Mi | Cím |
| --- | --- |
| Alkalmazás | http://localhost:5173 |
| API dokumentáció (Swagger) | http://127.0.0.1:8000/docs |

## Adatmodell

```
shops (Bolt)                       bikes (Hirdetés)
------------------                 --------------------------
id            PK  <----------+     id            PK
name          kötelező       |     title         kötelező
city                         |     brand
website                      |     price         (Ft)
founded_year                 |     year
                             |     condition     "new" | "used"
                             +---- shop_id       FK, kötelező

users: id, username (egyedi), password_hash (bcrypt) - csak a belépéshez
```

- Egy bolthoz **több** hirdetés tartozhat, egy hirdetés **pontosan egy** bolthoz tartozik.
- Olyan bolt **nem törölhető**, amelyhez hirdetés tartozik: a backend `400`-as
  hibát ad érthető üzenettel.
- Nem létező boltra hivatkozó hirdetés nem menthető (`400`).

## API-végpontok

A belépésen kívül minden adatvégponthoz `Authorization: Bearer <token>` fejléc kell,
enélkül a válasz `401`.

| Metódus | Végpont | Leírás | Siker |
| --- | --- | --- | --- |
| POST | `/api/login` | Belépés, JWT tokent ad vissza | 200 |
| GET | `/api/shops` | Boltok listája | 200 |
| GET | `/api/shops/{id}` | Egy bolt | 200 |
| POST | `/api/shops` | Új bolt | 201 |
| PUT | `/api/shops/{id}` | Bolt módosítása | 200 |
| DELETE | `/api/shops/{id}` | Bolt törlése | 204 |
| GET | `/api/bikes` | Hirdetések listája (a bolt nevével) | 200 |
| GET | `/api/bikes/{id}` | Egy hirdetés | 200 |
| POST | `/api/bikes` | Új hirdetés | 201 |
| PUT | `/api/bikes/{id}` | Hirdetés módosítása | 200 |
| DELETE | `/api/bikes/{id}` | Hirdetés törlése | 204 |

Hibakódok: `400` üzleti szabály sérül (pl. bolt törlése hirdetésekkel),
`401` hiányzó vagy érvénytelen token, `404` nincs ilyen rekord,
`422` hibás adat (pl. üres név).

## Projektszerkezet

```
backend/
  main.py           az alkalmazás: táblák létrehozása, seed, routerek
  database.py       adatbázis-kapcsolat (engine, Session, get_db)
  models.py         adatbázis-modellek: User, Shop, Bike
  schemas.py        Pydantic sémák (bejövő és kimenő adatok)
  auth.py           jelszó-hash, JWT, belépés, get_current_user
  seed.py           előre definiált felhasználó és mintaadatok
  routers/shops.py  boltok végpontjai
  routers/bikes.py  hirdetések végpontjai
frontend/src/
  api.ts            minden backend-kérés innen megy (token a fejlécben)
  App.tsx           belépés vagy főoldal, két fül
  Login.tsx         belépő űrlap
  ShopsPage.tsx     boltok táblázata
  ShopForm.tsx      bolt új / szerkesztés
  BikesPage.tsx     hirdetések táblázata
  BikeForm.tsx      hirdetés új / szerkesztés
  styles.css        stílusok
```

## Megjegyzések

- Az első indításkor, ha az adatbázis üres, a backend létrehoz egy előre definiált
  felhasználót és mintaadatokat (8 kitalált bolt, 30 hirdetés). Regisztráció nincs.
- A JWT titkos kulcsa a `SECRET_KEY` környezeti változóból jön. Ha nincs megadva,
  a backend minden indításkor véletlen kulcsot generál, így a repóban nincs titok,
  és a projekt klónozás után beállítás nélkül indul. Újraindítás után újra be kell lépni.
- Az adatbázis a `backend/bike_locator.db` fájl. Ha törlöd, a következő indításkor
  újra létrejön a mintaadatokkal.
- A frontend fejlesztői szervere (Vite) az `/api` kéréseket továbbítja a
  backendnek, ezért nincs szükség CORS-beállításra.
