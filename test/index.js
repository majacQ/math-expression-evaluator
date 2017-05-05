// This test is for node JS

var assert = require('assert');
var mexp = require("../src/formula_evaluator.js");
describe('Testing Unit', function () {
  it('should equal 2 to check a number', function () {
    assert.equal(mexp.eval("2"),2);
  });
  it('checks a math function', function () {
    assert.equal(mexp.eval("tan(180)"),0);
  });
  it('checks a parenthesis less function', function () {
    assert.equal(mexp.eval("sin180"),0);
  });
  it('checks a parenthesis less function after a space', function () {
    assert.equal(mexp.eval("cos 180"),-1);
  });
  it('checks a parenthesis less function after multiple spaces', function () {
    assert.equal(mexp.eval("cos   180"),-1);
  });
  it('checks a parenthesis less function when need to cloase parenthesis in middle', function () {
    assert.equal(mexp.eval("sinint90.1+2"),3);
  });
  it('checks consecutive operator', function () {
    assert.equal(mexp.eval("0+-2"),-2);
  });
  it('checks ^ operator', function () {
    assert.equal(mexp.eval("2^2"),4);
  });
  it('checks when * is omitted before parenthesis and after', function () {
    assert.equal(mexp.eval("2(7-4)3"),18);
  });
  it('checks multiplication and exponential in series', function () {
    assert.equal(mexp.eval("2*7^2"),98);
  });
  it('checks exponential and multiplication in series', function () {
    assert.equal(mexp.eval("2^5*2"),64);
  });
  it('-3^2=-9', function () {
    assert.equal(mexp.eval("-3^2"),-9);
  });
  it('3^2-2^2=5', function () {
    assert.equal(mexp.eval("3^2-2^2"),5);
  });

  it('formula test', function () {
    assert.equal(mexp.feval("2"),2);
  });
  it('formula test', function () {
    assert.equal(mexp.feval("sinpi"),"sin(&pi;)");
  });
  it('formula test', function () {
    assert.equal(mexp.feval("cos pi"),"cos(&pi;)");
  });
  it('formula test', function () {
    assert.equal(mexp.feval("tan(pi)"),"tan(&pi;)");
  });
  it('formula test', function () {
    assert.equal(mexp.feval("2(7-4)3"),"(2&times;(7-4))&times;3");
  });
  it('test to check the bug when number contains decimal', function () {
    assert.equal(mexp.eval("int2.3"),"2");
  });
  it('test to check auto correct of parenthesis mismatch if opening>closing', function () {
    assert.equal(mexp.eval("(2+(3-4"),"1");
  });
  it('check for negative of a constant', function () {
    assert.equal(mexp.eval("-e"),-Math.E);
  });
  it('check for constant inside Sigma', function () {
    assert.equal(
      mexp.eval("Sigma1,3,2",[{type:3,preced:0,ev:"x",show:"x",token:"x"}],{x:2}),6);
  });
  it('check when arithmetic and n are present inside sigma', function () {
    assert.equal(mexp.eval("Sigma1,2,n"),3);
  });
  it(' should check when 4C3', function () {
    assert.equal(mexp.eval("4C3"),4);
  });
  it('check when arithmetic and n are present inside sigma', function () {
    assert.equal(mexp.eval("Sigma1,2,(n*n)"),5);
  });

  it('check when two parenthesis less functions are consecutive on one parameter', function () {
    assert.equal(mexp.eval("sinint2.5"),mexp.eval("sin(int(2.5))"));
  });

  it('check eval method with single argument', function () {
    assert.equal(mexp.eval("5*3"),"15");
  });
  it('check eval method with three argument', function () {
    assert.equal(mexp.eval("mexp*3",[{type:3,show:"mexp",token:"mexp",value:"mexp",preced:0}],{mexp:5}),"15");
  });
  it('check eval method with two argument when second one is value of constants', function () {
	mexp.addToken([{type:3,show:"mexp",value:"mexp",preced:0,token:"mexp"}]);
    assert.equal(mexp.eval("mexp*3",{mexp:5}),"15");
  });
  it('check eval method with two argument when second one is value of constants', function () {
	mexp.addToken([{type:0,show:"mexp",value:function(a){return 5*a;},preced:11,token:"mexp"}]);
    assert.equal(mexp.eval("mexp3"),"15");
  });
  it('check eval method with two argument when second one is token list', function () {
	 assert.equal(mexp.eval("mexp(3)",[{type:0,show:"mexp(",value:function(a){return 5*a;},preced:11,token:"mexp"}]),"15");
  });
  it('Pi', function () {
	 assert.equal(mexp.eval("Pi1,5,n"),"120");
  });
  it('tan5(6+3)', function () {
	 assert.equal(mexp.eval("tan5(6+3)"),"1");
  });
  it('tan(40+5)', function () {
	 assert.equal(mexp.eval("tan(40+5)"),"1");
  });
  it('checks when a 0 is missing in a decimal number', function () {
	 assert.equal(mexp.eval("5*.8"),"4");
  });
  it('checks root function', function () {
	 assert.equal(mexp.eval("root4"),"2");
  });
  it('checks + precedence before number insise parenthesis ', function () {
	 assert.equal(mexp.eval("(-2)"),"-2");
  });
  it('checks multiple allowable operator', function () {
	 assert.equal(mexp.eval("2+++-++-+-+3"),"-1");
	 assert.equal(mexp.eval("2*+3"),"6");
  });
});
describe('These expression will check for types of returned result', function () {
  it('should tell to compllete expression', function () {
    assert.equal(typeof mexp.eval('0'), 'number')
  });
});
describe('These expression will raise error', function () {
  it('should tell to compllete expression', function () {
    assert.equal(mexp.eval("2*").message, "complete the expression")
  });
  it('should warn about multiple operators', function () {
	try{
		mexp.eval("2**3")
	}
	catch(e){
		assert.equal(e.message,"* is not allowed after *")
	}
  });
  it('should warn about multiple operators', function () {
	try{
		mexp.eval("2*Mod*3")
	}
	catch(e){
		assert.equal(e.message,"Mod is not allowed after *")
	}
  });
  it('should warn about operator inside parenthesis', function () {
	try{
		mexp.eval("(+)")
	}
	catch(e){
		assert.equal(e.message,") is not allowed after +")
	}
  });
  it('should warn about operator inside parenthesis', function () {
	try{
		mexp.eval("(+)")
	}
	catch(e){
		assert.equal(e.message,") is not allowed after +")
	}
  });

});
describe('Check autoclose of parenthesis of parser', function () {
  it('should be qual to 14', function () {
    assert.equal(mexp.eval("((2+3*4"),"14");
  });
});
