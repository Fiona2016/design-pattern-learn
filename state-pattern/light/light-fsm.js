// 自行实现fsm
var FSM = { 
  off: {
    buttonWasPressed: function(){
      console.log( '关灯' ); 
      this.button.innerHTML = '下一次按我是开灯'; 
      this.currState = FSM.on;
    }},
  on: {
    buttonWasPressed: function(){
      console.log( '开灯' ); 
      this.button.innerHTML = '下一次按我是关灯'; 
      this.currState = FSM.off;
    }
  }
};
var delegate = function( client, delegation ){ 
  return {
    buttonWasPressed: function(){ // 将客户的操作委托给 delegation 对象 5 
      return delegation.buttonWasPressed.apply( client, arguments );
    }
  }
};
var Light = function(){
  this.offState = delegate( this, FSM.off );
  this.onState = delegate( this, FSM.on );
  this.currState = this.offState; // 设置初始状态为关闭状态 this.button = null;
};
Light.prototype.init = function(){
  var button = document.createElement( 'button' ),
  self = this;
  button.innerHTML = '已关灯';
  this.button = document.body.appendChild( button );
  this.button.onclick = function(){ 
    self.currState.buttonWasPressed();
  } 
};

var light = new Light(); 
light.init();


// https:// github.com/jakesgordon/ javascript-state-machine
var fsm = StateMachine.create({
  initial: 'off',
  events: [
    { name: 'buttonWasPressed', from: 'off', to: 'on' }, 
    { name: 'buttonWasPressed', from: 'on', to: 'off' }], 
  callbacks: {
    onbuttonWasPressed: function( event, from, to ){ 
      console.log( arguments );
    } 
  },
  error: function( eventName, from, to, args, errorCode, errorMessage ) {
    self.currState.buttonWasPressed();
    console.log( arguments ); // 从一种状态试图切换到一种不可能到达的状态的时候
  }
});
button.onclick = function(){ 
  fsm.buttonWasPressed();
}