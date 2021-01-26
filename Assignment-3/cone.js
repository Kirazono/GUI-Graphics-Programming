  
var gl = null;

var cone = null;

function init() {
    var canvas = document.getElementById( "webgl-canvas" );

  
    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }
  
    cone = new Cone (gl, 20)

    render();
}

function render() {
  cone.render();
}

window.onload = init;
