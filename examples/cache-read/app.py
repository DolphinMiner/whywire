"""Synthetic cache-aside example. No network, TTL, invalidation, or concurrency."""

import argparse


class Origin:
    def __init__(self):
        self.values = {"item-1": "blue mug"}
        self.reads = 0

    def read(self, key):
        self.reads += 1
        return self.values[key]


def read_item(key, cache, origin, events):
    if key in cache:
        events.append("cache: hit")
        return cache[key]
    events.append("cache: miss")
    value = origin.read(key)
    events.append("origin: read")
    cache[key] = value
    events.append("cache: fill")
    return value


def demo():
    cache, origin, events = {}, Origin(), []
    first = read_item("item-1", cache, origin, events)
    events.append(f"caller: first response = {first}")
    second = read_item("item-1", cache, origin, events)
    events.append(f"caller: second response = {second}")
    return first, second, origin.reads, events


def check():
    first, second, origin_reads, _ = demo()
    assert first == second == "blue mug"
    assert origin_reads == 1, "A second read should be served without the origin."
    print("PASS: both callers received the value; the origin was read once.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check()
    else:
        _, _, reads, events = demo()
        print("\n".join(events))
        print(f"origin reads: {reads}")
