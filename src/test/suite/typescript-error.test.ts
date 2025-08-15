import * as assert from 'assert';
import { Compiler } from '../../extension/kernel/compiler';

suite('TypeScript Error Handling Tests', () => {
    test('fixCellPathsInStackTrace should preserve error message for TypeScript compilation errors', () => {
        // Create a mock error like the one generated in codeExecution.ts
        const mockError = new Error('Unexpected token "}"');
        mockError.name = 'InvalidCode_CodeExecution';
        mockError.stack = 'SyntaxError: Unexpected token "}"\n    at new Script (vm.js:117:7)';

        // Call the function with the mock document (we're just testing the error handling part)
        const result = Compiler.fixCellPathsInStackTrace(null as any, mockError);

        // Verify that the error message is preserved
        assert.strictEqual(result, 'Unexpected token "}"');
        
        // Verify that the error name was changed to SyntaxError
        assert.strictEqual(mockError.name, 'SyntaxError');
    });

    test('fixCellPathsInStackTrace should return fallback message if error message is empty', () => {
        const mockError = new Error('');
        mockError.name = 'InvalidCode_CodeExecution';
        mockError.stack = '';

        const result = Compiler.fixCellPathsInStackTrace(null as any, mockError);

        assert.strictEqual(result, 'TypeScript compilation failed');
        assert.strictEqual(mockError.name, 'SyntaxError');
    });

    test('fixCellPathsInStackTrace should not affect other error types', () => {
        const mockError = new Error('Some runtime error');
        mockError.name = 'ReferenceError';
        mockError.stack = 'ReferenceError: someVar is not defined\n    at Object.<anonymous>';

        const originalStack = mockError.stack;
        const result = Compiler.fixCellPathsInStackTrace(null as any, mockError);

        // For non-TypeScript compilation errors, the function should proceed with normal processing
        // Since we passed null as document, it should just return the original stack trace
        assert.strictEqual(result, originalStack);
        assert.strictEqual(mockError.name, 'ReferenceError');
    });
});