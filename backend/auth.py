import os
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import LoginRequest, TokenResponse

# JWT titkos kulcs, ha nincs megadva veletlen kulcs keszul
SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_urlsafe(32)
ALGORITHM = "HS256"
TOKEN_MINUTES = 60

router = APIRouter(tags=["Belépés"])

# Token nelkul 401-et adunk (403 helyett)
bearer_scheme = HTTPBearer(auto_error=False)


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_token(username: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_MINUTES)
    return jwt.encode({"sub": username, "exp": expires}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Hiányzó token, jelentkezz be")

    try:
        # Ellenorzi az alairast es a lejaratot
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Érvénytelen vagy lejárt token")

    user = db.scalar(select(User).where(User.username == payload["sub"]))
    if user is None:
        raise HTTPException(status_code=401, detail="A felhasználó nem létezik")
    return user


@router.post("/api/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.username == data.username))
    # Ugyanaz a hiba rossz nevnel es rossz jelszonal
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Hibás felhasználónév vagy jelszó")
    return TokenResponse(access_token=create_token(user.username))
