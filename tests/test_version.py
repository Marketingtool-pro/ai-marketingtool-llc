from ai_marketingtool_llc import __version__, version


def test_version_returns_non_empty_string():
    assert isinstance(version(), str)
    assert version()


def test_dunder_version_matches_callable():
    assert __version__ == version()
