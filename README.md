# sv-instance-generator

**sv-instance-generator** is a VS Code extension that automatically generates instance code from SystemVerilog module definitions and copies it to the clipboard. This helps streamline the process of instantiating modules in higher-level designs.

## Features

- **Automatic Parsing**
  Extracts the module name and port list from ANSI-style SystemVerilog module definitions.

- **Code Generation**
  Generates instance code where the instance name is prefixed with `u_` (i.e., `u_[module name]`). The port connections are left blank, and the position of the `()` for each port is aligned based on the longest port name with appropriate padding.

- **Clipboard Copy**
  Automatically copies the generated instance code to the clipboard, allowing you to paste it directly into your higher-level module.

*Tip: You can add screenshots or animations here to showcase your extension in action.*

## Requirements

- **SystemVerilog Modules**
  This extension works with SystemVerilog files containing ANSI-style module definitions.

- **VS Code (version 1.70 or later recommended)**
  The extension requires a recent version of VS Code for optimal functionality.

## Extension Settings

Currently, **sv-instance-generator** does not provide any user-specific settings. Future releases may include customization options.

## Known Issues

- The current implementation depends on ANSI-style module definitions and may not work correctly with other coding styles.
- Complex port definitions might occasionally cause parsing issues.

If you encounter any problems, please report them on the [GitHub Issues page](https://github.com/yourusername/sv-instance-generator/issues).

## Release Notes

### 1.0.0

- **Initial Release**
  Implemented functionality to generate instance code from SystemVerilog modules and automatically copy it to the clipboard.

---

## Following Extension Guidelines

This extension was developed in accordance with the [Visual Studio Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines).

## Working with Markdown

You can use the built-in Markdown editor in VS Code to edit and preview this README.

- **Split Editor:** `Ctrl+\` (Windows/Linux) or `Cmd+\` (macOS)
- **Toggle Preview:** `Shift+Ctrl+V` (Windows/Linux) or `Shift+Cmd+V` (macOS)
- **Markdown Snippets:** Press `Ctrl+Space` to view available Markdown snippets.

## For More Information

- [Visual Studio Code Documentation](https://code.visualstudio.com/docs)
- [VS Code API Reference](https://code.visualstudio.com/api)

**Enjoy using sv-instance-generator!**
