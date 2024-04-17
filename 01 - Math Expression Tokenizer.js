/**
 * Static class for a math expression tokenizer.
 */
class Tokenizer {
    static TokenTypes = {
        NUMBER: 'NUMBER',
        IDENTIFIER: 'IDENTIFIER',
        OPERATOR: 'OPERATOR',
        PARENTHESIS: 'PARENTHESIS'
    };

    static TokenSpec = [
        [/^\s+/, null],  // Skip whitespace
        [/^\d*\.?\d+/, Tokenizer.TokenTypes.NUMBER],  // Multi-digit numbers, decimal numbers
        [/^[a-z]+/, Tokenizer.TokenTypes.IDENTIFIER], // Letters (Function names)
        [/^[\+\-\*\/\^]/, Tokenizer.TokenTypes.OPERATOR],  // Operators
        [/^[\(\)]/, Tokenizer.TokenTypes.PARENTHESIS]  // Parentheses
    ];

    static tokenize(expression) {
        let tokens = [];
        let position = 0;
        let lastToken = { type: null, value: null };

        while (position < expression.length) {
            const subexpression = expression.slice(position);
            let matched = false;

            for (const [regex, type] of this.TokenSpec) {
                const match = regex.exec(subexpression);
                if (match) {
                    if (type !== null) { // We skip over null (whitespace) types
                        let value = match[0];
                        let currentType = type;  // Default type is the type found by the regex
                        if (value === '-' && (lastToken.type === null || lastToken.type === Tokenizer.TokenTypes.OPERATOR || lastToken.value === '(')) { //Check if '-' is a unary minus
                            const numberMatch = /^\d*\.?\d+/.exec(expression.slice(position + 1));
                            if (numberMatch) {
                                value += numberMatch[0];
                                currentType = Tokenizer.TokenTypes.NUMBER;  // Change type to NUMBER
                            }
                        }
                        tokens.push({ type: currentType, value }); // Use currentType which may have been updated
                        lastToken = { type: currentType, value };
                        position += value.length; // Move position past the entire match
                        matched = true;
                        break;
                    }
                }
            }

            if (!matched) {
                throw new Error(`Unexpected token: "${subexpression[0]}"`);
            }
        }

        return tokens;
    }
}

export {Tokenizer};