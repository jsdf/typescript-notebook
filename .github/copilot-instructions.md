# Node.js Notebooks (REPL) VS Code Extension

Node.js Notebooks is a Visual Studio Code extension that provides enhanced REPL experience for Node.js in notebooks with support for JavaScript/TypeScript, rich visualizations (TensorFlow.js, Plotly.js, Danfo.js), debugging, and shell script execution.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test the Repository

**CRITICAL**: All builds require Node.js legacy OpenSSL provider due to webpack compatibility with Node.js 20+.

**DEPENDENCY NOTICE**: This repository uses older dependency versions that may require compatibility workarounds due to package ecosystem evolution.

1. **Install dependencies** (avoids TensorFlow.js native build issues):
   ```bash
   npm install --ignore-scripts --legacy-peer-deps
   ```
   - Takes ~4 minutes (downloads many packages, shows deprecation warnings)
   - NEVER use `npm ci` as it will attempt to build TensorFlow.js native dependencies which fail
   - **CRITICAL**: Must use `--legacy-peer-deps` to resolve dependency conflicts with newer npm versions
   - Warnings about deprecated packages and engine mismatches are expected and safe to ignore

2. **Setup ts-node environment**:
   ```bash
   npm run installtsnode
   npm run fixNodeModule
   ```
   - Takes ~7 seconds total

3. **Build the extension**:
   ```bash
   export NODE_OPTIONS="--openssl-legacy-provider"
   npm run build
   ```
   - Takes 2 minutes. NEVER CANCEL. Set timeout to 180+ seconds.
   - **POTENTIAL ISSUE**: If TypeScript compilation errors occur due to dependency version mismatches, the build may fail
   - Client-side code (views) typically builds successfully even if extension code fails
   - Produces webpack warnings (normal), check for "compiled successfully" vs "compiled with errors"

4. **Fix code formatting**:
   ```bash
   npm run prettier-fix
   ```
   - Takes ~3 seconds
   - ALWAYS run this before committing or linting will fail

5. **Verify formatting**:
   ```bash
   npm run lint-format
   ```
   - Takes ~3 seconds

### Development Workflow

1. **Development mode with watch**:
   ```bash
   export NODE_OPTIONS="--openssl-legacy-provider"
   npm run dev
   ```
   - Takes ~12 seconds initial build, then watches for changes
   - Runs TypeScript compilation and webpack in parallel
   - NEVER CANCEL during development

2. **Build VS Code extension package**:
   ```bash
   npm install -g vsce
   export NODE_OPTIONS="--openssl-legacy-provider"
   vsce package -o node-notebooks.vsix
   ```
   - Takes 2+ minutes. NEVER CANCEL. Set timeout to 180+ seconds.
   - Creates ~20MB VSIX file

## Testing and Validation

### Automated Tests
```bash
npm test
```
- **LIMITATION**: Tests fail in CI environments due to VS Code download requirements
- Tests require network access to update.code.visualstudio.com
- Skip automated tests in sandboxed environments

### Manual Validation Scenarios
Since this is a VS Code extension, manual validation requires VS Code:

1. **Install and load extension**:
   - Install the generated .vsix file in VS Code
   - Verify extension activates without errors

2. **Basic notebook functionality**:
   - Create a new file with `.nnb` extension
   - Add JavaScript code cell: `console.log("Hello World")`
   - Execute cell and verify output appears

3. **TypeScript support**:
   - Add TypeScript code cell: `let x: number = 42; console.log(x)`
   - Verify TypeScript compilation and execution

4. **Rich visualizations**:
   - Test Plotly.js: Create simple plot and verify it renders
   - Test shell scripts: Add cell with `!echo "Shell test"` and verify execution

5. **Debugging**:
   - Set breakpoints in JavaScript/TypeScript code
   - Use Debug Cell command and verify breakpoints hit

## Common Issues and Workarounds

### Dependencies
- **TensorFlow.js build failure**: Always use `npm install --ignore-scripts`
- **Node.js 20+ compatibility**: Always use `NODE_OPTIONS="--openssl-legacy-provider"`
- **Missing VS Code APIs**: Download may fail in restricted networks (non-critical for building)

### Build Issues
- **ESLint configuration errors**: Repository includes necessary symlinks for tsconfig files
- **Webpack warnings**: Deprecation warnings are expected and non-critical
- **Bundle analyzer errors**: JavaScript module parsing errors are expected
- **TypeScript compilation errors with fresh npm install**: If dependency versions cause TS errors, the repository was tested with a specific package-lock.json state. Use git to restore or commit the working package-lock.json.
- **Dependency resolution conflicts**: Always use `npm install --ignore-scripts --legacy-peer-deps` to avoid conflicts

### Linting and Formatting
- **Always run `npm run prettier-fix` before any linting or CI will fail**
- ESLint requires TypeScript project references, which are configured correctly
- Format check with `npm run lint-format` must pass before committing

### GitHub Actions
- **Disabled intentionally**: The .github/workflows/workflow.yaml is commented out due to CI flakiness
- Don't attempt to enable CI without addressing TensorFlow.js and network dependency issues

## Project Structure

### Key Directories
- `src/extension/`: Main extension code (TypeScript/JavaScript execution, kernel management)
- `src/client/`: Frontend code for notebook renderers (Plotly, TensorFlow.js visualizations)
- `src/node-kernel/`: Type definitions for notebook kernel
- `build/webpack/`: Build configuration
- `resources/scripts/`: Bundled ts-node dependencies

### Important Files
- `package.json`: Extension manifest and build scripts
- `tsconfig.json`: TypeScript configuration for extension
- `tsconfig.client.json`: TypeScript configuration for client-side code
- `.eslintrc.js`: Linting configuration with project-specific rules

## Timing Expectations

All commands below show typical timing with 50% safety buffer for timeouts:

| Command | Typical Time | Recommended Timeout |
|---------|-------------|-------------------|
| `npm install --ignore-scripts --legacy-peer-deps` | 40s | 120s |
| `npm run installtsnode` + `npm run fixNodeModule` | 3s | 30s |
| `npm run build` | 2min | 180s |
| `npm run dev` (initial) | 12s | 60s |
| `vsce package` | 2min | 180s |
| `npm run prettier-fix` | 3s | 30s |
| `npm run lint-format` | 3s | 30s |

**NEVER CANCEL**: Build processes may appear to hang but are processing large codebases and dependencies.

## Extension Capabilities

This extension provides:
- JavaScript/TypeScript execution in notebook cells
- Rich HTML/plot output rendering
- Integration with TensorFlow.js, Plotly.js, Danfo.js, Arquero
- Shell script execution within cells
- Full debugging support with breakpoints
- Top-level await support
- REPL-style interactive development

Always test core JavaScript/TypeScript execution scenarios when making changes to kernel or execution components.