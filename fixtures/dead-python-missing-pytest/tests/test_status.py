from src.lazarus_fixture import status


def test_status():
    assert status() == "alive"
