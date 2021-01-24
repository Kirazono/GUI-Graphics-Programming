  
var gl = null;

var cone = null;

function init() {
    var canvas = document.getElementById( "webgl-canvas" );

  cone = new Cone (gl, n)
  
    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
  cone.render();
}

window.onload = init;
