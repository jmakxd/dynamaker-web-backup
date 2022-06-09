var onOne = false;
var err = "";
function settingsForNewMapScene() {
	this.banKeyboard = true;
	var breath = 0;
	musicName.value = musicFileCtrl.name.substr(0, musicFileCtrl.name.length - 4);
	barpmName.value = 0;
	beatpmName.value = 0;
	offsetSecName.value = 0;
	offsetBarName.value = 0;
	musicName.style.display = "inline";
	beatpmName.style.display = "inline";
	barpmName.style.display = "inline";
	offsetSecName.style.display = "inline";
	offsetBarName.style.display = "inline";
	hardshipName.style.display = "inline";
	leftName.style.display = "inline";
	rightName.style.display = "inline";
	CMap = {
		"-xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
	    "-xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
	    "m_path": false,
	    "m_barPerMin": 120,
	    "m_timeOffset": 0,
	    "m_leftRegion": "MIXER",
	    "m_rightRegion": "PAD",
	    "m_mapID": false,
	    "m_notes": {
	    	"m_notes": {
	    		"CMapNoteAsset" : []
	    	}
	    },
	    "m_notesLeft": {
	    	"m_notes": {
	    		"CMapNoteAsset" : []
	    	}
	    },
	    "m_notesRight": {
	    	"m_notes": {
	    		"CMapNoteAsset" : []
	    	}
	    }
	};
}


settingsForNewMapScene.prototype = {
	down: function (coordinate) {
		if (err == "" && onOne) {
			musicName.style.display = "none";
			beatpmName.style.display = "none";
			barpmName.style.display = "none";
			offsetSecName.style.display = "none";
			offsetBarName.style.display = "none";
			hardshipName.style.display = "none";
			leftName.style.display = "none";
			rightName.style.display = "none";
			
			CMap.m_path = musicName.value;
			CMap.m_mapID = "_map_"+musicName.value+"_"+hardshipNameToShort[hardshipName.value];
			CMap.m_leftRegion = leftName.value;
			CMap.m_rightRegion = rightName.value;
			CMap.m_barPerMin = barpmName.value;
			CMap.m_timeOffset = offsetBarName.value;
			
			audioLoad(musicUrl, function(audio){
				musicCtrl = audio;
				musicCtrl.goplay = function() {
					if (musicCtrl.ended) {
						resetCS();
						noteDownHit = [];
						noteLeftHit = [];
						noteRightHit = [];
					}
					if (showCS) {
						musicPlayButton.focus();
						musicPlayButton.click();
						return;
					}
					if (editMode) {
						clearHit();
					}
					if (musicCtrl) { 
						musicPlayButton.focus();
						musicPlayButton.click();
					}
				}
				loaded++;
			});
			switch (CMap.m_mapID.substr(-1, 1)) {
				case "C":
					hardship = "CASUAL";
					hardshipColor = "#8F8";
					break;
					
				case "N":
					hardship = "NORMAL";
					hardshipColor = "#88F";
					break;
					
				case "H":
					hardship = "HARD";
					hardshipColor = "#F44";
					break;
					
				case "M":
					hardship = "MEGA";
					hardshipColor = "#F4F";
					break;
		
				case "G":
					hardship = "GIGA";
					hardshipColor = "#888";
					break;
					
				case "U":
					hardship = "CUSTOM";
					hardshipColor = "#FFF";
					break;
			}
			typeL = CMap.m_leftRegion;
			typeR = CMap.m_rightRegion;
			barpm = CMap.m_barPerMin;
			spu = 60 / CMap.m_barPerMin;
			spq = 60 / CMap.m_barPerMin / 32;
			offsetBar = Number(CMap.m_timeOffset);
			offsetSec = offsetBar/(barpm/60) + userOffsetSec;
			isMixerL = CMap.m_leftRegion == "MIXER";
			isMixerR = CMap.m_rightRegion == "MIXER";
			noteDown = [];
			noteLeft = [];
			noteRight = [];
			totalNote = 0;
			loaded++;
			scene = mainPlayView;
		}
	},
	up: function(coordinate) {
		
	},
	move: function(coordinate) {
		onOne = false;
		if (inArea(coordinate, windowWidth * 0.11, windowHeight * 0.28, windowWidth * 0.3, windowHeight * 0.1)) {
			onOne = true;
		}
		
	},
	refresh: function() {
		err = "";
		if (window) {
			if (! musicName || musicName.value == "") {
				err += "Music name shouldn't be empty; "
			}
			if (! beatpmName || isNaN(Number(beatpmName.value)) || Number(beatpmName.value) <= 0) {
				err += "Illigal BeatPerMinute; "
			}
			if (! barpmName || isNaN(Number(barpmName.value)) || Number(barpmName.value) <= 0) {
				err += "Illigal BarPerMinute; "
			}
			if (! offsetSecName || isNaN(Number(offsetSecName.value))) {
				err += "Illigal offset(sec); "
			}
			if (! offsetBarName || isNaN(Number(offsetBarName.value))) {
				err += "Illigal offset(bar); "
			}
		}
		
		ctx.font = "32px Dynamix";
		ctx.textAlign = "center";
		ctx.textBaseline = "alphabetic";
		ctx.fillStyle = "red";
		ctx.fillText(err, windowWidth/2, windowHeight*0.9);
		ctx.fillStyle = "#0FF";
		ctx.textAlign = "left";
		
		drawBox(ctx, windowWidth * 0.11, windowHeight * 0.28, windowWidth * 0.3, windowHeight * 0.1, 0.8, 10);
		ctx.fillStyle = "#0FF";
		if (onOne) {
			ctx.fillRect(windowWidth * 0.11, windowHeight * 0.28, windowWidth * 0.3, windowHeight * 0.1);
			ctx.fillStyle = "#000";
			ctx.fillText("START", windowWidth * 0.23, windowHeight * 0.34);
		}
		else {
			ctx.fillText("START", windowWidth * 0.23, windowHeight * 0.34);
		}
		ctx.fillStyle = "#0FF";
		ctx.fillText("MUSIC NAME", windowWidth * 0.11, windowHeight * 0.24);
		ctx.fillText("DIFFICULTY", windowWidth * 0.11, windowHeight * 0.45);
		ctx.fillText("LEFT SIDE", windowWidth * 0.11, windowHeight * 0.635);
		ctx.textAlign = "right";
		ctx.fillText("BeatPerMinute", windowWidth * 0.71, windowHeight * 0.263);
		ctx.fillText("BarPerMinute", windowWidth * 0.88, windowHeight * 0.263);
		ctx.fillText("OFFSET (sec)", windowWidth * 0.71, windowHeight * 0.45);
		ctx.fillText("OFFSET (bar)", windowWidth * 0.88, windowHeight * 0.45);
		ctx.fillText("RIGHT SIDE", windowWidth * 0.88, windowHeight * 0.635);
		

		ctx.fillStyle = "#0FF";
		ctx.font = "25px Dynamix";
		ctx.textAlign = "center";
		ctx.fillText("Version 1.0", windowWidth * 0.5, windowHeight - 35);
		
		this.breath = Math.abs(frameCount - 54) / 54;
		ctx.fillStyle = rgba(0, 255, 255, this.breath * 0.1 + 0.2);
		
//		ctx.font = "50px Dynamix";
//		ctx.fillText("presented by omegaPiGame.com", windowWidth * 0.3, windowHeight * 0.4);
		
		ctx.font = "180px Dynamix";
		ctx.textAlign = "center";
		ctx.fillRect(windowWidth * 0.09, windowHeight * 0.2, windowWidth*0.7, 7);
		ctx.fillRect(windowWidth * 0.09, windowHeight * 0.445, windowWidth*0.3, 7);
		ctx.fillRect(windowWidth * 0.09, windowHeight * 0.63, windowWidth*0.3, 7);
		ctx.fillRect(windowWidth * 0.6, windowHeight * 0.26, windowWidth*0.3, 7);
		ctx.fillRect(windowWidth * 0.6, windowHeight * 0.445, windowWidth*0.3, 7);
		ctx.fillRect(windowWidth * 0.6, windowHeight * 0.63, windowWidth*0.3, 7);
		ctx.fillText("DynaMaker by omegaPi", windowWidth * 0.5 + windowWidth*(-1 + 2*(absFrameCount%50/50)), windowHeight*0.03);
		ctx.fillText("DynaMaker by omegaPi", windowWidth * 0.5 + windowWidth*(-1 + 2*((absFrameCount + 25)%50/50)), windowHeight*0.03);
		ctx.fillText("DynaMaker by omegaPi", windowWidth * 0.5 + windowWidth*(1 - 2*(absFrameCount%50/50)), windowHeight*1.05);
		ctx.fillText("DynaMaker by omegaPi", windowWidth * 0.5 + windowWidth*(1 - 2*((absFrameCount + 25)%50/50)), windowHeight*1.05);
		
		
		ctx.fillStyle = rgba(0, 255, 0, 1);
		if (mainMouse.coordinate && isFullScreen) {
			ctx.fillRect(mainMouse.coordinate.x - 7, mainMouse.coordinate.y - 7, 15,15);
			//ctx.fillText(mainMouse.coordinate.x + "," + mainMouse.coordinate.y, mainMouse.coordinate.x, mainMouse.coordinate.y);
		}
		
		
	}
}
