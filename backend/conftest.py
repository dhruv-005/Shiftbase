import os
import sys
import tempfile
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from main import app
from database.connection import DatabaseConnection
from database.migrations import run_migrations


@pytest_asyncio.fixture(scope="function")
async def client():
    # Setup temporary test database
    db_file = os.path.join(tempfile.gettempdir(), f"test_shiftbase_{os.getpid()}.db")
    db = DatabaseConnection(db_file)
    await db.connect()
    await run_migrations(db)
    app.state.db = db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

    await db.disconnect()
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
        except Exception:
            pass
