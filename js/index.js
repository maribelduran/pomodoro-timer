const SESSION_TIME = 10;
const BREAK_TIME = 5;
const MAX_SESSIONS = 8;

//Timer class
function Timer(sec,name){
	this.seconds = sec;
	this.secondsLeft = sec;
	this.timeElapsed = 0;
	this.name = name;
	this.isRunning = false;
	this.intervalID = "";
}
//Called when second changes inside the setInterval function
Timer.prototype.updateTimeLeft = function(changeInSec){
	this.secondsLeft += changeInSec
	this.timeElapsed = (this.seconds - this.secondsLeft)/this.seconds;
}
//Called when sessionLength and breakLength settings are changed or reset button is clicked
Timer.prototype.resetTime =function(minutes){
		this.seconds = this.secondsLeft = (minutes * 60);
		this.timeElapsed = 0;
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
		//(model.activeTimer.isRunning) ? this.stopTimer() : this.startTimer(); 
		if (model.activeTimer.isRunning){
			this.stopTimer();
		}
		else{
			this.startTimer();
		}
	},
	resetTimer: function(){
			this.stopTimer();
			model.sessionTimer.resetTime(SESSION_TIME);
			model.breakTimer.resetTime(BREAK_TIME);
			model.setActiveTimer(model.sessionTimer);
			view.displayActiveTimer(model.activeTimer.name, model.activeTimer.secondsLeft);
			view.updateProgressBar(model.activeTimer.timeElapsed);
			view.updateSettings(SESSION_TIME, BREAK_TIME);
			model.sessionsCompleted = 0;
			view.updateSessionCounter(0);
	},
	startTimer: function(){
		if (!model.activeTimer.isRunning && (model.sessionsCompleted < MAX_SESSIONS)){
			view.displayActiveTimer(model.activeTimer.name, model.activeTimer.secondsLeft);
			model.activeTimer.isRunning = true;
			view.updateToggleIcon("start");
			view.updateProgressBar(model.activeTimer.timeElapsed);
			model.activeTimer.intervalID =  setInterval(function(){
				if (model.activeTimer.secondsLeft > 0){
					model.activeTimer.updateTimeLeft(-1);
					view.displayActiveTimer(model.activeTimer.name, model.activeTimer.secondsLeft);
					view.updateProgressBar(model.activeTimer.timeElapsed);
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
		view.updateToggleIcon("pause");
	},
	updateSessionLength: function(value){
		view.displaySessionLength(value);
	},
	updateBreakLength: function(value){
		view.displayBreakLength(value);
	},
	undoSettingUpdates: function(){
		view.updateSettings(Math.floor(model.sessionTimer.seconds/60), Math.floor(model.breakTimer.seconds/60));
	},
	updateSettings: function(){
		this.stopTimer();
		var sessionLength = document.getElementById("sessionLength").textContent;
		var breakLength = document.getElementById("breakLength").textContent;
		model.sessionTimer.resetTime(sessionLength);
		model.breakTimer.resetTime(breakLength);
		view.displayActiveTimer(model.activeTimer.name, model.activeTimer.seconds);
		view.updateProgressBar(model.activeTimer.timeElapsed);
	}
};

var view = {
	circleIndicator: {
		0: "session0",
		1: "session1",
		2: "session2",
		3: "session3",
		4: "session4",
		5: "session5",
		6: "session6",
		7: "session7"
	},
	displayActiveTimer: function(name, seconds){
		document.getElementById("timerName").innerHTML = name;
		document.getElementById("timer").innerHTML  = this.secondsToMs(seconds);

	},
	updateProgressBar: function(timeElapsed){
		circle.set(timeElapsed);
	},
	updateToggleIcon: function(status){
		var toggleIconClasses = document.getElementById("toggleIcon").classList;
		if (status == "pause"){
			toggleIconClasses.remove("fa-pause");
			toggleIconClasses.add('fa-play');
		}else{
			toggleIconClasses.remove("fa-play");
			toggleIconClasses.add('fa-pause');
		}
	},
	hideSettings: function(){
		document.getElementById("settings").style.visibility = "hidden";
	},
	updateSettings: function(sessionLen, breakLen){
		sesionSlider.setValue(sessionLen, true);
		breakSlider.setValue(breakLen, true);
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

		if(count === 0){
			for (var id in this.circleIndicator){
				document.getElementById(this.circleIndicator[id]).classList.remove("completed");
			}
		}else{
			var circleClasses = document.getElementById(this.circleIndicator[count-1]).classList;
			circleClasses.add("completed");
		}
	},
	setUpEventListeners: function(){
		var resetBtn = document.getElementById("reset");
  	var cancelBtn = document.getElementById("modal-cancel");
  	var saveChangesBtn = document.getElementById("modal-save");
  	
  	resetBtn.addEventListener("click", function(){
   		controller.resetTimer();
    });

    cancelBtn.addEventListener("click", function(){
   		controller.undoSettingUpdates();
    });

    saveChangesBtn.addEventListener("click", function(){
   		controller.updateSettings();
    });
  }
};

controller.createTimers();
view.setUpEventListeners();

var sesionSlider = new Slider("#sessionInput");
sesionSlider.on("slide", function(sliderValue) {
	controller.updateSessionLength(sliderValue);
});
sesionSlider.on("slideStop", function(sliderValue) {
	controller.updateSessionLength(sliderValue);
});

var breakSlider = new Slider("#breakInput");
breakSlider.on("slide", function(sliderValue) {
	controller.updateBreakLength(sliderValue);
});

breakSlider.on("slideStop", function(sliderValue) {
	controller.updateBreakLength(sliderValue);
});

var circle = new ProgressBar.Circle('#progressBarContainer', {
	color: '#FC6E6E',
	strokeWidth: 4,
	//duration: (2 * 60000),
	trailColor: '#D2D3D7',
	trailWidth: 4
  });

//https://kimmobrunfeldt.github.io/progressbar.js/