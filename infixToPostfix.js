function isBracketed(expr) {
  var stack = []
  for (var i = 0; i < expr.length; i++) {
    if ('(' === expr[i]) {
      stack.push('(')
    } else if (')' === expr[i]) {
      stack.pop()
      if (stack.length === 0) {
        if (i !== expr.length - 1) {
          return false
        } else {
          return true
        }
      }
    }
  }
  return false;
}

function isValidExpression(expr) {
  if (expr.length < 1) {
    return false;
  }
  // Allow comparison operators, logical operators, and exponential
  const validChars = 'abcdefghijklmnopqrstuvwxyz*()/+-^<>=!&|';
  for (var i = 0; i < expr.length; i++) {
    if (validChars.indexOf(expr[i]) === -1) {
      return false;
    }
  }
  // Check for balanced parentheses
  let parenCount = 0;
  for (var i = 0; i < expr.length; i++) {
    if (expr[i] === '(') parenCount++;
    if (expr[i] === ')') parenCount--;
    if (parenCount < 0) return false;
  }
  if (parenCount !== 0) return false;
  
  return true;
}

function infixToPostfix(expression) {
  if (!isValidExpression(expression)) {
    return null;
  }
  // Operator precedence: higher number = higher precedence
  const prec = { 
    "||": 1,      // Logical OR
    "&&": 2,      // Logical AND
    "<": 3,       // Comparison operators
    ">": 3,
    "<=": 3,
    ">=": 3,
    "==": 3,
    "!=": 3,
    "+": 4,       // Addition/Subtraction
    "-": 4,
    "*": 5,       // Multiplication/Division
    "/": 5,
    "^": 6,       // Exponentiation (right associative)
    "!": 7,       // Logical NOT (unary)
    "(": 0        // Parentheses (lowest precedence)
  }
  
  op_stack = []
  postfixList = []
  
  // Tokenize the expression to handle multi-character operators
  var tokens = []
  var i = 0
  while (i < expression.length) {
    var char = expression[i]
    
    // Check for two-character operators
    if (i < expression.length - 1) {
      var twoChar = char + expression[i + 1]
      if (['<=', '>=', '==', '!=', '&&', '||'].includes(twoChar)) {
        tokens.push(twoChar)
        i += 2
        continue
      }
    }
    
    // Single character token
    tokens.push(char)
    i++
  }
  
  for (const token of tokens) {
    if ("abcdefghijklmnopqrstuvwxyz".indexOf(token) !== -1) {
      postfixList.push(token)
    } else if ("(" === token) {
      op_stack.push(token)
    } else if (")" === token) {
      var top_op_token = op_stack.pop()
      while (top_op_token !== '(') {
        postfixList.push(top_op_token)
        top_op_token = op_stack.pop()
      }
    } else if (prec.hasOwnProperty(token)) {
      // Handle operators - check if operator exists in precedence table
      var peek_elem = op_stack.slice(-1)[0];
      // For right-associative operators like ^, use > instead of >=
      if (token === '^') {
        while (op_stack.length > 0 && peek_elem !== '(' && (prec[peek_elem] > prec[token])) {
          postfixList.push(op_stack.pop())
          peek_elem = op_stack.slice(-1)[0];
        }
      } else {
        while (op_stack.length > 0 && peek_elem !== '(' && (prec[peek_elem] >= prec[token])) {
          postfixList.push(op_stack.pop())
          peek_elem = op_stack.slice(-1)[0];
        }
      }
      op_stack.push(token)
    }
  }
  while (op_stack.length > 0) {
    postfixList.push(op_stack.pop())
  }
  return postfixList
}