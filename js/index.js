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
	},
	setBreakTimer: function(min, name){
		this.breakTimer = new timer(parseInt(min) * 60, name);
	},
	setActiveTimer: function(timer){
		this.activeTimer = timer;
	}
};

//controller
var controller = {
	createTimers: function(){
		var sessionMinuteInput = document.getElementById("sessionLength").textContent;
		var breakMinuteInput = document.getElementById("breakLength").textContent;
		model.setSessionTimer(sessionMinuteInput, "Session");
		model.setBreakTimer(breakMinuteInput, "Break");
		model.setActiveTimer(model.sessionTimer);
	},
	//Will use toggleTimer when I have a single button that changes between Start to Stop
	toggleTimer: function(){
		if (model.activeTimer.isRunning){
			this.stopTimer();
			document.getElementById("toggle").innerHTML = "start";
		}
		else{
			this.startTimer();
			document.getElementById("toggle").innerHTML = "stop";
		}
	},
	resetTimer: function(){
			this.stopTimer();
			model.sessionTimer.resetTime(25);
			model.breakTimer.resetTime(5);
			view.displayTimeLeft(model.activeTimer.seconds);
			document.getElementById("sessionLength").textContent = 25;
			document.getElementById("breakLength").textContent = 5;

	},
	startTimer: function(){
		if (!model.activeTimer.isRunning){
			view.displayTimeLeft(model.activeTimer.seconds);
			view.displayTimerName(model.activeTimer.name);
			view.hideSettings();
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
						model.setactiveTimer(model.breakTimer);
						this.startTimer();
					}
					else if (model.activeTimer.name == "Break"){
						var breakLength = document.getElementById("breakLength").textContent;
						model.activeTimer.resetTime(breakLength);
						this.stopTimer();
						model.setactiveTimer(model.sessionTimer);
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
		if (!model.activeTimer.isRunning && model.sessionTimer.seconds > 60){
			model.sessionTimer.reduceMin();
			view.displaySessionTime(model.sessionTimer.seconds);
		}
	},
	addSessionTime: function(){
		if (!model.activeTimer.isRunning && model.sessionTimer.seconds > 60){
			model.sessionTimer.addMin();
			view.displaySessionTime(model.sessionTimer.seconds);
		}
	},
	decbreakTime: function(){
		if (!model.activeTimer.isRunning && model.breakTimer.seconds > 60){
			model.breakTimer.reduceMin();
			view.displayBreakTime(model.breakTimer.seconds);
		}
	},
	addbreakTime: function(){
		if (!model.activeTimer.isRunning && model.breakTimer.seconds > 60){
			model.breakTimer.addMin();
			view.displayBreakTime(model.breakTimer.seconds);
		}
	}
};

var view = {
	displayTimeLeft: function(seconds){
		var timer = document.getElementById("timer");
		timer.innerHTML  = this.secondsToMs(seconds);
	},
	displayTimerName: function(name){
		var timerName = document.getElementById("timerName");
		timerName.innerHTML = name;

	},
	hideSettings: function(){
		document.getElementById("settings").style.display = "none";
	},
	displaySessionTime: function(seconds){
		var m = Math.floor(seconds/ 60);
		document.getElementById("sessionLength").textContent = m;
		document.getElementById("timer").textContent = m;
	},
	displayBreakTime: function(seconds){
		var m = Math.floor(seconds/ 60);
		document.getElementById("breakLength").textContent = m;
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

//https://www.phpied.com/3-ways-to-define-a-javascript-class/
//https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes