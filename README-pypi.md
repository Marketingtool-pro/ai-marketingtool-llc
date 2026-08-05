# ai-marketingtool-llc

Python control-plane helpers for the [Marketingtool-pro](https://github.com/Marketingtool-pro) project.

This is the Python distribution published from the `ai-marketingtool-llc` control
repository. It is deliberately separate from the npm package
`@marketingtool-pro/ai-marketingtool-llc`, which is published from the same
repository but ships different files.

## Install

```bash
pip install ai-marketingtool-llc
```

Or with [uv](https://docs.astral.sh/uv/):

```bash
uv add ai-marketingtool-llc
```

## Usage

```python
from ai_marketingtool_llc import version

print(version())
```

## Scope

The package currently exposes version introspection only. It exists so the
control repository has a real, installable Python surface with correct metadata;
functionality is added as the control-plane tooling moves into Python.

Requires Python 3.10 or newer.

## Links

- Repository: https://github.com/Marketingtool-pro/ai-marketingtool-llc
- Issues: https://github.com/Marketingtool-pro/ai-marketingtool-llc/issues

## License

MIT
