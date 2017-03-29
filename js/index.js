//Thursday 3/23: Added counter for Sessions (Pomodoros) Completed
//Friday 3/24: Fixed reset button functionality
//Saturday 3/25: Make code more readable
//Sunday 3/26:
//Monday 3/27:

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
	sessionsCompleted: 0,
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
	toggleTimer: function(){
		if (model.activeTimer.isRunning){
			this.stopTimer();
			document.getElementById("toggle").innerHTML = "start";
		}
		else{
			this.startTimer();
			document.getElementById("toggle").innerHTML = "pause";
		}
	},
	resetTimer: function(){
			this.stopTimer();
			model.sessionTimer.resetTime(25);
			model.breakTimer.resetTime(5);
			model.setActiveTimer(model.sessionTimer);
			view.displayTimeLeft(model.activeTimer.seconds);
			view.displayTimerName(model.activeTimer.name);
			view.displaySettings(25,5);
			view.updateSessionCounter(0);
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
				}else{
					this.switchTimers();
				}	
				}.bind(this),1000);
		}
	},
	switchTimers: function(){ //Reset and stop active timer. Then start the other timer.
			if (model.activeTimer.name == "Session"){
						model.sessionsCompleted += 1;
						view.updateSessionCounter(model.sessionsCompleted);
						var sessionLength = document.getElementById("sessionLength").textContent;
						model.activeTimer.resetTime(sessionLength);
						this.stopTimer();
						model.setActiveTimer(model.breakTimer);
			}else if (model.activeTimer.name == "Break"){
						var breakLength = document.getElementById("breakLength").textContent;
						model.activeTimer.resetTime(breakLength);
						this.stopTimer();
						model.setActiveTimer(model.sessionTimer);
			}
			this.startTimer();
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
		if (!model.activeTimer.isRunning && model.sessionTimer.seconds >= 60){
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
		if (!model.activeTimer.isRunning && model.breakTimer.seconds >= 60){
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
	displaySettings: function(sessionLen, breakLen){
		document.getElementById("sessionLength").textContent = sessionLen;
		document.getElementById("breakLength").textContent = breakLen;
		document.getElementById("settings").style.display = "block";
		document.getElementById("settingsButton").style.visibility = "visible";
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
	},
	updateSessionCounter: function(count){
		document.getElementById("counter").textContent = count;
	}
};

controller.createTimers();
//https://www.phpied.com/3-ways-to-define-a-javascript-class/
//https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes