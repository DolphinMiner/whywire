"""Synthetic handoff: real SQLite commits/reopens, an in-memory broker model."""

import argparse
import json
from pathlib import Path
import sqlite3
import tempfile


class Broker:
    def __init__(self, outcome):
        self.outcome = outcome
        self.accepted = []  # Demo observer only; recovery has no broker query API.

    def publish(self, job_id, payload):
        if self.outcome == "rejected":
            raise ConnectionError("broker rejected before acceptance")
        self.accepted.append((job_id, payload))
        if self.outcome == "lost_ack":
            raise TimeoutError("acknowledgement was not received")


def deliver(db, broker, interrupt=False):
    job_id, payload = db.execute(
        "SELECT id, payload FROM jobs WHERE state = 'pending'"
    ).fetchone()
    db.execute("UPDATE jobs SET state = 'done' WHERE id = ?", (job_id,))
    db.commit()
    if interrupt:
        raise InterruptedError("simulated interruption after commit")
    broker.publish(job_id, payload)


def recover(db):
    return db.execute("SELECT id FROM jobs WHERE state = 'pending'").fetchall()


def demo(scenario):
    broker = Broker(scenario)
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "jobs.sqlite"
        db = sqlite3.connect(path)
        db.execute("CREATE TABLE jobs (id TEXT PRIMARY KEY, state TEXT, payload TEXT)")
        db.execute("INSERT INTO jobs VALUES ('job-1', 'pending', 'reviewed payload')")
        db.commit()
        observed_error = None
        try:
            deliver(db, broker, interrupt=(scenario == "interrupted"))
        except (ConnectionError, TimeoutError, InterruptedError) as error:
            observed_error = type(error).__name__
        finally:
            db.close()
        reopened = sqlite3.connect(path)
        try:
            persisted = reopened.execute("SELECT state, payload FROM jobs").fetchone()
            candidates = recover(reopened)
        finally:
            reopened.close()
    return {"scenario": scenario, "observed_error": observed_error,
            "persisted": persisted, "recovery_candidates": candidates,
            "broker_accepted_for_demo_observer": len(broker.accepted)}


def check():
    results = {mode: demo(mode) for mode in
               ("acknowledged", "interrupted", "rejected", "lost_ack")}
    for result in results.values():
        assert result["persisted"] == ("done", "reviewed payload")
        assert result["recovery_candidates"] == []
    assert results["acknowledged"]["observed_error"] is None
    assert results["interrupted"]["broker_accepted_for_demo_observer"] == 0
    assert results["rejected"]["broker_accepted_for_demo_observer"] == 0
    assert results["lost_ack"]["broker_accepted_for_demo_observer"] == 1
    assert results["lost_ack"]["observed_error"] == "TimeoutError"
    print("PASS: reopened SQLite has the same terminal row for zero or one broker acceptance; recovery selects none.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check()
    else:
        for mode in ("acknowledged", "interrupted", "rejected", "lost_ack"):
            print(json.dumps(demo(mode)))
