from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Bike, Shop, User

# Felepites: bcrypt.hashpw(jelszo.encode(), bcrypt.gensalt())
ADMIN_PASSWORD_HASH = "$2b$12$BIcz/C9UglDcj2eIxsXcVeLKtwt/hNggwIpu6UEOacoYHx31Lq6vi"


def seed(db: Session):
    # Ha mar van felhasznalo, nem tolti fel ujra
    if db.scalar(select(User)) is not None:
        return

    db.add(User(username="admin", password_hash=ADMIN_PASSWORD_HASH))

    pedalpont = Shop(name="Pedálpont Kerékpárbolt", city="Szeged",
                     website="https://www.pedalpontbolt.hu", founded_year=2012)
    lanckerek = Shop(name="Lánckerék Műhely", city="Budapest",
                     website="https://www.lanckerekmuhely.hu", founded_year=2005)
    tekero = Shop(name="Tekerő Bringaház", city="Debrecen",
                  website=None, founded_year=2018)
    osveny = Shop(name="Hegyi Ösvény Bike", city="Pécs",
                  website="https://www.hegyiosvenybike.hu", founded_year=2015)
    balaton = Shop(name="Balatoni Bringapart", city="Siófok",
                   website="https://www.balatonibringapart.hu", founded_year=2020)
    dunapart = Shop(name="Duna-parti Kerékpárszalon", city="Győr",
                    website="https://www.dunapartikerekpar.hu", founded_year=1998)
    kilometer = Shop(name="Kilométer Bike Store", city="Miskolc",
                     website=None, founded_year=2010)
    varosi = Shop(name="Városi Tekerők", city="Kecskemét",
                    website="https://www.varositekerok.hu", founded_year=2023)

    db.add_all([pedalpont, lanckerek, tekero, osveny, balaton, dunapart, kilometer, varosi])

    bikes = [
        # (cim, marka, ar, evjarat, allapot, bolt)
        ("Trek Marlin 7 MTB", "Trek", 389000, 2023, "new", pedalpont),
        ("Specialized Rockhopper Comp", "Specialized", 245000, 2020, "used", pedalpont),
        ("Cube Attention SL", "Cube", 459000, 2024, "new", pedalpont),
        ("Gepida Alboin 300 városi", "Gepida", 189000, 2023, "new", pedalpont),
        ("Csepel Woodlands Pro 29", "Csepel", 139000, 2022, "new", lanckerek),
        ("Merida Big.Nine 300", "Merida", 198000, 2021, "used", lanckerek),
        ("Kellys Spider 70", "Kellys", 310000, 2023, "new", lanckerek),
        ("Brompton C Line összecsukható", "Brompton", 720000, 2022, "used", lanckerek),
        ("Bianchi Via Nirone 7 országúti", "Bianchi", 455000, 2021, "used", lanckerek),
        ("Giant Talon 2", "Giant", 169000, 2019, "used", tekero),
        ("KTM Macina Cross 610 e-bike", "KTM", 1090000, 2024, "new", tekero),
        ("Neuzer Ravenna 100 trekking", "Neuzer", 119000, 2023, "new", tekero),
        ("Scott Aspect 950", "Scott", 152000, 2020, "used", osveny),
        ("Canyon Endurace 7 országúti", "Canyon", 520000, 2022, "used", osveny),
        ("Santa Cruz Hightower C", "Santa Cruz", 1650000, 2023, "used", osveny),
        ("Orbea Occam H30 fully", "Orbea", 980000, 2024, "new", osveny),
        ("Ghost Kato Essential 29", "Ghost", 175000, 2021, "used", osveny),
        ("Haibike Trekking 6 e-bike", "Haibike", 1190000, 2024, "new", balaton),
        ("Cube Touring Hybrid One", "Cube", 899000, 2023, "used", balaton),
        ("Gepida Reptila 1000 e-bike", "Gepida", 649000, 2022, "used", balaton),
        ("Specialized Turbo Vado 4.0", "Specialized", 1490000, 2024, "new", balaton),
        ("Cannondale Synapse Carbon 3", "Cannondale", 1150000, 2023, "new", dunapart),
        ("Focus Izalco Max 8.7", "Focus", 1380000, 2022, "used", dunapart),
        ("BMC Roadmachine Five", "BMC", 890000, 2021, "used", dunapart),
        ("Lapierre Xelius SL 5.0", "Lapierre", 760000, 2020, "used", dunapart),
        ("Trek Domane AL 2", "Trek", 349000, 2024, "new", dunapart),
        ("Csepel Rapid 3* városi", "Csepel", 89000, 2017, "used", kilometer),
        ("Kellys Phanatic 10 e-MTB", "Kellys", 1050000, 2023, "new", kilometer),
        ("Merida eSpresso 400", "Merida", 799000, 2022, "used", kilometer),
        ("Giant Escape 2 fitness", "Giant", 229000, 2024, "new", kilometer),
    ]
    db.add_all(
        Bike(title=title, brand=brand, price=price, year=year, condition=condition, shop=shop)
        for title, brand, price, year, condition, shop in bikes
    )
    db.commit()
