$(function() {
  var c = new Calculator();
  var pClass = "";
  $("#display").text(c.getNum());
  $("button").click(function() {
    var cClass = $(this).attr("class");
    switch (cClass) {
      case "num-btn":
        c.addNum($(this).text(), pClass);
        break;
      case "op-btn":
        c.addOp($(this).val(), pClass);
        break;
      case "sgn-btn":
        c.chgSgn();
        break;
      case "eq-btn":
        c.result(pClass);
        break;
      case "ac-btn":
        c.clearNum(pClass);
        break;
    }
    $("#display").text(c.getNum());
    pClass = cClass;
  });
});

var Calculator = function() {
  var cNum = "";
  var pNum = "";
  var cOp = "";
  var pOp = "[]";
  var ops = {
    add: function(a = 0, b = 0) {
      return parseFloat(a) + parseFloat(b);
    },
    sub: function(a = 0, b = 0) {
      return parseFloat(a) - parseFloat(b);
    },
    mul: function(a = 0, b = 0) {
      return parseFloat(a) * parseFloat(b);
    },
    div: function(a = 0, b = 0) {
      return parseFloat(a) / parseFloat(b);
    },
    per: function(a = 0, b = 0) {
      return a * b / 100;
    }
  };
  this.getNum = function() {
    //console.log(cNum,pNum,cOp,pOp);
    cNum = cNum.toString();
    if (cNum == "") 
      return 0;
    else if (!isFinite(cNum))
      return 'Error';
    else if (cNum.indexOf('.') != -1) {
      var num = cNum.split('.');
    num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return num.join(".");
    }
    else {
      return cNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
  };
  this.clearNum = function(pBtn) {
    if (pBtn == "ac-btn") {
      cNum = "";
      pNum = "";
      cOp = "";
    } else {
      cNum = "";
    }
  };
  this.addNum = function(num, pBtn) {
    if (pBtn != "op-btn" && pBtn != "eq-btn") {
      cNum += num;
    } else {
      cNum = num;
    }
  };
  this.addOp = function(op, pBtn) {
    if (cOp) {
      if (pBtn == "op-btn" || pBtn == "ac-btn") {
        cOp = op;
      } else {
        cNum = ops[cOp](pNum, cNum);
        pNum = cNum;
        cOp = op;
      }
    } else {
      cOp = op;
      pNum = cNum == "" ? 0 : cNum;
    }
  };
  this.result = function(pBtn) {
    if (pBtn != "eq-btn") {
      if (cOp == "");
      else {
        pOp = [ops[cOp], cNum];
        cNum = ops[cOp](pNum, cNum);
        (pNum = ""), (cOp = "");
      }
    } else {
      cNum = pOp[0](cNum, pOp[1]);
    }
  };
  this.chgSgn = function() {
    if (cNum != '')
    cNum = -parseFloat(cNum);
  };
};
