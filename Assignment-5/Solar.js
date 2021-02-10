/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

var canvas;
var gl;

//---------------------------------------------------------------------------
//
//  Declare our array of planets (each of which is a sphere)
//
// The list of planets to render.  Uncomment any planets that you are 
// including in the scene. For each planet in this list, make sure to 
// set its distance from the Sun, as well its size, color, and orbit
// around the Sun. 

var Planets = {
  Sun : undefined,
  Mercury : undefined,
  Venus : undefined,
  Earth : undefined,
  Moon : undefined,
  Mars : undefined,
  Jupiter : undefined,
  Saturn : undefined,
  Uranus : undefined,
  Neptune : undefined,
  Pluto : undefined
};

// Viewing transformation parameters
var V;  // matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 120;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;

  for (var name in Planets ) {

    // Create a new sphere object for our planet, and assign it into the
    // appropriate place in the Planets dictionary.  And to simplify the code
    // assign that same value to the local variable "p", for later use.

    var planet = Planets[name] = new Sphere();

    // For each planet, we'll add a new property (which itself is a 
    // dictionary) that contains the uniforms that we will use in
    // the associated shader programs for drawing the planets.  These
    // uniform's values will be set each frame in render().

    planet.uniforms = { 
      color : gl.getUniformLocation(planet.program, "color"),
      MV : gl.getUniformLocation(planet.program, "MV"),
      P : gl.getUniformLocation(planet.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() 
{
    time += timeDelta;
    
    var ms = new MatrixStack();
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    V = translate(0.0, 0.0, -0.5*(near + far));
    ms.load(V);
    
    var sun = Planets["Sun"];
    var data = SolarSystem["Sun"];
    
    sun.PointMode = false;
    
    ms.push();
    ms.scale(data.radius);
    gl.useProgram(sun.program);
    gl.uniformMatrix4fv(sun.uniforms.MV, false, flatten(ms.current()));
    gl.uniformMatrix4fv(sun.uniforms.P, false, flatten(P));
    gl.uniform4fv(sun.uniforms.color, flatten(data.color));
    sun.render();
    
    // NOW THE ACTUAL PLANETS
    RenderPlanet(ms, "Earth", ["Moon"]);
    
    ms.pop();
    
    window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function RenderPlanet(ms, name, moons)
{
    var planet = Planets[name];
    var data = SolarSystem[name];
    planet.PointMode = false;
    
    // Up the scope.
    ms.push();
    
    // Actual matrix stuff
    ms.rotate((1.0 / data.year) * time, [0.0, 1.0, 0.0]);
    ms.translate(data.distance, 0, 0);
    ms.scale(data.radius);
    
    // Rendering stuff
    gl.useProgram(planet.program);
    gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
    gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
    gl.uniform4fv(planet.uniforms.color, flatten(data.color));
    planet.render();
    
    for(var i = 0; i < moons.length; i++)
    {
        RenderMoon(ms, moons[i]);
    }
    
    // Drop the scope.
    ms.pop();
}

function RenderMoon(ms, name)
{
    console.log(name);
    var moon = Planets[name];
    var data = SolarSystem[name];
    moon.PointMode = false;
    
    // Up the scope.
    ms.push();
    
    // Actual matrix stuff
    ms.rotate((1.0 / data.year) * time, [0.0, 1.0, 0.0]);
    ms.translate(data.distance, 0, 0);
    ms.scale(data.radius);
    
    // Rendering stuff
    gl.useProgram(moon.program);
    gl.uniformMatrix4fv(moon.uniforms.MV, false, flatten(ms.current()));
    gl.uniformMatrix4fv(moon.uniforms.P, false, flatten(P));
    gl.uniform4fv(moon.uniforms.color, flatten(data.color));
    moon.render();
    
    // Drop the scope.
    ms.pop();
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;
