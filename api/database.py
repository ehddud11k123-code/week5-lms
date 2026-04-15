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
        op = getattr(self, '_operation', 'select')

        if op == "insert":
            r = httpx.post(self.base, json=self._insert_data, headers=headers())
        elif op == "upsert":
            h = {**headers(), "Prefer": "resolution=merge-duplicates,return=representation"}
            params = {}
            on_conflict = getattr(self, '_on_conflict', '')
            if on_conflict:
                params["on_conflict"] = on_conflict
            r = httpx.post(self.base, json=self._insert_data, headers=h, params=params)
        else:
            url = self._build_url()
            if getattr(self, '_single', False):
                r = httpx.get(url, headers={**headers(), "Accept": "application/vnd.pgrst.object+json"})
            else:
                r = httpx.get(url, headers=headers())

        r.raise_for_status()
        return type('Result', (), {'data': r.json()})()

    def single(self):
        self._single = True
        return self

    def insert(self, data: dict):
        self._insert_data = data
        self._operation = "insert"
        return self

    def upsert(self, data: dict, on_conflict: str = ""):
        self._insert_data = data
        self._on_conflict = on_conflict
        self._operation = "upsert"
        return self


class DB:
    def table(self, name: str) -> SupabaseTable:
        return SupabaseTable(name)


def get_supabase() -> DB:
    return DB()
