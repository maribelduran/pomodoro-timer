//Using object literal to define a timer class
//https://www.phpied.com/3-ways-to-define-a-javascript-class/
//https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes

//timer class
function timer(sec,name){
	this.seconds = sec;
	this.name = name;
	this.isRunning = false;
	this.intervalID = "";
	this.addMin = function (){
		this.seconds += 60;
		this.getTime();
	};
	this.reduceMin = function(){
		this.seconds -= 60;
		this.getTIme();
	}
}
//model
var model = {
	activeTimer: "",
	sessionTimer: {},
	breakTimer: {},
	setSessionTimer: function(min, name){
		this.sessionTimer = new timer(parseInt(min) * 60, name);
		console.log(this.sessionTimer);
	},
	setBreakTimer: function(min, name){
		this.breakTimer = new timer(parseInt(min) * 60, name);
			console.log(this.breakTimer);
	},
	setActiveTimer: function(timer){
		this.activeTimer = timer;
		console.log("Current active timer is: ", this.activeTimer.name);
	}
};