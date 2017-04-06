//Timer class
function Timer(sec,name){
	this.seconds = sec;
	this.name = name;
	this.isRunning = false;
	this.intervalID = "";
}

Timer.prototype.addMin = function(){
	this.seconds += 60;
}
Timer.prototype.reduceMin = function(){
	//console.log(this.seconds);
	this.seconds -= 60;
}
Timer.prototype.resetTime =function(minutes){
		this.seconds = minutes * 60;

}

//model
var model = {
	activeTimer: "",
	sessionTimer: {},
	breakTimer: {},
	sessionsCompleted: 0,
	setSessionTimer: function(min, name){
		this.sessionTimer = new Timer(parseInt(min) * 60, name);
	},
	setBreakTimer: function(min, name){
		this.breakTimer = new Timer(parseInt(min) * 60, name);
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
	//Reset and stop active timer. Then start the other timer.
	switchTimers: function(){ 
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
		//create a view method
		document.getElementById("toggle").innerHTML = "start";
	},
	decSessionTime: function(value){
		if (!model.activeTimer.isRunning && model.sessionTimer.seconds > 60){
			//model.sessionTimer.reduceMin();
			view.displaySessionTime(value);
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
	},
	toggleSettings: function(){
		var settings = document.getElementById("settings");
		if (settings.style.visibility === "visible"){
			view.hideSettings();
		}
		else{
			var sessionMinuteInput = document.getElementById("sessionLength").textContent;
			var breakMinuteInput = document.getElementById("breakLength").textContent;
			view.displaySettings(sessionMinuteInput,breakMinuteInput);
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
		document.getElementById("settings").style.visibility = "hidden";
	},
	displaySettings: function(sessionLen, breakLen){
		document.getElementById("sessionLength").textContent = sessionLen;
		document.getElementById("breakLength").textContent = breakLen;
		document.getElementById("settings").style.visibility = "visible";
	},
	displaySessionTime: function(time){
		//var m = Math.floor(seconds/ 60);
		document.getElementById("sessionLength").textContent = time;
		//document.getElementById("timer").textContent = m;
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

//https://github.com/seiyria/bootstrap-slider
controller.createTimers();
// With JQuery
$('#ex1').slider({
	formatter: function(value) {
		controller.decSessionTime(value);
		return value;
		//return 'Current value: ' + value;
	}
});
//https://www.phpied.com/3-ways-to-define-a-javascript-class/
//https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes