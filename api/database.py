import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]


def headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


class SupabaseTable:
    def __init__(self, table: str):
        self.table = table
        self.base = f"{SUPABASE_URL}/rest/v1/{table}"

    def select(self, columns: str = "*"):
        self._columns = columns
        self._filters = []
        return self

    def eq(self, col: str, val):
        self._filters.append(f"{col}=eq.{val}")
        return self

    def _build_url(self):
        url = f"{self.base}?select={getattr(self, '_columns', '*')}"
        for f in getattr(self, '_filters', []):
            url += f"&{f}"
        return url

    def execute(self):
        url = self._build_url()
        r = httpx.get(url, headers=headers())
        r.raise_for_status()
        return type('Result', (), {'data': r.json()})()

    def single(self):
        self._single = True
        return self

    def insert(self, data: dict):
        r = httpx.post(self.base, json=data, headers=headers())
        r.raise_for_status()
        return type('Result', (), {'data': r.json()})()

    def upsert(self, data: dict, on_conflict: str = ""):
        h = {**headers(), "Prefer": f"resolution=merge-duplicates,return=representation"}
        params = {}
        if on_conflict:
            params["on_conflict"] = on_conflict
        r = httpx.post(self.base, json=data, headers=h, params=params)
        r.raise_for_status()
        return type('Result', (), {'data': r.json()})()


class DB:
    def table(self, name: str) -> SupabaseTable:
        return SupabaseTable(name)


def get_supabase() -> DB:
    return DB()
