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

//controller
//Once the timer has started, you can not update the SessionLength or BreakLength.
var controller = {
	createTimers: function(){
		var sessionMinuteInput = document.getElementById("timer").textContent;
		var sessionName = "New Task";
		var breakMinuteInput = 5;
		model.setSessionTimer(sessionMinuteInput, sessionName);
		model.setBreakTimer(breakMinuteInput, "Break");
		model.setActiveTimer(model.sessionTimer);
	},
	//Will use toggleTimer when I have a single button that changes between Start to Stop
	toggleTimer: function(){
	},
	startTimer: function(){
		if (!model.activeTimer.isRunning){
			model.activeTimer.isRunning = true;
			model.activeTimer.intervalID =  setInterval(function(){
				//if seconds == 0, then we want to stop current timer and then start
				//start the break session.
				//var startBreakSession();
				if (model.sessionTimer.seconds > 0){
					model.sessionTimer.seconds --;
					view.updateTimeLeft(model.sessionTimer.seconds);
				}else{
					//Reset current active timer
					//stop current active timer
					//make the non active timer, active and start running.
					controller.stopTimer();
				}	
				}, 1000);
		}
	},
	stopTimer: function(){
		//can you resume an interval ID after it has been cleared?
		clearInterval(model.activeTimer.intervalID);
		model.activeTimer.isRunning = false;
		console.log(model.activeTimer.intervalID);
	},
};

var view = {
	updateTimeLeft: function(seconds){
		var time = this.secondsToMs(seconds);
		var timeElement = document.getElementById("timer");
		timeElement.innerHTML  = time;
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