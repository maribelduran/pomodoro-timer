//https://www.phpied.com/3-ways-to-define-a-javascript-class/
//https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes

//Da7 77: Automatically switches between a Break and Session when time is up.
//

//timer class
function timer(sec,name){
	this.seconds = sec;
	this.name = name;
	this.isRunning = false;
	this.intervalID = "";
	this.addMin = function (){
		this.seconds += 60;
	};
	this.reduceMin = function(){
		this.seconds -= 60;
		console.log(this.seconds);
	},
	this.resetTime = function(minutes){
		this.seconds = minutes * 60;
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
	}
};

//controller
//Once the timer has started, you can not update the SessionLength or BreakLength.
var controller = {
	createTimers: function(){
		var sessionMinuteInput = document.getElementById("timer").textContent;
		var breakMinuteInput = 5;
		model.setSessionTimer(sessionMinuteInput, "Session");
		model.setBreakTimer(breakMinuteInput, "Break");
		model.setActiveTimer(model.sessionTimer);
	},
	//Will use toggleTimer when I have a single button that changes between Start to Stop
	toggleTimer: function(){
	},
	startTimer: function(){
		if (!model.activeTimer.isRunning){
			//want app to show initial time (i.e 25:00 should show first instead of 24:59);
			view.displayTimeLeft(model.activeTimer.seconds);
			view.displayTimerName(model.activeTimer.name);
			model.activeTimer.isRunning = true;
			model.activeTimer.intervalID =  setInterval(function(){
				if (model.activeTimer.seconds > 0){
					model.activeTimer.seconds --;
					view.displayTimeLeft(model.activeTimer.seconds);
				}else{ //Reset and stop active timer. Then start the other timer.
					if (model.activeTimer.name == "Session"){
						var sessionLength = document.getElementById("sessionLength").textContent;
						model.activeTimer.resetTime(sessionLength);
						this.stopTimer();
						model.activeTimer = model.breakTimer;
						this.startTimer();
					}
					else if (model.activeTimer.name == "Break"){
						var breakLength = document.getElementById("breakLength").textContent;
						model.activeTimer.resetTime(breakLength);
						this.stopTimer();
						model.activeTimer = model.sessionTimer;
						this.startTimer();
					}
				}	
				}.bind(this),1000);
		}
	},
	stopTimer: function(){
		clearInterval(model.activeTimer.intervalID);
		model.activeTimer.isRunning = false;
	},
	decSessionTime: function(){
		if (!(model.sessionTimer.isRunning || model.breakTimer.isRunning) && model.sessionTimer.seconds > 60){
			model.sessionTimer.reduceMin();
			view.displaySessionTime(model.sessionTimer.seconds);
		}
	}
};

var view = {
	displayTimeLeft: function(seconds){
		var time = this.secondsToMs(seconds);
		var timeElement = document.getElementById("timer");
		timeElement.innerHTML  = time;
	},
	displayTimerName: function(name){
		var timerName = document.getElementById("timerName");
		timerName.innerHTML = name;

	},
	displaySessionTime: function(seconds){
		var m = Math.floor(seconds/ 60);
		document.getElementById("sessionLength").textContent = m;
		document.getElementById("timer").textContent = m;


	},
	secondsToMs: function(sec){
			var m = Math.floor(sec / 60);
			var s = sec % 60;
			m = (m.toString().length == 1) ? "0" + m: m;
			s = (s.toString().length == 1) ? "0" + s: s;
			return (m + ":" + s);
	}
};

controller.createTimers();