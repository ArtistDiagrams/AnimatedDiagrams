// Functions specific to doing mobius transforms on videos or stills.
// this must be paired with the appropriate shaders of course.
// issues: zoom sometimes fires on its own for now good reason.
function transformUtils(camera, transformControlsContainerId, complexControlsContainerId, 
    transformControls2ContainerId,
    mediaUtils) {
	this.camera = camera;
	var that = this;
	this.transformControlsContainerId = transformControlsContainerId;
    this.complexControlsContainerId = complexControlsContainerId;
    this.transformControls2ContainerId = transformControls2ContainerId;
    this.unitVector = (new THREE.Vector3()).copy(this.camera.position).normalize();;
    this.point1Defined = false;
    this.point2Defined = false;
    this.rotateDirection = 0;
    this.cameraLookAtComplexX = 0;
    this.cameraLookAtComplexY = 0;
    this.mediaUtils = mediaUtils;
    this.mediaUtils.onSpaceBarClick = function(e){
        that.uniforms.showFixedPoints.value = 0;
        $('.statusText').hide();
    }

    this.cameraVectorLength = 1;    // by default, unit vector.
    this.uniforms = {
	    iRotationAmount:    { type: 'f', value: 0.0 },
	    startTime:    { type: 'f', value: 0.0 },
	    iGlobalTime:    { type: 'f', value: 0.0 },
        mobiusEffectsOnOff: { type: 'i', value: 0 },
        complexEffect1OnOff: { type: 'i', value: 1 },
        complexEffect3OnOff: { type: 'i', value: 0 },
        complexEffect4OnOff: { type: 'i', value: 0 },
        complexEffect5OnOff: { type: 'i', value: 0 },
	    showFixedPoints: { type: 'i', value: 1 },
	    e1x: { type: 'f', value: 0. },
	    e1y: { type: 'f', value: 0. },
	    e2x: { type: 'f', value: 0. }, 
	    e2y: { type: 'f', value: 0. },
        loxodromicX: {type: 'f', value: 1. },
        loxodromicY: {type: 'f', value: 0. },
        drosteType: {type: 'i', value: 0 },
        drosteSpiral: {type: 'i', value: 0 },
        drosteZoom: {type: 'i', value: 0},
	};
    mediaUtils.setMaterialForTexture = function(texture) {
        that.uniforms.iChannel0 =  { type: 't', value: texture }; 
        texture.minFilter = THREE.LinearFilter; // eliminates aliasing when tiling textures.
        var fragmentShaderCode = 
            ""
            + SHADERCODE.uniformsAndGlobals()
            + SHADERCODE.mathUtils()
            + SHADERCODE.mobiusTransformUtils()
            + SHADERCODE.drosteUtils()
            + SHADERCODE.schottkyUtils()
            + document.getElementById( 'fs' ).textContent
        ;
        newMaterial = new THREE.ShaderMaterial( {
            uniforms: that.uniforms,
            vertexShader: document.getElementById( 'vs' ).textContent,
            fragmentShader: fragmentShaderCode,
            side: THREE.DoubleSide,
            transparent: true,
            // wireframe: true
        } );
        return newMaterial;                    
    }
    this.showToast = function(message, ms) {
        // console.log("Showing " + message + " for " + ms) ;
        // var options = {
        //     settings: {
        //         duration: ms
        //     }
        // };        
        //new iqwerty.toast.Toast(message, options);
    }
	this.initTransformUtils = function() {
		that.setupTransformControlIcons();
        that.setupComplexControlIcons();
        that.showToast('Hit space bar to show/hide icons.', 2000);
	}
    this.setupTransformControlIcons = function() {
    	var container = document.getElementById(that.transformControlsContainerId);
    	appendSingleIcon(container, 'transformControlIcon', 'rotateLeft.png', 'Rotate Left', that.rotateLeft);
    	appendSingleIcon(container, 'transformControlIcon', 'rotateRight.png', 'Rotate Right', that.rotateRight);
    	appendSingleIcon(container, 'transformControlIcon', 'pause.png', 'Rotate Pause', that.rotatePause);
    	appendSingleIcon(container, 'transformControlIcon', 'stop.png', 'No Rotation', that.rotationOff);

    	appendSingleIcon(container, 'transformControlIcon', 'zoomIn.png', 'Zoom In', that.zoomIn);
    	appendSingleIcon(container, 'transformControlIcon', 'zoomOut.png', 'Zoom Out', that.zoomOut);
    	appendSingleIcon(container, 'transformControlIcon', 'cancel.png', 'Cancel Zoom', that.zoomCancel);
    	appendSingleIcon(container, 'transformControlIcon', 'Epsilon1.svg', 'Set Fixed Point 1', that.setFixedPoint1);
        appendSingleIcon(container, 'transformControlIcon', 'Epsilon2.svg', 'Set Fixed Point 2', that.setFixedPoint2);
        appendSingleIcon(container, 'transformControlIcon', 'Epsilon3.svg', 'Set Loxodromic constant', that.setLoxoPointFromClick);
        appendSingleIcon(container, 'transformControlIcon', 'roundDroste.png', 'Round Droste', that.roundDroste);
        appendSingleIcon(container, 'transformControlIcon', 'squareDroste.jpg', 'Square Droste', that.squareDroste);
        appendSingleIcon(container, 'transformControlIcon', 'spiral.png', 'Toggle Spiral Droste Effect', that.toggleSpiralDroste);
        appendSingleIcon(container, 'transformControlIcon', 'zoomIn.png', 'Toggle Droste Zoom Effect', that.toggleDrosteZoom);

    	var container = document.getElementById(that.transformControls2ContainerId);
        appendSingleIcon(container, 'transformControlIcon', 'reset.png', 'Reset', that.reset);
        appendSingleIcon(container, 'transformControlIcon', 'debug.png', 'Show/Hide Debug Info', that.toggleDebugInfo);
        appendSingleIcon(container, 'transformControlIcon', 'toggle.png', 'Toggle View', that.toggleView);
        appendSingleIcon(container, 'transformControlIcon', 'help.png', 'Help/Info', that.showHelpPage);
    }
    this.setupComplexControlIcons = function() {
        var container = document.getElementById(that.complexControlsContainerId);
        appendSingleIcon(container, 'transformControlIcon', 'transform1Icon.png', 'Increase N', that.complexEffect1);                
        appendSingleIcon(container, 'transformControlIcon', 'transform2Icon.png', 'Decrease N', that.complexEffect2);                
        appendSingleIcon(container, 'transformControlIcon', 'transform3Icon.png', 'Apply transform', that.complexEffect3);                
        appendSingleIcon(container, 'transformControlIcon', 'transform4Icon.png', 'Apply transform', that.complexEffect4);                
        appendSingleIcon(container, 'transformControlIcon', 'transform4Icon.png', 'Apply transform', that.complexEffect5);                
    }
    this.viewState = 0;
    this.toggleView = function() {
        that.viewState++;
        that.viewState = that.viewState % 6;
        if (that.viewState == 0) {
            that.cameraVectorLength = 1;
            that.mediaUtils.toggleView(0);
        }
        else
        if (that.viewState == 5) {
            that.cameraVectorLength = -1;
            that.mediaUtils.toggleView(1);
        }
        else
        if (that.viewState == 3) {
            that.cameraVectorLength = 15;
            that.mediaUtils.toggleView(0);
        }
        if (that.viewState == 4) {
            that.cameraVectorLength = 1;
            that.mediaUtils.toggleView(2);
        }
        if (that.viewState == 1) {
            that.cameraVectorLength = 15;
            that.mediaUtils.toggleView(4);
        }
        if (that.viewState == 2) {
            that.cameraVectorLength = 15;
            that.mediaUtils.toggleView(3);
        }
    }
    function appendSingleIcon(containerEl, style, png, title, callback) {
    	var el;
    	el = document.createElement('span');
    	el.innerHTML = "<img src='icons/xxx' title=\"yyy\" class='showhide zzz'></img>"
    		.replace('xxx', png).replace('yyy', title).replace('zzz', style);
    	$(el).click(callback);
    	containerEl.appendChild(el);
    }
    this.showHelpPage = function() {
        window.location.href = 'info.html';
    }
    this.complexEffect1 = function() { 
        that.uniforms.complexEffect1OnOff.value += 1;
        that.showToast("n = " + that.uniforms.complexEffect1OnOff.value, 1000);
    }
    this.complexEffect2 = function() { 
        that.uniforms.complexEffect1OnOff.value -= 1;
        that.showToast("n = " + that.uniforms.complexEffect1OnOff.value, 1000);
    }
    this.complexEffect3 = function() { 
        that.uniforms.complexEffect3OnOff.value = that.uniforms.complexEffect3OnOff.value == 0 ? 1 : 0;
    }
    this.complexEffect4 = function() { 
        that.uniforms.complexEffect4OnOff.value = that.uniforms.complexEffect4OnOff.value == 0 ? 1 : 0;
    }
    this.complexEffect5 = function() { 
        that.uniforms.complexEffect5OnOff.value = 
        that.uniforms.complexEffect5OnOff.value == 0 ? 1 : 0;
        // that.uniforms.complexEffect5OnOff.value++;
    }
    this.setFixedPointsIfUndefined = function() {
    	if (!that.point1Defined && !that.point2Defined) {
    		that.setFixedPoint(1);
    	}
    }
    this.setFixedPoint1 = function() {that.setFixedPoint(1); }
    this.setFixedPoint2 = function() {that.setFixedPoint(2); }
    this.setFixedPoint = function(pointNumber) {
    	that.uniforms.mobiusEffectsOnOff.value = 1;
    	var x = that.cameraLookAtComplexX;
    	var y = that.cameraLookAtComplexY;
    	if (pointNumber == 1) {
        	that.uniforms.e1x.value = x;
        	that.uniforms.e1y.value = y;
        	that.point1Defined = true;
        	if (!that.point2Defined) {
            	var ant = that.antipode(x,y);
            	that.uniforms.e2x.value = ant.x;
            	that.uniforms.e2y.value = ant.y;	            		
        	}
        }
        else {
        	that.uniforms.e2x.value = x;
        	that.uniforms.e2y.value = y;	            	
        	that.point2Defined = true;
        	if (!that.point1Defined) {
            	var ant = that.antipode(x,y);
            	that.uniforms.e1x.value = ant.x;
            	that.uniforms.e1y.value = ant.y;	            		
        	}
        }
    	console.log("P1 = " + that.uniforms.e1x.value + "," + that.uniforms.e1y.value);
    	console.log("P2 = " + that.uniforms.e2x.value+ "," + that.uniforms.e2x.value);
        console.log("loxo point = " + that.uniforms.loxodromicX.value + "," + that.uniforms.loxodromicY.value);
    }
    this.rotatePause = function() { that.rotate(0); }
    this.rotateLeft = function() { that.rotate(-1); }
    this.rotateRight = function() { that.rotate(1); }
    this.rotate = function(direction) {
		that.setFixedPointsIfUndefined();
    	if (direction == 0) {
    		that.rotateDirection = 0;
    	}
    	else {
        	that.rotateDirection += direction;
    	}
    }
    this.rotationOff = function() {
		that.rotateDirection = 0;
    	that.uniforms.iRotationAmount.value = 0;
    }
    this.setLoxoPointFromClick = function() {
        that.setLoxoPoint(that.cameraLookAtComplexX, that.cameraLookAtComplexY);
    }
    this.roundDroste = function() {
        that.setFixedPointsIfUndefined();
        that.uniforms.drosteType.value = that.uniforms.drosteType.value > 0 ? 0 : 1;
    }
    this.squareDroste = function() {
        that.setFixedPointsIfUndefined();
        that.uniforms.drosteType.value = that.uniforms.drosteType.value > 0 ? 0 : 2;
    }
    this.toggleSpiralDroste = function() {
        that.uniforms.startTime.value = that.uniforms.iGlobalTime.value;
        that.uniforms.drosteSpiral.value = that.uniforms.drosteSpiral.value == 1 ? 0 : 1;
    }
    this.toggleDrosteZoom = function() {
        that.uniforms.drosteZoom.value = (that.uniforms.drosteZoom.value + 1) % 4;
        console.log(that.uniforms.drosteZoom.value);
    }
    this.setLoxoPoint = function(x,y) {
        that.setFixedPointsIfUndefined();
        that.uniforms.loxodromicX.value = x;
        that.uniforms.loxodromicY.value = y;
        console.log("loxo point = " + that.uniforms.loxodromicX.value + "," + that.uniforms.loxodromicY.value);
        that.showToast("Zoom is (" +
                that.uniforms.loxodromicX.value.toFixed(2) + "," +
                that.uniforms.loxodromicY.value.toFixed(2) + "i)"
            , 2000);
    }
    this.zoomIn = function() { that.zoom(.8); }
    this.zoomOut = function() { that.zoom(1.25); }
    this.zoomCancel = function() { that.setLoxoPoint(1.,0.); }
    this.zoom = function(factor) {
		that.setFixedPointsIfUndefined();
        that.setLoxoPoint(
            that.uniforms.loxodromicX.value * factor,
            that.uniforms.loxodromicY.value * factor);
    }
    this.antipode = function(inx,iny) {
    	// -(1/conj(x,y))
    	var x = inx;
    	var y = -iny; // conjugate
    	var denom = x*x + y*y;
    	return {
    		x: -x/denom,
    		y: y/denom
    	}
    }
    this.toggleDebugInfo = function() {
    	that.uniforms.showFixedPoints.value = that.uniforms.showFixedPoints.value == 0 ? 1 : 0;
    	if (that.uniforms.showFixedPoints.value == 0) {
            $('.statusText').hide();
		}
		else {
            $('.statusText').show();
		}

    }
    this.animate = function() {
        that.uniforms.iRotationAmount.value = that.uniforms.iRotationAmount.value  + .1*that.rotateDirection;
        that.uniforms.iGlobalTime.value = that.uniforms.iGlobalTime.value  + 1;
    	that.updateVariousNumbersForCamera();
        that.mediaUtils.animate(that.cameraVectorLength);
    }
    this.reset = function() {
    	that.rotateDirection = 0;
    	that.uniforms.iRotationAmount.value = 0;
    	that.uniforms.iGlobalTime.value = 0;
    	that.point1Defined = false;
    	that.point2Defined = false;
    	that.uniforms.mobiusEffectsOnOff.value = 0;
        that.uniforms.complexEffect1OnOff.value = 1;
        // that.uniforms.complexEffect2OnOff.value = 0;
        that.uniforms.complexEffect3OnOff.value = 0;
        that.uniforms.complexEffect4OnOff.value = 0;
        that.uniforms.complexEffect5OnOff.value = 0;
    	that.uniforms.e1x.value = that.uniforms.e1y.value = that.uniforms.e2x.value = that.uniforms.e2y.value = 0;
        that.uniforms.loxodromicX.value = 1;
        that.uniforms.loxodromicY.value = 0;
        that.uniforms.drosteType.value = 0;
    }
    this.updateVariousNumbersForCamera = function() {
        // Camera coordinates are in three.js space where Y is up.
        // We want to deal with traditional math coordinates where Z is up
    	that.unitVector = (new THREE.Vector3()).copy(that.camera.position).normalize();
		// in three.js y is up. we want z to be up.
        // also we need to flip z and x.
		var y = that.unitVector.x;
		var x = that.unitVector.z;	// assign z to x.
		var z = that.unitVector.y;	// assign y to z.

    	// convert to point on complex plane
        // all the signs are flipped because the camera is not sitting at the origin.
        // it is sitting 1 unit away from the origin, looking thru the origin at the
        // opposite side of the sphere.
        var negz = -z;
    	that.cameraLookAtComplexX = - x / (1.0 - negz);
    	that.cameraLookAtComplexY = - y / (1.0 - negz);

    	try {
            _textElement = document.getElementById('cameraText');
            _textElement.innerHTML = "<nobr>Camera in three.js coords: (" + _camera.position.x.toFixed(1) 
                + "," + _camera.position.y.toFixed(1) + ","  
                + _camera.position.z.toFixed(1) + ") len: " 
                + _camera.position.length().toFixed(1) + "</nobr>" ;

            document.getElementById('unitVectorText').innerHTML = 
            "<nobr>Camera in Cartesian Space: (" + 
            	x.toFixed(1) + "," + 
            	y.toFixed(1) + "," + 
                z.toFixed(1) + "" + 
                ") len: " 
				+ that.unitVector.length().toFixed(1) + "</nobr>" ;   

            document.getElementById('complexPointText').innerHTML = "Looking at " + 
            	that.cameraLookAtComplexX.toFixed(2) + " + " + 
            	that.cameraLookAtComplexY.toFixed(2) + "i";

 		}
		catch (x) {}
    }
    this.initTransformUtils();
}