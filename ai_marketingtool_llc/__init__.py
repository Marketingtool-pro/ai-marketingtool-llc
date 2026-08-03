"""Control-plane helpers for the Marketingtool-pro project."""

from __future__ import annotations

from importlib import metadata

__all__ = ["__version__", "version"]

_DISTRIBUTION = "ai-marketingtool-llc"
_FALLBACK_VERSION = "0.1.0"


def version() -> str:
    """Return the installed distribution version.

    Falls back to the declared version when running from a source checkout
    where the distribution metadata has not been installed.
    """
    try:
        return metadata.version(_DISTRIBUTION)
    except metadata.PackageNotFoundError:
        return _FALLBACK_VERSION


__version__ = version()
