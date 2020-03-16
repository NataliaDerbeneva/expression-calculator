function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let newExpr = expr.replace(/\s/g,'');

    let substr = newExpr.match(/[\(\)]/g);
    if(substr!=null) checkBrackets(substr);

    let opz = parseToOpz(newExpr);
    let res = calcOpz(opz);
  
    return res;  
}

module.exports = {
    expressionCalculator
}


function parseMathOperand(symb,opz,opzStack,opzStackPrior,num){
    let len = opzStack.length;
    if(len == 0 || opzStackPrior[len-1] < num){
      opzStack.push(symb);
      opzStackPrior.push(num);
    } else {
      while(opzStackPrior[len-1] >= num) {
        opz.push(opzStack[len-1]);
        opzStack.pop();
        opzStackPrior.pop();
        len--;
      }
      opzStack.push(symb);
      opzStackPrior.push(num);
    }
    return;
  }
  
  function parseToOpz(newExpr){
    let opz = new Array();
  
    let i=0;
    let substr;
    let symb;
    let opzStack = new Array();
    let opzStackPrior = new Array();
  
    while(i<newExpr.length){
      symb = newExpr[i];
  
      if(/[0-9]/.test(symb)){
        substr = newExpr.slice(i).match(/^[0-9]+/);
        opz.push(Number(substr));
        i = i + substr[0].length;
      } else { 
        if(/[+-]/.test(symb)) parseMathOperand(symb,opz,opzStack,opzStackPrior,2);
        else if(/[\*\/]/.test(symb)) parseMathOperand(symb,opz,opzStack,opzStackPrior,3);
        else if(symb == "(") {
          opzStack.push(symb);
          opzStackPrior.push(1);
        } else if(symb ==")") {
          len = opzStack.length;
          while(opzStack[len-1]!="("){
            opz.push(opzStack[len-1]);
            opzStack.pop();
            opzStackPrior.pop();
            len--;
          }
          opzStack.pop();
          opzStackPrior.pop();
        }
        i++;
      } 
     }
  
     while(opzStack.length>0){
       opz.push(opzStack[opzStack.length-1]);
       opzStack.pop();
     }
     return opz;
  }
  
  function calcOpz(opz){
    let i = 0;
    let opzStack = new Array();
    let symb;
    let res,len;
  
    while(i<opz.length){
      symb = opz[i];
      while(/[0-9]/.test(symb)){
        opzStack.push(symb);
        i++;
        symb = opz[i];    
      }
      len = opzStack.length;
      if(symb=="+"){
        res = opzStack[len-2] + opzStack[len-1];
        opzStack.pop();
        opzStack.pop();
        opzStack.push(res);
      } else if(symb=="-"){
        res = opzStack[len-2] - opzStack[len-1];
        opzStack.pop();
        opzStack.pop();
        opzStack.push(res);
      } else if(symb=="*"){
        res = opzStack[len-2] * opzStack[len-1];
        opzStack.pop();
        opzStack.pop();
        opzStack.push(res);
      } else if(symb=="/"){
        if(opzStack[len-1]==0) throw "TypeError: Division by zero.";
        res = opzStack[len-2] / opzStack[len-1];
        opzStack.pop();
        opzStack.pop();
        opzStack.push(res);
      } 
      i++;
    } 
  
    return opzStack[0];
  }
  
  function checkBrackets(substr){
    let stack = new Array();
    
    let i = 0;
    while(i < substr.length){
      if(substr[i]=="(") stack.push("(");
      else if(stack[stack.length-1]=="(") stack.pop();
      else throw "ExpressionError: Brackets must be paired";
      i++;
    }
  
    if(stack.length>0) throw "ExpressionError: Brackets must be paired";
    return;
  }