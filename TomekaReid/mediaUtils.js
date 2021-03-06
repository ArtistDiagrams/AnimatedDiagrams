/**
puts a set of flat divs over your page for managing media.
and sets up the globe.

User might want to:
- draw on different/multiple scenes
- pre-process, post-process textures on each frame
- add their own icons

**/ 
function mediaUtils(scene, camera, stills, videos, 
	   mediaListContainerId, cameraControlsContainerId, videoControlsContainerId,
       onSpaceBarClick) {
	var that = this;
	this.stills = stills;
	this.videos = videos;
	this.mediaListContainerId = mediaListContainerId;
	this.cameraControlsContainerId = cameraControlsContainerId;
	this.videoControlsContainerId = videoControlsContainerId;

	this.camera = camera;
	this.scene = scene;

	this.video = document.getElementById("video");
	this.videoTexture = undefined; 
	this.videoSource = "";
    this.videoDisplayed = false;
    this.rotateYAmount = 0;
    this.rotateXAmount = 0;
    this.FOV = 90;
    this.onSpaceBarClick = onSpaceBarClick;
    this.material = new THREE.MeshNormalMaterial();
    this.geoIndex = 0;

    this.controlPanelVisible = true;
	document.body.onkeyup = function(e){
        if(e.keyCode == 32) {
            that.toggleControlPanel();
            if (that.onSpaceBarClick != undefined) that.onSpaceBarClick();
        }
    };

    this.showToast = function(message, ms) {
        var options = {
            settings: {
                duration: ms
            }
        };        
        this.toast = new iqwerty.toast.Toast(message, options);
    };

    this.initMediaUtils = function() {
        that.toggleView(0);
	    that.initVideo();
	    that.toggleControlPanel();
	    that.setupMediaIcons();
	    that.setupCameraControlIcons();
	    that.setupVideoControlIcons();
        that.toggleVideoControls();
//        that.updateSkyDomeForFileName('uv.jpg');
        //that.updateSkyDomeForFileName(myTextures[0]);
        
        that.setInitialCameraPosition();
	};
    this.setInitialCameraPosition = function() {
        that.camera.position.x = -1; that.camera.position.y = 0.0; that.camera.position.z = 0;   
    };
    this.setupMediaIcons = function() {
        var textureListHTML = document.getElementById(that.mediaListContainerId).innerHTML;
        for (var i = 0; i < myTextures.length; i++)
            textureListHTML += "<span id='textureSelector_xxx' class='showhide tselector'>xxx</span>".replace(/xxx/g, myTextures[i]);

        for (var i = 0; i < myVideos.length; i++)
            textureListHTML += "<span id='textureSelector_xxx' class='showhide vselector'>xxx</span>".replace(/xxx/g, myVideos[i]);
        
        document.getElementById(that.mediaListContainerId).innerHTML = textureListHTML;

        $('.tselector').click(that.updateSkyDome);
        $('.vselector').click(that.updateVideo);
    };
    this.setupVideoControlIcons = function() {
    	var container = document.getElementById(that.videoControlsContainerId);
    	appendSingleIcon(container, 'videoControlIcon', 'rewind', 'Video Back', that.video_rewind);
    	appendSingleIcon(container, 'videoControlIcon', 'play', 'Video Play', that.video_play);
    	appendSingleIcon(container, 'videoControlIcon', 'stop', 'Video Stop', that.video_stop);
    	appendSingleIcon(container, 'videoControlIcon', 'ff', 'Video Forward', that.video_ff);
    	appendSingleIcon(container, 'videoControlIcon', 'replay', 'Video Restart', that.video_restart);
    }
    this.setupCameraControlIcons = function() {
    	var container = document.getElementById(that.cameraControlsContainerId);
    	appendSingleIcon(container, 'cameraControlIcon', 'left', 'Camera Left', that.cameraLeft);
    	appendSingleIcon(container, 'cameraControlIcon', 'up', 'Camera Up', that.cameraUp);
    	appendSingleIcon(container, 'cameraControlIcon', 'down', 'Camera Down', that.cameraDown);
    	appendSingleIcon(container, 'cameraControlIcon', 'right', 'Camera Right', that.cameraRight);
    	appendSingleIcon(container, 'cameraControlIcon', 'stop', 'Camera Stop', that.cameraStop);
        appendSingleIcon(container, 'cameraControlIcon', 'flipCamera', 'Flip Camera', that.flipCamera);
        appendSingleIcon(container, 'cameraControlIcon', 'fovNarrow', 'Smaller Viewport', that.narrowFOV);
        appendSingleIcon(container, 'cameraControlIcon', 'fovWide', 'Wider Viewport', that.widerFOV);
    }
    function appendSingleIcon(containerEl, style, png, title, callback) {
    	var el;
    	el = document.createElement('span');
    	el.innerHTML = "<img src='icons/xxx.png' title=\"yyy\" class='showhide zzz'></img>"
    		.replace('xxx', png).replace('yyy', title).replace('zzz', style);
    	$(el).click(callback);
    	containerEl.appendChild(el);
    }
	this.toggleControlPanel = function() {
    	that.controlPanelVisible = !that.controlPanelVisible;
    	if (that.controlPanelVisible) {
            $('.showhide').hide();
		}
		else {
            $('.showhide').show();
		}
	}
	this.toggleVideoControls = function() {
		if (that.videoDisplayed)
			$('#' + that.videoControlsContainerId).show();
		else {
			$('#' + that.videoControlsContainerId).hide();
			that.video_stop();
		}
	}
	this.animate = function(cameraVectorLength) {
        if (that.geoIndex == 1) {       //plane
            that.setInitialCameraPosition();
            that.camera.position.x *=-1;
        }
        else {
            if (cameraVectorLength > 0 && that.geoIndex == 0) { // sphere
        		var unitVector = (new THREE.Vector3())
                    .copy(that.camera.position)
                    .normalize()
                    .multiplyScalar(cameraVectorLength);
                that.camera.position.set(unitVector.x, unitVector.y, unitVector.z);
            }
            that.camera.lookAt(new THREE.Vector3(0,0,0));
            rotateCameraY(that.camera, that.rotateYAmount);
            rotateCameraUpDown(that.camera, that.rotateXAmount);
        }

		if (that.videoDisplayed &&  that.video.readyState === that.video.HAVE_ENOUGH_DATA ) {
		  if (that.videoTexture) that.videoTexture.needsUpdate = true;
		}		
	}
    this.updateSkyDome = function(event) {
        var pid = event.target.id.replace('textureSelector_','');
        that.updateSkyDomeForFileName(pid);
    }
    this.updateSkyDomeForFileName = function(fileName) {
        document.title = fileName;
        that.videoDisplayed = false;
        that.toggleVideoControls();
        that.video.pause();
        that.showToast("Loading '" + fileName + "'.", 2000);
        var pathToTexture = 'media/' + fileName;
        (new THREE.TextureLoader()).load(pathToTexture, function ( texture ) {
            that.material = that.setMaterialForTexture(texture);
            that.displayMesh.material = that.material;
        });
    }
    this.toggleView = function(desiredGeoIndex) {
        that.geoIndex = desiredGeoIndex;
        var segment = 256.;
        var sphereRadius = 10;
        that.scene.remove(that.displayMesh);
        if (that.geoIndex == 0) {
            that.displayGeometry = new THREE.SphereGeometry(sphereRadius,segment,segment);
            that.displayMesh = new THREE.Mesh( that.displayGeometry, that.material );
            that.displayMesh.scale.set(1,1,-1);
        }
        if (that.geoIndex == 1) {
            that.displayGeometry = new THREE.PlaneBufferGeometry( sphereRadius/8, sphereRadius/8, segment, segment );
            that.displayMesh = new THREE.Mesh( that.displayGeometry, that.material );
            that.displayMesh.rotateY(Math.PI/2);
        }
        if (that.geoIndex == 2) {
            that.displayGeometry = new THREE.TorusGeometry( sphereRadius, sphereRadius/2, segment, segment );
            that.displayMesh = new THREE.Mesh( that.displayGeometry, that.material );
            that.displayMesh.rotateX(Math.PI/2);
        }
        if (that.geoIndex == 3) {
            that.displayGeometry = 
            new THREE.ParametricGeometry( 
                psphere, 
                40, 40 );
            that.displayMesh = new THREE.Mesh( that.displayGeometry, that.material );
            that.displayMesh.rotateX(Math.PI/2);
        }
        if (that.geoIndex == 4) {
            that.displayGeometry = 
            new THREE.ParametricGeometry( 
                klein, 
                40, 40 );

            // that.displayGeometry = new THREE.IcosahedronGeometry( 1,0 );
            //that.displayGeometry = new THREE.TubeGeometry( helix, 128, 2.5, 32 )

            // var points = [];
            // var height = 5;
            // var count = 30;
            // for (var i = 0; i < count; i++) {
            //     points.push(new THREE.Vector3((Math.sin(i * 0.2) 
            //     + Math.cos(i * 0.3)) * height + 12, 
            //     0, ( i - count ) + count / 2));
            // }
            // // use the same points to create a convexgeometry
            // var latheGeometry = new THREE.LatheGeometry
            //     (points, 40, 0, 3.1415926*2.);
            // that.displayGeometry = latheGeometry;

            that.displayMesh = new THREE.Mesh( that.displayGeometry, that.material );
            // that.displayMesh.scale.set(1,-1,1);
            that.displayMesh.rotateX(-Math.PI/2);
        }
        console.log("geoIndex = " + that.geoIndex);
        that.displayMesh.position.set(0,0,0);
        that.scene.add(that.displayMesh);
    }
    // over-ride this to provide your own material,e.g. shader material:
    this.setMaterialForTexture = function(texture) {
            return new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });            
    }
    this.initVideo = function() {
        that.video  = document.getElementById('video');
        that.videoSource = document.createElement('source');
        that.video.appendChild(that.videoSource);
    }
	this.updateVideo = function(event) {
    	var pid = event.target.id.replace('textureSelector_','');
        that.updateVideoForFileName(pid);
    }
    this.updateVideoForFileName = function(pid) {
        that.videoFileName = pid;
        console.log('in video: ' + pid);
        document.title = pid;
        var pathToTexture = 'media/' + pid + '.mp4';

        that.videoSource.setAttribute('src', pathToTexture);
        that.video.load();

        that.videoTexture = new THREE.Texture(that.video);
        that.videoTexture.minFilter = THREE.LinearFilter;
        that.videoTexture.magFilter = THREE.LinearFilter;
        that.videoTexture.generateMipmaps = false;
        that.video.pause();     
        that.video.play();

        that.videoTexture.minFilter = THREE.LinearFilter;   // eliminates aliasing when tiling textures.
        that.material = that.setMaterialForTexture(that.videoTexture);
        that.displayMesh.material = that.material;
        that.videoDisplayed = true;
        that.toggleVideoControls();
	}
    this.video_play = function() {
        // all this messing around to avoid a chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=593273
        console.log("1 Is video paused? " + that.video.paused);
        that.video.pause();             
        setTimeout(function () {      
            that.video.pause();             
            console.log("2 Is video paused? " + that.video.paused);
		that.video.play();
            console.log("3 Is video paused? " + that.video.paused);
        }, 150);
    }
    this.video_stop = function() {
		that.video.pause();    	
    }
    this.video_restart = function() {
        that.video.pause();
        that.video.currentTime = 0;
        // that.updateVideoForFileName(that.videoFileName);
		that.video_play();
    }
    this.video_skip = function(value) {
        that.video.currentTime += value;
    }
    this.video_rewind = function() {
    	that.video_skip(-10);
    }
    this.video_ff = function() {
    	that.video_skip(10);
    }
    this.cameraLeft = function() {
        that.rotateYAmount -= 0.002;
    }  
    this.cameraRight = function() {
        that.rotateYAmount += 0.002;
    }  
    this.cameraUp = function() {
        that.rotateXAmount -= 0.002;
    }  
    this.cameraDown = function() {
        that.rotateXAmount += 0.002;
    }  
    this.cameraStop = function() {
        that.rotateYAmount = 0.;
        that.rotateXAmount = 0.;
    }  
    this.flipCamera = function() {
    	that.camera.position.x = - that.camera.position.x;
    	that.camera.position.y = - that.camera.position.y;
    	that.camera.position.z = - that.camera.position.z;
    }
    this.narrowFOV = function() {
        that.FOV += 15;
        that.camera.fov = that.FOV;
        that.camera.updateProjectionMatrix();
    }
    this.widerFOV = function() {
        that.FOV -= 15;
        that.camera.fov = that.FOV;
        that.camera.updateProjectionMatrix();
    }
    this.initMediaUtils();
}