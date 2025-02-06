# sv-instance-generator

**sv-instance-generator** is a VS Code extension that automatically generates instance code from SystemVerilog module definitions and copies it to the clipboard. This helps streamline the process of instantiating modules in higher-level designs.

## Features

- **Automatic Parsing**
  Extracts the module name and port list from ANSI-style SystemVerilog module definitions.

- **Code Generation**
  Generates instance code where the instance name is prefixed with `u_` (e.g., `u_my_module`). The port connections are left blank, and each port's connection parentheses are aligned based on the longest port name.

- **Clipboard Copy**
  Automatically copies the generated instance code to the clipboard for easy pasting into your code.

## Requirements

- SystemVerilog files with ANSI-style module definitions.
- Visual Studio Code version 1.70 or later is recommended.

## Usage

1. **Open a SystemVerilog File**
   Open the SystemVerilog file containing your module definition in VS Code.

2. **Run the Command**
   Open the Command Palette by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).
   Type and select: **SV instance Generator: Generate Instance**

3. **Paste the Generated Code**
   The extension will parse the module and generate the instance code, which is automatically copied to your clipboard. You can now paste it into your higher-level module.

## Extension Settings

Currently, **sv-instance-generator** does not provide any user-specific settings. Future releases may include customization options.

## Known Issues

- The current implementation is tailored for ANSI-style module definitions and might not work correctly with other formats.
- Complex port definitions may occasionally cause parsing issues.

## Release Notes

### 1.1.0

- Changed command naming.

### 1.0.0

- Implemented functionality to generate instance code from SystemVerilog modules and automatically copy it to the clipboard.

---

## For More Information

- [Visual Studio Code Documentation](https://code.visualstudio.com/docs)
- [VS Code API Reference](https://code.visualstudio.com/api)

**Enjoy using sv-instance-generator!**
