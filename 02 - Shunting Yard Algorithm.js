import { Tokenizer } from "./01 - Math Expression Tokenizer.js";

/**
 * Static class for Shunting Yard Algorithm.
 * https://en.wikipedia.org/wiki/Shunting_yard_algorithm
 */
class ShuntingYard{
    static operators = {
        '^': { precedence: 4, associativity: 'right', evaluate: (n1, n2) => n1 ** n2 },
        '*': { precedence: 3, associativity: 'left', evaluate: (n1, n2) => n1 * n2 },
        '/': { precedence: 3, associativity: 'left', evaluate: (n1, n2) => n1 / n2 },
        '+': { precedence: 2, associativity: 'left', evaluate: (n1, n2) => n1 + n2 },
        '-': { precedence: 2, associativity: 'left', evaluate: (n1, n2) => n1 - n2 }
    };
    static functions = {
        'neg': { evaluate: n => -n },
        'sin': { evaluate: Math.sin },
        'cos': { evaluate: Math.cos },
        'tan': { evaluate: Math.tan }
    };

    static isFunction = (token) => Object.keys(this.functions).includes(token.toLowerCase());
}

/**
 * Convert infix mathematical expression into postfix form (Reverse Polish Notation).
 * @param {String} expression - Infix mathematical expression
 * @returns {String} - Postfix / RPN mathematical expression
 */
ShuntingYard.infixToPostfix = (expression) => {
    const tokens = Tokenizer.tokenize(expression);
    const operatorStack = [];
    const outputStack = [];

    for(const token of tokens){
        if(token.type === Tokenizer.TokenTypes.NUMBER){
            outputStack.push(token.value);
        } else if(token.type === Tokenizer.TokenTypes.IDENTIFIER){
            operatorStack.push(token.value);
        } else if(token.type === Tokenizer.TokenTypes.OPERATOR){
            const o1 = token.value;
            let o2 = operatorStack.at(-1);
            while(o2 !== undefined && o2 !== '(' && 
                (ShuntingYard.operators[o2].precedence > ShuntingYard.operators[o1].precedence || 
                (ShuntingYard.operators[o2].precedence === ShuntingYard.operators[o1].precedence && ShuntingYard.operators[o1].associativity === 'left'))){
                    outputStack.push(operatorStack.pop());
                    o2 = operatorStack.at(-1);
                }
            operatorStack.push(o1);
        } else if(token.value === '('){
            operatorStack.push(token.value);
        } else if(token.value === ')'){
            let top = operatorStack.at(-1);
            while(top !== '('){
                if(operatorStack.length > 0){
                    outputStack.push(operatorStack.pop());
                } else{
                    throw new Error('Mismatched parentheses.');
                }
                top = operatorStack.at(-1);
            }

            if(top === '('){
                operatorStack.pop();
            }

            if(ShuntingYard.isFunction(top)){
                outputStack.push(operatorStack.pop());
            }
        }
    }

    while(operatorStack.length > 0){
        let top = operatorStack.at(-1);
        if(top !== '('){
            outputStack.push(operatorStack.pop());
        } else{
            throw new Error('Mismatched parentheses.');
        }
    }

    return outputStack.join(' ');
}

/**
 * Evaluate Postfix / RPN mathematical expression.
 * @param {String} expression - Postfix / RPN mathematical expression
 * @returns {Number} - Result after evaluation.
 */
ShuntingYard.evaluatePostfix = (expression) => {
    const tokens = Tokenizer.tokenize(expression);
    const stack = [];

    for(const token of tokens){
        if(token.type === Tokenizer.TokenTypes.NUMBER){
            stack.push(token.value);
        } else {
            if(token.type === Tokenizer.TokenTypes.IDENTIFIER){
                const operand = parseFloat(stack.pop());
                const result = ShuntingYard.functions[token.value].evaluate(operand);

                stack.push(result);
            } else if(token.type === Tokenizer.TokenTypes.OPERATOR){
                const rightOperand = parseFloat(stack.pop());
                const leftOperand = parseFloat(stack.pop());
                const result = ShuntingYard.operators[token.value].evaluate(leftOperand, rightOperand);

                stack.push(result);
            }
        }
    }

    return stack.pop();
}

/**
 * Evaluate an infix mathematical expression.
 * @param {String} expression - The infix mathematical expression.
 * @returns {Number} - Result
 */
ShuntingYard.evaluateInfix = (expression) => {
    return ShuntingYard.evalRPN(ShuntingYard.getRPN(expression));
}

/**
 * Evaluate an infix mathematical expression.
 * Convert infix into RPN and evaluating it at the same time.
 * @param {String} expression - The infix mathematical expression.
 * @returns {Number} - Result
 */
ShuntingYard.fasterEvaluateInfix = (expression) => {
    // Tokenize the expression
    const tokens = Tokenizer.tokenize(expression);

    // Data Structures
    const operatorStack = []; // Stack to hold operations
    const numberStack = []; // Stack to hold numbers

    // Utility function
    const getResult = () => {
        const operator = operatorStack.pop();

        if(operator === '(') {return '(';}

        if(ShuntingYard.isFunction(operator)){
            const value = parseFloat(numberStack.pop());
            return ShuntingYard.functions[operator].evaluate(value);
        }

        const right = parseFloat(numberStack.pop());
        const left = parseFloat(numberStack.pop());
        return ShuntingYard.operators[operator].evaluate(left, right);
    }

    ////////////////////////////
    //
    // Shunting Yard Algorithm
    //
    ///////////////////////////
    for (const { type, value } of tokens) {
        if (type === Tokenizer.TokenTypes.NUMBER) {
            numberStack.push(value);
        } else if (type === Tokenizer.TokenTypes.IDENTIFIER && ShuntingYard.isFunction(value)){
            operatorStack.push(value);
        } else if (type === Tokenizer.TokenTypes.OPERATOR) {
            while (operatorStack.length && operatorStack.at(-1) !== '(' && (
                ShuntingYard.operators[operatorStack.at(-1)].precedence > ShuntingYard.operators[value].precedence ||
                (ShuntingYard.operators[operatorStack.at(-1)].precedence === ShuntingYard.operators[value].precedence && ShuntingYard.operators[value].associativity === 'left')
            )) {
                numberStack.push(getResult());
            }
            operatorStack.push(value);
        } else if (value === '(') {
            operatorStack.push(value);
        } else if (value === ')') {
            let top;
            while (operatorStack.length && (top = getResult()) !== '(') {
                numberStack.push(top);
            }

            if (operatorStack.at(-1) !== undefined && ShuntingYard.isFunction(operatorStack.at(-1))){
                numberStack.push(getResult());
            }
            if (top !== '(') {
                throw new Error('Mismatched parentheses in expression.');
            }
        }
    }

    while (operatorStack.length) {
        let top = getResult();
        if (top === '(') {
            throw new Error('Mismatched parentheses in expression.');
        }
        numberStack.push(top);
    }

    if (numberStack.length === 1){
        return numberStack.pop();
    } else{
        throw new Error('Invalid expression.');
    }
}

export {ShuntingYard};