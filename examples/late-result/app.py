"""Synthetic ordered interleaving; it is not a concurrent storage implementation."""

import argparse


class Store:
    def __init__(self):
        self.rows = {}
        self.generation = 0

    def start(self, key, result):
        self.generation += 1
        self.rows[key] = {"generation": self.generation, "deleted": False,
                          "value": "pending"}
        return {"key": key, "generation": self.generation, "result": result}

    def delete(self, key):
        self.rows[key]["deleted"] = True

    def complete(self, job, guarded):
        current = self.rows.get(job["key"])
        if guarded and (current is None or current["deleted"] or
                        current["generation"] != job["generation"]):
            return "discarded"
        self.rows[job["key"]] = {"generation": job["generation"],
                                "deleted": False, "value": job["result"]}
        return "applied"

    def read(self, key):
        row = self.rows.get(key)
        return None if row is None or row["deleted"] else row["value"]


def demo(guarded, recreate=False):
    store = Store()
    old_job = store.start("item-1", "old result")
    store.delete("item-1")
    after_delete = store.read("item-1")
    if recreate:
        new_job = store.start("item-1", "new result")
        store.complete(new_job, guarded=True)
    decision = store.complete(old_job, guarded)
    return after_delete, decision, store.read("item-1")


def check():
    assert demo(guarded=False) == (None, "applied", "old result")
    assert demo(guarded=True) == (None, "discarded", None)
    assert demo(guarded=True, recreate=True) == (None, "discarded", "new result")
    live = Store()
    job = live.start("item-1", "live result")
    assert live.complete(job, guarded=True) == "applied"
    assert live.read("item-1") == "live result"
    print("PASS: resurrection reproduced; deletion and replacement reject old work; live work completes.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check()
    else:
        for label, guarded, recreate in [
            ("unguarded", False, False),
            ("guarded deletion", True, False),
            ("guarded replacement", True, True),
        ]:
            deleted, decision, visible = demo(guarded, recreate)
            print(f"{label}: after_delete={deleted!r}; late_callback={decision}; visible={visible!r}")
