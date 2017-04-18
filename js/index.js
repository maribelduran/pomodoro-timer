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
//Called when time changes
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
		view.displaySessionIndicators(MAX_SESSIONS);
	},
	toggleTimer: function(){
		(model.activeTimer.isRunning) ? this.stopTimer() : this.startTimer(); 
	},
	resetTimer: function(){
			this.stopTimer();
			model.sessionTimer.resetTime(SESSION_TIME);
			model.breakTimer.resetTime(BREAK_TIME);
			model.setActiveTimer(model.sessionTimer);
			view.displayActiveTimer(model.activeTimer.name, model.activeTimer.secondsLeft, model.activeTimer.timeElapsed);
			view.updateSettings(SESSION_TIME, BREAK_TIME);
			model.sessionsCompleted = 0;
			view.updateSessionCounter(0);
	},
	startTimer: function(){
		if (!model.activeTimer.isRunning && (model.sessionsCompleted < MAX_SESSIONS)){
			view.displayActiveTimer(model.activeTimer.name, model.activeTimer.secondsLeft, model.activeTimer.timeElapsed);
			model.activeTimer.isRunning = true;
			view.updateToggleIcon("start");
			model.activeTimer.intervalID =  setInterval(function(){
				if (model.activeTimer.secondsLeft > 0){
					model.activeTimer.updateTimeLeft(-1);
					view.displayActiveTimer(model.activeTimer.name, model.activeTimer.secondsLeft, model.activeTimer.timeElapsed);
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
		view.displayActiveTimer(model.activeTimer.name, model.activeTimer.seconds, model.activeTimer.timeElapsed);
	}
};

var view = {
	sesionSlider: new Slider("#sessionInput"),
	breakSlider: new Slider("#breakInput"),
	circle: new ProgressBar.Circle('#progressBarContainer',{
		color: '#FC6E6E',
		strokeWidth: 4,
		trailColor: '#D2D3D7',
		trailWidth: 4
  }),
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
	displayActiveTimer: function(name, secondsLeft, timeElapsed){
		document.getElementById("timerName").innerHTML = name;
		document.getElementById("timer").innerHTML  = this.secondsToMs(secondsLeft);
		this.updateProgressBar(timeElapsed);
	},
	updateProgressBar: function(timeElapsed){
		this.circle.set(timeElapsed);
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
	updateSettings: function(sessionLen, breakLen){
		this.sesionSlider.setValue(sessionLen, true);
		this.breakSlider.setValue(breakLen, true);
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
	displaySessionIndicators: function(sessions){		
		var left_well = document.getElementsByClassName("left-well");
		var right_well = document.getElementsByClassName("right-well");

		//create a boostrap row and append to left-well
		var row = document.createElement("div");
		row.className = "row";
		left_well[0].appendChild(row);

		//create a boostrap row and append to right-well
		var row2 = document.createElement("div");
		row2.className = "row";
		right_well[0].appendChild(row2);

		for (var i=0; i<sessions; i++){
			//create circle element
			var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
			circle.id = this.circleIndicator[i];
			circle.setAttributeNS(null,"cx", "20");
			circle.setAttributeNS(null,"cy", "20");
			circle.setAttributeNS(null,"r", "8");
			circle.setAttributeNS(null,"fill", "#D2D3D7");

			//append circle to svg element
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.appendChild(circle);

			//create a boostrap column of size xs-3 and append svg
			var col_xs_3 = document.createElement("div");
			col_xs_3.className = "col-xs-3";
			col_xs_3.classList.add("sessIndicators");
			col_xs_3.appendChild(svg);

			//attach the elements created to left-well 
			if (i<4){
				row.appendChild(col_xs_3);
				//attach the elements created to right-well 
			}else{
			row2.appendChild(col_xs_3);
			}
		}
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
  	var toggleBtn = document.getElementById("toggleTimer");

  	resetBtn.addEventListener("click", function(){
   		controller.resetTimer();
    });

    cancelBtn.addEventListener("click", function(){
   		controller.undoSettingUpdates();
    });

    saveChangesBtn.addEventListener("click", function(){
   		controller.updateSettings();
    });
    
    toggleBtn.addEventListener("click", function(){
   		controller.toggleTimer();
    });
    
		this.sesionSlider.on("slide", function(sliderValue){
			controller.updateSessionLength(sliderValue);
		});

		this.sesionSlider.on("slideStop", function(sliderValue){
			controller.updateSessionLength(sliderValue);
			});

		this.breakSlider.on("slide", function(sliderValue){
			controller.updateBreakLength(sliderValue);
		});

		this.breakSlider.on("slideStop", function(sliderValue){
			controller.updateBreakLength(sliderValue);
		});
  }
};

controller.createTimers();
view.setUpEventListeners();