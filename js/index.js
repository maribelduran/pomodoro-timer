const SESSION_TIME = 25;
const BREAK_TIME = 5;

//Timer class
function Timer(sec,name){
	this.seconds = sec;
	this.name = name;
	this.isRunning = false;
	this.intervalID = "";
}

Timer.prototype.updateTime = function(minutes){
	this.seconds = parseInt(minutes) * 60;
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
		model.setSessionTimer(SESSION_TIME, "Session");
		model.setBreakTimer(BREAK_TIME, "Break");
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
			model.sessionTimer.resetTime(SESSION_TIME);
			model.breakTimer.resetTime(BREAK_TIME);
			model.setActiveTimer(model.sessionTimer);
			view.displayActiveTimer(model.activeTimer.name, model.activeTimer.seconds);
			//view.displaySettings(25,5);
			sesionSlider.setValue(SESSION_TIME, true);
			breakSlider.setValue(BREAK_TIME, true);
			view.updateSessionCounter(0);
	},
	startTimer: function(){
		if (!model.activeTimer.isRunning){
			view.displayActiveTimer(model.activeTimer.name, model.activeTimer.seconds);
			model.activeTimer.isRunning = true;
			model.activeTimer.intervalID =  setInterval(function(){
				if (model.activeTimer.seconds > 0){
					model.activeTimer.seconds --;
					view.displayActiveTimer(model.activeTimer.name, model.activeTimer.seconds);
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
	updateSessionLength: function(value){
		view.displaySessionLength(value);
	},
	updateBreakLength: function(value){
			view.displayBreakLength(value);
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
	},
	undoSettingUpdates: function(){
		var currentSessionTime = view.secondsToMs(model.sessionTimer.seconds).split(":")[0];
		var currentbreakTime = view.secondsToMs(model.breakTimer.seconds).split(":")[0];
		sesionSlider.setValue(currentSessionTime, true);
		breakSlider.setValue(currentbreakTime, true);
		view.hideSettings();	
	},
	updateSettings: function(){
		this.stopTimer();
		var sessionLength = document.getElementById("sessionLength").textContent;
		var breakMinuteInput = document.getElementById("breakLength").textContent;
		model.sessionTimer.updateTime(sessionLength);
		model.breakTimer.updateTime(breakMinuteInput);
		view.displayActiveTimer(model.activeTimer.name, model.activeTimer.seconds);
		this.toggleSettings();
	}
};

var view = {
	displayActiveTimer: function(name, seconds){
		document.getElementById("timerName").innerHTML = name;
		document.getElementById("timer").innerHTML  = this.secondsToMs(seconds);
	},
	hideSettings: function(){
		document.getElementById("settings").style.visibility = "hidden";
	},
	displaySettings: function(sessionLen, breakLen){
		document.getElementById("sessionLength").textContent = sessionLen;
		document.getElementById("breakLength").textContent = breakLen;
		document.getElementById("settings").style.visibility = "visible";
	},
	displaySessionLength: function(minutes){
		document.getElementById("sessionLength").textContent = minutes;
	},
	displayBreakLength: function(minutes){
		document.getElementById("breakLength").textContent = minutes;
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

var sesionSlider = new Slider("#sessionInput");
sesionSlider.on("slide", function(sliderValue) {
	controller.updateSessionLength(sliderValue);
});

var breakSlider = new Slider("#breakInput");
breakSlider.on("slide", function(sliderValue) {
	controller.updateBreakLength(sliderValue);
});
//https://github.com/seiyria/bootstrap-slider
//https://www.phpied.com/3-ways-to-define-a-javascript-class/
//https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes