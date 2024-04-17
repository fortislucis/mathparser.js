# Math Expression Parser

## Motivation
Ever wondered how to code a calculator **WITHOUT USING** `eval`? Then you need a math parser!

## Basics
### Reverse Polish Notation (RPN)
Humans and computers process calculations differently.

Humans generally find it easier to evaluate expressions in infix notation, which is the standard form for writing mathematical expressions:
$$1 + 2 * 3$$

Computers, on the other hand, prefer the postfix or Reverse Polish Notation (RPN) because it allows for quicker and more straightforward computation. Here's how RPN looks:
$$1 2 3 * +$$

## The Plan
There are multiple ways to create a math parser.

### Shunting Yard Algorithm
1. **Tokenization**: Develop a tokenizer to break down infix mathematical expressions into their basic elements or tokens.
2. **Conversion**: Implement an infix to postfix (RPN) converter using the Shunting Yard Algorithm.
3. **Evaluation**: Code an evaluator to compute the value from expressions in postfix/RPN format.

## Resources
- Check out this [amazing series of tutorials](https://inspirnathan.com/posts/149-math-expression-parser-in-javascript) by Nathan Vaughn.
- Watch this [informative video on the Shunting Yard algorithm](https://www.youtube.com/watch?v=1VjJe1PeExQ&list=PLxLxbi4e2mYHj_5jpkigBn-qVLofCYnNn) by Gary Explains.


