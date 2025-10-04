const csInterface = new CSInterface();

// document.getElementById("resetLicense").addEventListener("click", function() {
//     localStorage.removeItem("novel_email");
//     localStorage.removeItem("novel_key");
//     location.reload(); // reload to see license screen again
// });

// Elements
const launchButton = document.getElementById('launch');
const confirmButton = document.getElementById('confirm');
const brightnessSlider = document.getElementById('brightness');
const grainSlider = document.getElementById('grain');
const fpsDropdown = document.getElementById('fpsDropdown');
const colorDropdown = document.getElementById('colorDropdown');
const shakeDropdown = document.getElementById('shakeDropdown');
const flickerToggle = document.getElementById('flickerToggle');
const rgbDropdown = document.getElementById('rgbDropdown');
const eyeToggle = document.getElementById('eyeToggle');
const invertToggle = document.getElementById('invertToggle');
const resetButton = document.getElementById('resetButton');
const cancelButton = document.getElementById('cancelButton');
const sliders = document.querySelectorAll('input[type="range"]');
const brightnessLabel = document.querySelector('.label-box:nth-child(1) label'); // First label (EXP)
const grainLabel = document.querySelector('.label-box:nth-child(3) label'); // Second label (GRAIN)

// Get the path to the extension root
const extensionRootPath = csInterface.getSystemPath(SystemPath.EXTENSION);

// Construct the path to createAdjustmentLayers.jsx relative to the extension root
var createAdjustmentLayersPath = extensionRootPath + "/jsx/createAdjustmentLayers.jsx";
createAdjustmentLayersPath = createAdjustmentLayersPath.replace(/\\/g, '/');

for (var i = 0; i < sliders.length; i++) {
    var slider = sliders[i];
    slider.style.setProperty('--value', (slider.value - slider.min) / (slider.max - slider.min) * 100 + '%');
    
    slider.addEventListener('input', function() {
        this.style.setProperty('--value', (this.value - this.min) / (this.max - this.min) * 100 + '%');
    });
}

// Disable all controls initially
disableControls();

function disableControls() {
    brightnessSlider.disabled = true;
    grainSlider.disabled = true;
    fpsDropdown.disabled = true;
    colorDropdown.disabled = true;
    shakeDropdown.disabled = true;
    flickerToggle.disabled = true;
    rgbDropdown.disabled = true;
    eyeToggle.disabled = true;
    invertToggle.disabled = true;
    resetButton.disabled = true;
    cancelButton.disabled = true;

    // Disable the labels for brightness (EXP) and grain
    document.querySelector('.label-box:nth-child(1) label').classList.add('disabled'); // EXP label
    document.querySelector('.label-box:nth-child(3) label').classList.add('disabled'); // GRAIN label
    
    document.querySelectorAll('button, select, input[type="range"]').forEach(function (element) {
        element.classList.add('disabled');
    });
}

function enableControls() {
    brightnessSlider.disabled = false;
    grainSlider.disabled = false;
    fpsDropdown.disabled = false;
    colorDropdown.disabled = false;
    shakeDropdown.disabled = false;
    flickerToggle.disabled = false;
    rgbDropdown.disabled = false;
    eyeToggle.disabled = false;
    invertToggle.disabled = false;
    resetButton.disabled = false;
    cancelButton.disabled = false;

    // Enable the labels for brightness (EXP) and grain
    document.querySelector('.label-box:nth-child(1) label').classList.remove('disabled'); // EXP label
    document.querySelector('.label-box:nth-child(3) label').classList.remove('disabled'); // GRAIN label

    document.querySelectorAll('button, select, input[type="range"]').forEach(function (element) {
        element.classList.remove('disabled');
    });
}

function removeAdjustmentLayers() {
    csInterface.evalScript(
    'function removeLayers() {' +
    'app.beginUndoGroup("Remove EFX, FPS, and SCALE Adjustment Layers");' +
    'var comp = app.project.activeItem;' +
    'if (comp && comp instanceof CompItem) {' +
    'var efxLayer = null;' +
    'var fpsLayer = null;' +
    'var scaleLayer = null;' +  // Added scaleLayer variable
    'for (var i = comp.layers.length; i >= 1; i--) {' +
    'var layer = comp.layers[i];' +
    'if (layer instanceof AVLayer && layer.adjustmentLayer) {' +
    'if (layer.name === "INVERT") {' +
    'invertLayer = layer;' +
    '} else if (layer.name === "FPS") {' +
    'fpsLayer = layer;' +
    '} else if (layer.name === "SCALE") {' +  // Added condition for SCALE
    'scaleLayer = layer;' +
    '} else if (layer.name === "UNSHARP") {' +  // Added condition for SCALE
    'unsharpLayer = layer;' +
    '} else if (layer.name === "BLACK & WHITE") {' +  // Added condition for SCALE
    'blackandwhiteLayer = layer;' +
    '} else if (layer.name === "RGB") {' +  // Added condition for SCALE
    'rgbLayer = layer;' +
    '} else if (layer.name === "GRID") {' +  // Added condition for SCALE
    'gridLayer = layer;' +
    '} else if (layer.name === "EXPOSURE") {' +  // Added condition for SCALE
    'exposureLayer = layer;' +
    '} else if (layer.name === "GRAIN") {' +  // Added condition for SCALE
    'grainLayer = layer;' +
    '} else if (layer.name === "FLICKER") {' +  // Added condition for SCALE
    'flickerLayer = layer;' +
    '} else if (layer.name === "SHAKE") {' +  // Added condition for SCALE
    'shakeLayer = layer;' +
    '}' +
    '}' +
    '}' +
    'if (invertLayer) invertLayer.remove();' +
    'if (fpsLayer) fpsLayer.remove();' +
    'if (scaleLayer) scaleLayer.remove();' +  
    'if (unsharpLayer) unsharpLayer.remove();' +
    'if (blackandwhiteLayer) blackandwhiteLayer.remove();' +
    'if (rgbLayer) rgbLayer.remove();' +
    'if (gridLayer) gridLayer.remove();' +
    'if (exposureLayer) exposureLayer.remove();' +
    'if (grainLayer) grainLayer.remove();' +
    'if (flickerLayer) flickerLayer.remove();' +
    'if (shakeLayer) shakeLayer.remove();' +

    // Added removal of SCALE layer
    '} else {' +
    'alert("No composition found.");' +
    '}' +
    'app.endUndoGroup();' +
    '}' +
    'removeLayers();',
    function(result) {
    if (result && result !== "undefined") {
        alert("Script execution failed: " + result);
    } else {
        // Reset UI elements to default values
        resetUI();
        
        // Hide confirm and cancel buttons and show launch button
        confirmButton.classList.add('hidden');
        launchButton.classList.remove('hidden');
        
        // Disable controls and reset button
        disableControls();
        
        // Update instruction text
        instructionText.textContent = "↓ CLICK LAUNCH TO BEGIN ↓";
    }
    }
    );
}

document.addEventListener('DOMContentLoaded', function() {
    csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, function() {
        console.log('CSInterface is ready.');
    });

    launchButton.addEventListener('click', function() {
        csInterface.evalScript(
            '(function() {' +
            'var comp = app.project.activeItem;' +
            'if (comp && comp instanceof CompItem) {' +
            'return "composition found";' +
            '} else {' +
            'return "no composition";' +
            '}' +
            '})()',
             function(result) {
                if (result === "composition found") {
                    var escapedPath = createAdjustmentLayersPath.replace(/"/g, '\\"');
                    csInterface.evalScript('$.evalFile("' + escapedPath + '")', function(scriptResult) {
                        if (scriptResult && scriptResult !== "undefined") {
                            alert("Script execution failed: " + scriptResult);
                        } else {
                            enableControls();
                            launchButton.classList.add('hidden');
                            confirmButton.classList.remove('hidden');
                            cancelButton.classList.remove('hidden');
                            invertToggle.classList.remove('active');
                            resetButton.classList.remove('active');
                            shakeDropdown.classList.add('active');
                            flickerToggle.classList.add('active');
                            rgbDropdown.classList.remove('active');
                            eyeToggle.classList.add('active');
                            instructionText.textContent = "↓  CLICK  CONFIRM  TO  LOCK  ↓";
                        }
                    });
                } else {
                    alert("No composition selected. Please select a composition to proceed.");
                }
            }
        );
    });
    
    brightnessSlider.addEventListener('input', function() {
        const brightnessValue = brightnessSlider.value;
        csInterface.evalScript(
            'app.project.activeItem.layer("EXPOSURE").property("ADBE Effect Parade").property("Brightness & Contrast").property("Brightness").setValue(' + brightnessValue + ');'
        );
    });
    
    // Grain control
    grainSlider.addEventListener('input', function() {
        const grainValue = grainSlider.value;
        csInterface.evalScript(
            'app.project.activeItem.layer("GRAIN").property("ADBE Effect Parade").property("Noise").property("Amount of Noise").setValue(' + grainValue + ');'
        );
    });


    fpsDropdown.addEventListener('change', function() {
        var frameRate = fpsDropdown.value;
    
        if (frameRate == 0) {
            // Turn off Posterize Time effect
            csInterface.evalScript(generateDisablePosterizeTimeScript());
        } else {
            // Adjust Posterize Time effect with the selected frame rate
            csInterface.evalScript(generateEnablePosterizeTimeScript(frameRate));
        }
    });
    
    function generateDisablePosterizeTimeScript() {
        var scriptParts = [];
    
        scriptParts.push('var fpsLayer = app.project.activeItem.layer("FPS");');
        scriptParts.push('if (fpsLayer) {');
        scriptParts.push('    var posterizeTimeEffect = fpsLayer.property("ADBE Effect Parade").property("Posterize Time");');
        scriptParts.push('    if (posterizeTimeEffect) {');
        scriptParts.push('        posterizeTimeEffect.enabled = false;  // Disable the Posterize Time effect');
        scriptParts.push('    }');
        scriptParts.push('}');
    
        return scriptParts.join('\n');
    }
    
    function generateEnablePosterizeTimeScript(frameRate) {
        var scriptParts = [];
    
        scriptParts.push('var fpsLayer = app.project.activeItem.layer("FPS");');
        scriptParts.push('if (fpsLayer) {');
        scriptParts.push('    var posterizeTimeEffect = fpsLayer.property("ADBE Effect Parade").property("Posterize Time");');
        scriptParts.push('    if (posterizeTimeEffect) {');
        scriptParts.push('        posterizeTimeEffect.enabled = true;   // Ensure the effect is enabled');
        scriptParts.push('        posterizeTimeEffect.property("Frame Rate").setValue(' + frameRate + ');');
        scriptParts.push('    }');
        scriptParts.push('}');
    
        return scriptParts.join('\n');
    }

    // Color dropdown control
    colorDropdown.addEventListener('change', function() {
        const selectedValue = colorDropdown.value;

        if (selectedValue === 'original') {
            csInterface.evalScript('app.project.activeItem.layer("BLACK & WHITE").property("ADBE Effect Parade").property("Black & White").enabled = false;');
            csInterface.evalScript('app.project.activeItem.layer("GRID").property("ADBE Effect Parade").property("Grid").property("Color").setValue([1, 1, 1]);');
        } else {
            csInterface.evalScript('app.project.activeItem.layer("BLACK & WHITE").property("ADBE Effect Parade").property("Black & White").enabled = true;');

            var colorValue = JSON.parse(selectedValue);
            csInterface.evalScript('app.project.activeItem.layer("GRID").property("ADBE Effect Parade").property("Grid").property("Color").setValue([' + colorValue[0] + ', ' + colorValue[1] + ', ' + colorValue[2] + ']);');
        }
    });

    // Shake Dropdown control
    shakeDropdown.addEventListener('change', function() {
    const selectedValue = shakeDropdown.value;

    if (selectedValue === 'SHAKE OFF') {
        // Turn off all Shake effects, enable Fast Box Blur, and turn off Transform effect on FPS layer
        csInterface.evalScript(
            'var shakeLayer = app.project.activeItem.layer("SHAKE");' +
            'var fpsLayer = app.project.activeItem.layer("FPS");' +
            'var grainLayer = app.project.activeItem.layer("GRAIN");' +
            'if (shakeLayer) {' +
            'var shake1 = shakeLayer.property("ADBE Effect Parade").property("Shake1");' +
            'var shake2 = shakeLayer.property("ADBE Effect Parade").property("Shake2");' +
            'var shake3 = shakeLayer.property("ADBE Effect Parade").property("Shake3");' +
            'if (shake1) shake1.enabled = false;' +
            'if (shake2) shake2.enabled = false;' +
            'if (shake3) shake3.enabled = false;' +
            '}' +
            'if (fpsLayer) {' +
            'var transform = fpsLayer.property("ADBE Effect Parade").property("Transform");' +
            'if (transform) transform.enabled = false;' +
            'var transform2 = fpsLayer.property("ADBE Effect Parade").property("Transform 2");' +
            'if (transform2) transform2.enabled = false;' +
            '}'+
            'if (grainLayer) {' +
            'var fastBoxBlur = grainLayer.property("ADBE Effect Parade").property("Fast Box Blur");' +
            'if (fastBoxBlur) fastBoxBlur.enabled = true;' +
            '}'
        );
    } else if (selectedValue === 'SHAKE LOW') {
        // Enable Shake1 effect, disable Fast Box Blur, and keep Transform effect on FPS layer
        csInterface.evalScript(
            'var grainLayer = app.project.activeItem.layer("GRAIN");' +
            'var fpsLayer = app.project.activeItem.layer("FPS");' +
            'var shakeLayer = app.project.activeItem.layer("SHAKE");' +
            'if (shakeLayer) {' +
            'var shake1 = shakeLayer.property("ADBE Effect Parade").property("Shake1");' +
            'var shake2 = shakeLayer.property("ADBE Effect Parade").property("Shake2");' +
            'var shake3 = shakeLayer.property("ADBE Effect Parade").property("Shake3");' +
            'if (shake1) shake1.enabled = true;' +
            'if (shake2) shake2.enabled = false;' +
            'if (shake3) shake3.enabled = false;' +
            '}' +
            'if (fpsLayer) {' +
            'var transform = fpsLayer.property("ADBE Effect Parade").property("Transform");' +
            'if (transform) transform.enabled = true;' +
            'var transform2 = fpsLayer.property("ADBE Effect Parade").property("Transform 2");' +
            'if (transform2) transform2.enabled = false;' +
            '}'+
            'if (grainLayer) {' +
            'var fastBoxBlur = grainLayer.property("ADBE Effect Parade").property("Fast Box Blur");' +
            'if (fastBoxBlur) fastBoxBlur.enabled = false;' +
            '}'
        );
    } else if (selectedValue === 'SHAKE MID') {
        // Enable Shake2 effect and disable Fast Box Blur
        csInterface.evalScript(
            'var grainLayer = app.project.activeItem.layer("GRAIN");' +
            'var fpsLayer = app.project.activeItem.layer("FPS");' +
            'var shakeLayer = app.project.activeItem.layer("SHAKE");' +
            'if (shakeLayer) {' +
            'var shake1 = shakeLayer.property("ADBE Effect Parade").property("Shake1");' +
            'var shake2 = shakeLayer.property("ADBE Effect Parade").property("Shake2");' +
            'var shake3 = shakeLayer.property("ADBE Effect Parade").property("Shake3");' +
            'if (shake1) shake1.enabled = false;' +
            'if (shake2) shake2.enabled = true;' +
            'if (shake3) shake3.enabled = false;' +
            '}' +
            'if (fpsLayer) {' +
            'var transform = fpsLayer.property("ADBE Effect Parade").property("Transform");' +
            'if (transform) transform.enabled = true;' +
            'var transform2 = fpsLayer.property("ADBE Effect Parade").property("Transform 2");' +
            'if (transform2) transform2.enabled = false;' +
            '}'+
            'if (grainLayer) {' +
            'var fastBoxBlur = grainLayer.property("ADBE Effect Parade").property("Fast Box Blur");' +
            'if (fastBoxBlur) fastBoxBlur.enabled = false;' +
            '}'
        );
    } else if (selectedValue === 'SHAKE HIGH') {
        // Turn off Shake1 and Shake2, enable Shake3, disable Transform, enable Transform 2
        csInterface.evalScript(
            'var shakeLayer = app.project.activeItem.layer("SHAKE");' +
            'var fpsLayer = app.project.activeItem.layer("FPS");' +
            'var grainLayer = app.project.activeItem.layer("GRAIN");' +
            'if (shakeLayer) {' +
            'var shake1 = shakeLayer.property("ADBE Effect Parade").property("Shake1");' +
            'var shake2 = shakeLayer.property("ADBE Effect Parade").property("Shake2");' +
            'var shake3 = shakeLayer.property("ADBE Effect Parade").property("Shake3");' +
            'if (shake1) shake1.enabled = false;' +
            'if (shake2) shake2.enabled = false;' +
            'if (shake3) shake3.enabled = true;' +
            '}' +
            'if (fpsLayer) {' +
            'var transform = fpsLayer.property("ADBE Effect Parade").property("Transform");' +
            'if (transform) transform.enabled = false;' +
            'var transform2 = fpsLayer.property("ADBE Effect Parade").property("Transform 2");' +
            'if (transform2) transform2.enabled = true;' +
            '}'+
            'if (grainLayer) {' +
            'var fastBoxBlur = grainLayer.property("ADBE Effect Parade").property("Fast Box Blur");' +
            'if (fastBoxBlur) fastBoxBlur.enabled = false;' +
            '}'
        );
    }
    });

    // FLICKER Toggle Functionality
    flickerToggle.addEventListener('click', function() {
        const isActive = flickerToggle.classList.toggle('active');
        csInterface.evalScript(
            'var flickerLayer = app.project.activeItem.layer("FLICKER");' +
            'if (flickerLayer) {' +
            'var exposureEffect = flickerLayer.property("Effects").property("Exposure");' +
            'if (exposureEffect) {' +
            'exposureEffect.enabled = ' + isActive + ';' +
            '}' +
          '}'
        );
    });

    // RGB Dropdown control
    rgbDropdown.addEventListener('change', function() {
        const selectedValue = rgbDropdown.value;

        if (selectedValue === 'OFF') {
            // Disable all three VR Chromatic Aberration effects
            csInterface.evalScript(
                'var rgbLayer = app.project.activeItem.layer("RGB");' +
                'if (rgbLayer) {' +
                'var rgb1 = rgbLayer.property("ADBE Effect Parade").property("RGB 1");' +
                'var rgb2 = rgbLayer.property("ADBE Effect Parade").property("RGB 2");' +
                'var rgb3 = rgbLayer.property("ADBE Effect Parade").property("RGB 3");' +
                'var rgb4 = rgbLayer.property("ADBE Effect Parade").property("RGB 4");' +
                'if (rgb1) rgb1.enabled = false;' +
                'if (rgb2) rgb2.enabled = false;' +
                'if (rgb3) rgb3.enabled = false;' +
                'if (rgb4) rgb4.enabled = false;' +
                '}'
            );
        } else if (selectedValue === 'MONO') {
            // Enable only RGB 1
            csInterface.evalScript(
                'var rgbLayer = app.project.activeItem.layer("RGB");' +
                'if (rgbLayer) {' +
                'var rgb1 = rgbLayer.property("ADBE Effect Parade").property("RGB 1");' +
                'var rgb2 = rgbLayer.property("ADBE Effect Parade").property("RGB 2");' +
                'var rgb3 = rgbLayer.property("ADBE Effect Parade").property("RGB 3");' +
                'var rgb4 = rgbLayer.property("ADBE Effect Parade").property("RGB 4");' +
                'if (rgb1) rgb1.enabled = true;' +
                'if (rgb2) rgb2.enabled = false;' +
                'if (rgb3) rgb3.enabled = false;' +
                'if (rgb4) rgb4.enabled = false;' +
                '}'
            );
        } else if (selectedValue === 'OVER') {
            // Enable only RGB 2
            csInterface.evalScript(
                'var rgbLayer = app.project.activeItem.layer("RGB");' +
                'if (rgbLayer) {' +
                'var rgb1 = rgbLayer.property("ADBE Effect Parade").property("RGB 1");' +
                'var rgb2 = rgbLayer.property("ADBE Effect Parade").property("RGB 2");' +
                'var rgb3 = rgbLayer.property("ADBE Effect Parade").property("RGB 3");' +
                'var rgb4 = rgbLayer.property("ADBE Effect Parade").property("RGB 4");' +
                'if (rgb1) rgb1.enabled = false;' +
                'if (rgb2) rgb2.enabled = true;' +
                'if (rgb3) rgb3.enabled = false;' +
                'if (rgb4) rgb4.enabled = false;' +
                '}'
            );
        } else if (selectedValue === 'SIDE') {
            // Enable only RGB 3
            csInterface.evalScript(
                'var rgbLayer = app.project.activeItem.layer("RGB");' +
                'if (rgbLayer) {' +
                'var rgb1 = rgbLayer.property("ADBE Effect Parade").property("RGB 1");' +
                'var rgb2 = rgbLayer.property("ADBE Effect Parade").property("RGB 2");' +
                'var rgb3 = rgbLayer.property("ADBE Effect Parade").property("RGB 3");' +
                'var rgb4 = rgbLayer.property("ADBE Effect Parade").property("RGB 4");' +
                'if (rgb1) rgb1.enabled = false;' +
                'if (rgb2) rgb2.enabled = false;' +
                'if (rgb3) rgb3.enabled = true;' +
                'if (rgb4) rgb4.enabled = false;' +
                '}'
            );
        } else if (selectedValue === 'MID') {
            // Enable only RGB 4
            csInterface.evalScript(
                'var rgbLayer = app.project.activeItem.layer("RGB");' +
                'if (rgbLayer) {' +
                'var rgb1 = rgbLayer.property("ADBE Effect Parade").property("RGB 1");' +
                'var rgb2 = rgbLayer.property("ADBE Effect Parade").property("RGB 2");' +
                'var rgb3 = rgbLayer.property("ADBE Effect Parade").property("RGB 3");' +
                'var rgb4 = rgbLayer.property("ADBE Effect Parade").property("RGB 4");' +
                'if (rgb1) rgb1.enabled = false;' +
                'if (rgb2) rgb2.enabled = false;' +
                'if (rgb3) rgb3.enabled = false;' +
                'if (rgb4) rgb4.enabled = true;' +
                '}'
            );
        }
    });

    // Eye Toggle Functionality
    eyeToggle.addEventListener('click', function() {
        const isActive = eyeToggle.classList.toggle('active');
        csInterface.evalScript(
            'var project = app.project;' +
            'var activeItem = project.activeItem;' +
            'if (activeItem) {' +
            'var invertLayer = activeItem.layer("INVERT");' +
            'var fpsLayer = activeItem.layer("FPS");' +
            'var scaleLayer = activeItem.layer("SCALE");' +
            'var unsharpLayer = activeItem.layer("UNSHARP");' +
            'var blackandwhiteLayer = activeItem.layer("BLACK & WHITE");' +
            'var rgbLayer = activeItem.layer("RGB");' +
            'var gridLayer = activeItem.layer("GRID");' +
            'var exposureLayer = activeItem.layer("EXPOSURE");' +
            'var grainLayer = activeItem.layer("GRAIN");' +
            'var flickerLayer = activeItem.layer("FLICKER");' +
            'var shakeLayer = activeItem.layer("SHAKE");' +
            'if (invertLayer) {' +
            'invertLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (fpsLayer) {' +
            'fpsLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (scaleLayer) {' +
            'scaleLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (blackandwhiteLayer) {' +
            'blackandwhiteLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (gridLayer) {' +
            'gridLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (exposureLayer) {' +
            'exposureLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (grainLayer) {' +
            'grainLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (flickerLayer) {' +
            'flickerLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (shakeLayer) {' +
            'shakeLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (rgbLayer) {' +
            'rgbLayer.enabled = ' + isActive + ';' +
            '}' +
            'if (unsharpLayer) {' +
            'unsharpLayer.enabled = ' + isActive + ';' +
            '}' +
            '}'
        );

        // Disable or enable each control individually based on the toggle state
        brightnessSlider.disabled = !isActive;
        grainSlider.disabled = !isActive;
        fpsDropdown.disabled = !isActive;
        colorDropdown.disabled = !isActive;
        shakeDropdown.disabled = !isActive;
        flickerToggle.disabled = !isActive;
        rgbDropdown.disabled = !isActive;
        invertToggle.disabled = !isActive;
        resetButton.disabled = !isActive;
        cancelButton.disabled = !isActive;
        // Enable or disable the labels based on isActive state
        document.querySelector('.label-box:nth-child(1) label').classList.toggle('disabled', !isActive); // EXP label
        document.querySelector('.label-box:nth-child(3) label').classList.toggle('disabled', !isActive); // GRAIN label
        // eyeToggle remains active no matter the state
        eyeToggle.disabled = false;
    });

    // Invert toggle button control
    invertToggle.addEventListener('click', function() {
        if (!invertToggle.disabled) {
            const isActive = invertToggle.classList.contains('active');
            const newState = isActive ? false : true; // Remove the tilted sign and use common JS + sign
            
            invertToggle.classList.toggle('active', newState);
            csInterface.evalScript('app.project.activeItem.layer("INVERT").property("ADBE Effect Parade").property("Invert").enabled = ' + newState + ';');
        }
    });

    // Confirm button functionality
    confirmButton.addEventListener('click', function() {
        csInterface.evalScript(
            '// Rename layers\n' +
            'var comp = app.project.activeItem;\n' +
            'var invertLayer = comp.layer("INVERT");\n' +
            'var fpsLayer = comp.layer("FPS");\n' +
            'var scaleLayer = comp.layer("SCALE");\n' +
            'var unsharpLayer = comp.layer("UNSHARP");\n' +
            'var blackandwhiteLayer = comp.layer("BLACK & WHITE");\n' +
            'var rgbLayer = comp.layer("RGB");\n' +
            'var gridLayer = comp.layer("GRID");\n' +
            'var exposureLayer = comp.layer("EXPOSURE");\n' +
            'var grainLayer = comp.layer("GRAIN");\n' +
            'var flickerLayer = comp.layer("FLICKER");\n' +
            'var shakeLayer = comp.layer("SHAKE");\n' +
            '// Reset values\n' +
            'if (invertLayer) invertLayer.name = "INVERT.";\n' +
            'if (fpsLayer) fpsLayer.name = "FPS.";\n' +
            'if (scaleLayer) scaleLayer.name = "SCALE.";\n' +
            'if (unsharpLayer) unsharpLayer.name = "UNSHARP.";\n' +
            'if (blackandwhiteLayer) blackandwhiteLayer.name = "BLACK & WHITE.";\n' +
            'if (rgbLayer) rgbLayer.name = "RGB.";\n' +
            'if (gridLayer) gridLayer.name = "GRID.";\n' +
            'if (exposureLayer) exposureLayer.name = "EXPOSURE.";\n' +
            'if (grainLayer) grainLayer.name = "GRAIN.";\n' +
            'if (flickerLayer) flickerLayer.name = "FLICKER.";\n' +
            'if (shakeLayer) shakeLayer.name = "SHAKE.";\n' +
            '// Reset values\n' +
            'app.project.activeItem.layer("EXPOSURE").property("ADBE Effect Parade").property("Brightness & Contrast").property("Brightness").setValue(0);\n' +
            'app.project.activeItem.layer("GRAIN").property("ADBE Effect Parade").property("Noise").property("Amount of Noise").setValue(20);\n' +
            'app.project.activeItem.layer("FPS").property("ADBE Effect Parade").property("Posterize Time").property("Frame Rate").setValue(8);\n' +
            'app.project.activeItem.layer("GRID").property("ADBE Effect Parade").property("Grid").property("Color").setValue([1, 1, 1]);\n' +
            'app.project.activeItem.layer("SHAKE").property("ADBE Effect Parade").property("Shake1").enabled = true;\n' +
            'app.project.activeItem.layer("SHAKE").property("ADBE Effect Parade").property("Shake2").enabled = false;\n' +
            'app.project.activeItem.layer("SHAKE").property("ADBE Effect Parade").property("Shake3").enabled = false;\n' +
            'app.project.activeItem.layer("GRAIN").property("ADBE Effect Parade").property("Fast Box Blur").enabled = false;\n' +
            'app.project.activeItem.layer("FLICKER").property("ADBE Effect Parade").property("Exposure").enabled = true;\n' +
            'app.project.activeItem.layer("RGB").property("ADBE Effect Parade").property("RGB1").enabled = false;\n' +
            'app.project.activeItem.layer("RGB").property("ADBE Effect Parade").property("RGB2").enabled = false;\n' +
            'app.project.activeItem.layer("RGB").property("ADBE Effect Parade").property("RGB3").enabled = false;\n' +
            'app.project.activeItem.layer("INVERT").property("ADBE Effect Parade").property("Invert").enabled = false;'
        , function(result) {
            if (result && result !== "undefined") {
                //alert("Script execution failed: " + result);
            } else {
                // Reset UI elements to default values
                resetUI();

                // Hide confirm button and show launch button
                confirmButton.classList.add('hidden');
                launchButton.classList.remove('hidden');

                // Disable controls and reset button
                disableControls();

                // Update instruction text
                instructionText.textContent = "↓  CLICK  LAUNCH  TO  BEGIN  ↓";
            }
        });
    });
});

// Add event listener to the footer link
document.getElementById('footerLink').addEventListener('click', function () {
    // Use CSInterface to open the link in the default browser
    csInterface.openURLInDefaultBrowser('https://www.jagnetics.com');
});

resetButton.addEventListener('click', function() {
    csInterface.evalScript(generateResetScript(), function(result) {
        if (result === "false" || result === "undefined" || result === "" || result === "true") {
            // No error, this is expected for normal completion
            // Reset UI elements to default values
            resetUI();
            document.getElementById('colorDropdown').value = '[1, 1, 1]'; // Set dropdown to B/W
            flickerToggle.classList.add('active');
            eyeToggle.classList.add('active');
        } else if (result) {
            alert("Script execution failed: " + result);
        }
    });
});

function generateResetScript() {
    var scriptParts = [];

    scriptParts.push('try {');
    scriptParts.push('    var comp = app.project.activeItem;');
    scriptParts.push('    if (!(comp && comp instanceof CompItem)) {');
    scriptParts.push('        throw new Error("No active composition found.");');
    scriptParts.push('    }');
    scriptParts.push(resetFpsLayer()); // Only reset FPS layer
    scriptParts.push(resetInvertLayer()); // Add reset for INVERT layer
    scriptParts.push(resetBlackWhiteLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push(resetRgbLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push(resetGridLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push(resetExposureLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push(resetGrainLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push(resetFlickerLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push(resetShakeLayer()); // Add reset for BLACK & WHITE layer
    scriptParts.push('} catch (error) {');
    scriptParts.push('    alert("Script execution failed: " + error.message);');
    scriptParts.push('}');

    return scriptParts.join('\n');
}

function resetFpsLayer() {
    var fpsLayerScript = [];

    fpsLayerScript.push('var fpsLayer = app.project.activeItem.layer("FPS");');
    fpsLayerScript.push('if (fpsLayer) {');

    // Reset Transform effect
    fpsLayerScript.push('    var transformEffect = fpsLayer.property("ADBE Effect Parade").property("Transform");');
    fpsLayerScript.push('    if (transformEffect) {');
    fpsLayerScript.push('        transformEffect.enabled = true;');
    fpsLayerScript.push('    }');

    // Reset Transform 2 effect
    fpsLayerScript.push('    var transform2Effect = fpsLayer.property("ADBE Effect Parade").property("Transform 2");');
    fpsLayerScript.push('    if (transform2Effect) {');
    fpsLayerScript.push('        transform2Effect.enabled = false;');
    fpsLayerScript.push('    }');

    // Reset Posterize Time effect (OFF by default)
    fpsLayerScript.push('    var posterizeTimeEffect = fpsLayer.property("ADBE Effect Parade").property("Posterize Time");');
    fpsLayerScript.push('    if (posterizeTimeEffect) {');
    fpsLayerScript.push('        posterizeTimeEffect.enabled = false;');
    fpsLayerScript.push('    }');

    fpsLayerScript.push('}'); // ✅ closes the if (fpsLayer)

    return fpsLayerScript.join('\n'); // ✅ correct newline joining
}


function resetInvertLayer() {
    var invertLayerScript = [];

    invertLayerScript.push('var invertLayer = app.project.activeItem.layer("INVERT");');
    invertLayerScript.push('if (invertLayer) {');
    invertLayerScript.push('    var invertEffect = invertLayer.property("ADBE Effect Parade").property("Invert");');
    invertLayerScript.push('    if (invertEffect) {');
    invertLayerScript.push('        invertEffect.enabled = false; // Disable INVERT effect');
    invertLayerScript.push('    }');
    invertLayerScript.push('}');

    return invertLayerScript.join('\n');
}

function resetBlackWhiteLayer() {
    var blackWhiteLayerScript = [];

    blackWhiteLayerScript.push('var blackWhiteLayer = app.project.activeItem.layer("BLACK & WHITE");');
    blackWhiteLayerScript.push('if (blackWhiteLayer) {');
    blackWhiteLayerScript.push('    var blackWhiteEffect = blackWhiteLayer.property("ADBE Effect Parade").property("Black & White");');
    blackWhiteLayerScript.push('    if (blackWhiteEffect) {');
    blackWhiteLayerScript.push('        blackWhiteEffect.enabled = true; // Enable Black & White effect');
    blackWhiteLayerScript.push('    }');
    blackWhiteLayerScript.push('}');

    return blackWhiteLayerScript.join('\n');
}

function resetRgbLayer() {
    var rgbLayerScript = [];

    rgbLayerScript.push('var rbgLayer = app.project.activeItem.layer("RGB");');
    rgbLayerScript.push('if (rbgLayer) {');
    rgbLayerScript.push('    var rgb1Effect = rbgLayer.property("ADBE Effect Parade").property("RGB1");');
    rgbLayerScript.push('    if (rgb1Effect) {');
    rgbLayerScript.push('        rgb1Effect.enabled = false;');
    rgbLayerScript.push('    }');
    rgbLayerScript.push('    var rgb2Effect = rbgLayer.property("ADBE Effect Parade").property("RGB2");');
    rgbLayerScript.push('    if (rgb2Effect) {');
    rgbLayerScript.push('        rgb2Effect.enabled = false;');
    rgbLayerScript.push('    }');
    rgbLayerScript.push('    var rgb3Effect = rbgLayer.property("ADBE Effect Parade").property("RGB3");');
    rgbLayerScript.push('    if (rgb3Effect) {');
    rgbLayerScript.push('        rgb3Effect.enabled = false;');
    rgbLayerScript.push('    }');
    rgbLayerScript.push('}');

    return rgbLayerScript.join('\n');
}

function resetGridLayer() {
    var gridLayerScript = [];

    gridLayerScript.push('var gridLayer = app.project.activeItem.layer("GRID");');
    gridLayerScript.push('if (gridLayer) {');
    gridLayerScript.push('    var gridEffect = gridLayer.property("ADBE Effect Parade").property("Grid");');
    gridLayerScript.push('    if (gridEffect) {');
    gridLayerScript.push('        gridEffect.property("Color").setValue([1, 1, 1]); // Set to white for B/W');
    gridLayerScript.push('    }');
    gridLayerScript.push('}');

    return gridLayerScript.join('\n');
}

function resetExposureLayer() {
    var exposureLayerScript = [];

    exposureLayerScript.push('var exposureLayer = app.project.activeItem.layer("EXPOSURE");');
    exposureLayerScript.push('if (exposureLayer) {');
    exposureLayerScript.push('    var brightnessContrastEffect = exposureLayer.property("ADBE Effect Parade").property("Brightness & Contrast");');
    exposureLayerScript.push('    if (brightnessContrastEffect) {');
    exposureLayerScript.push('        brightnessContrastEffect.property("Brightness").setValue(0);');
    exposureLayerScript.push('    }');
    exposureLayerScript.push('}');

    return exposureLayerScript.join('\n');
}

function resetGrainLayer() {
    var grainLayerScript = [];

    grainLayerScript.push('var grainLayer = app.project.activeItem.layer("GRAIN");');
    grainLayerScript.push('if (grainLayer) {');
    grainLayerScript.push('    var noiseEffect = grainLayer.property("ADBE Effect Parade").property("Noise");');
    grainLayerScript.push('    if (noiseEffect) {');
    grainLayerScript.push('        noiseEffect.property("Amount of Noise").setValue(20);');
    grainLayerScript.push('    }');
    grainLayerScript.push('    var fastBoxBlurEffect = grainLayer.property("ADBE Effect Parade").property("Fast Box Blur");');
    grainLayerScript.push('    if (fastBoxBlurEffect) {');
    grainLayerScript.push('        fastBoxBlurEffect.enabled = false;');
    grainLayerScript.push('    }');
    grainLayerScript.push('}');

    return grainLayerScript.join('\n');
}

function resetFlickerLayer() {
    var flickerLayerScript = [];

    flickerLayerScript.push('var flickerLayer = app.project.activeItem.layer("FLICKER");');
    flickerLayerScript.push('if (flickerLayer) {');
    flickerLayerScript.push('    var exposureEffect = flickerLayer.property("ADBE Effect Parade").property("Exposure");');
    flickerLayerScript.push('    if (exposureEffect) {');
    flickerLayerScript.push('        exposureEffect.enabled = true;');
    flickerLayerScript.push('    }');
    flickerLayerScript.push('}');

    return flickerLayerScript.join('\n');
}

function resetShakeLayer() {
    var shakeLayerScript = [];

    shakeLayerScript.push('var shakeLayer = app.project.activeItem.layer("SHAKE");');
    shakeLayerScript.push('if (shakeLayer) {');
    shakeLayerScript.push('    var shake1Effect = shakeLayer.property("ADBE Effect Parade").property("Shake1");');
    shakeLayerScript.push('    if (shake1Effect) {');
    shakeLayerScript.push('        shake1Effect.enabled = true;');
    shakeLayerScript.push('    }');
    shakeLayerScript.push('    var shake2Effect = shakeLayer.property("ADBE Effect Parade").property("Shake2");');
    shakeLayerScript.push('    if (shake2Effect) {');
    shakeLayerScript.push('        shake2Effect.enabled = false;');
    shakeLayerScript.push('    }');
    shakeLayerScript.push('    var shake3Effect = shakeLayer.property("ADBE Effect Parade").property("Shake3");');
    shakeLayerScript.push('    if (shake3Effect) {');
    shakeLayerScript.push('        shake3Effect.enabled = false;');
    shakeLayerScript.push('    }');
    shakeLayerScript.push('}');

    return shakeLayerScript.join('\n');
}

// Cancel button functionality
cancelButton.addEventListener('click', function() {
    removeAdjustmentLayers();
});

// Function to reset UI elements to default values
function resetUI() {
    brightnessSlider.value = 0;
    grainSlider.value = 20;
    fpsDropdown.value = '0';
    colorDropdown.value = '[1, 1, 1]';
    shakeDropdown.value = 'SHAKE LOW';
    flickerToggle.classList.add('active');
    rgbDropdown.value = 'OFF';
    eyeToggle.classList.add('active');
    invertToggle.classList.remove('active');
    updateSliderFill(brightnessSlider);
    updateSliderFill(grainSlider);
}

// Function to update the red fill for a given slider
function updateSliderFill(slider) {
    slider.style.setProperty('--value', (slider.value - slider.min) / (slider.max - slider.min) * 100 + '%');
}

// Add event listeners to all dropdowns
document.querySelectorAll('select').forEach(function(dropdown) {
    dropdown.addEventListener('wheel', function(event) {
        // Check if the dropdown is not disabled
        if (!dropdown.classList.contains('disabled')) {
            // Prevent the default scroll behavior
            event.preventDefault();

            // Determine the current selected index
            var selectedIndex = dropdown.selectedIndex;

            // Update the selected index based on scroll direction
            if (event.deltaY < 0 && selectedIndex > 0) {
                // Scroll up: Decrease the selected index
                dropdown.selectedIndex = selectedIndex - 1;
            } else if (event.deltaY > 0 && selectedIndex < dropdown.options.length - 1) {
                // Scroll down: Increase the selected index
                dropdown.selectedIndex = selectedIndex + 1;
            }

            // Trigger change event to ensure that any change listeners are notified
            dropdown.dispatchEvent(new Event('change'));
        }
    });
});

