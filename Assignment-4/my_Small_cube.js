var cube = undefined;
var gl = undefined;

// referring to the drawing of the square faces(?)
var angle = 0;

function init ()
{
    //gotta have the canvas before we start to create anything for the image that is to be displayed
    var canvas = document.getElementById("webgl-canvas");

    //utilities used for WebGL client
    gl = WebGLUtils.setupWebGL(canvas);

    // check if gl was actually imported
    if (!gl) 
    {
        alert("Unable to setup WebGL properly.");
        return;
    }

    gl.clearColor( 0.5, 0.5, 0.5, 1.0);
    

    //what is this for(?)
    gl.enable(gl.DEPTH_TEST);

    cube = new my_Cube();

    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    angle += 2.0; //degrees? is that enough for a cube?

    cube.MV = rotate  (angle, [-1.5, 1.5, -0.5]);

    cube.render();

    requestAnimationFrame(render); //schedule a second call to render, what for?

}

window.onload = init;