function Cube(gl, size, vertexShaderId, fragmentShaderId) 
{
    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "cube-vertex-shader";
    var fragShdr = fragmentShaderId || "cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
	
	//Fits the cube in the frame.
	girth = girth / 2;
	
    this.positions = { 
        values : new Float32Array([
			// Front face
			-girth, -girth,  girth,
			 girth, -girth,  girth,
			 girth,  girth,  girth,
			-girth,  girth,  girth,

			// Back face
			-girth, -girth, -girth,
			-girth,  girth, -girth,
			 girth,  girth, -girth,
			 girth, -girth, -girth,

			// Top face
			-girth,  girth, -girth,
			-girth,  girth,  girth,
			 girth,  girth,  girth,
			 girth,  girth, -girth,

			// Bottom face
			-girth, -girth, -girth,
			 girth, -girth, -girth,
			 girth, -girth,  girth,
			-girth, -girth,  girth,

			// Right face
			 girth, -girth, -girth,
			 girth,  girth, -girth,
			 girth,  girth,  girth,
			 girth, -girth,  girth,

			// Left face
			-girth, -girth, -girth,
			-girth, -girth,  girth,
			-girth,  girth,  girth,
			-girth,  girth, -girth,
		]),
        numComponents : 3
    };
    
    this.indices = { 
        values : new Uint16Array([
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23,   // left
        ])
    };
    this.indices.count = this.indices.values.length;
	
	this.texcoords = {
		values : new Float32Array([
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
		]), 
		numComponents : 2
	};
	
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW );
	
	this.texcoords.buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.texcoords.buffer );
	gl.bufferData( gl.ARRAY_BUFFER, this.texcoords.values, gl.STATIC_DRAW );

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW );
	
	this.positions.attributeLoc = gl.getAttribLocation( this.program, "a_position" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );
	
	this.texcoords.attributeLoc = gl.getAttribLocation( this.program, "a_texcoord" );

    var matrixLoc = gl.getUniformLocation( this.program, "u_matrix" );
	var textureLoc = gl.getUniformLocation( this.program, "u_texture" );

    this.MV = undefined;
	
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));
	
	var img = new Image();
	img.src = "https://i.imgur.com/DIRhgPH.png"
	img.crossOrigin = "anonymous"
	
	img.onload = function() 
	{
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		
		if (isPowerOf2(img.width) && isPowerOf2(img.height)) 
		{
			gl.generateMipmap(gl.TEXTURE_2D);
		} 
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};

    this.render = function () {
        gl.useProgram( this.program );
		
		gl.enableVertexAttribArray( this.positions.attributeLoc );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents, gl.FLOAT, gl.FALSE, 0, 0 );
		
		gl.enableVertexAttribArray( this.texcoords.attributeLoc );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texcoords.buffer );
		gl.vertexAttribPointer( this.texcoords.attributeLoc, this.texcoords.numComponents, gl.FLOAT, gl.FALSE, 0, 0 );
		
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
	
        gl.uniformMatrix4fv( matrixLoc, gl.FALSE, flatten(this.MV) );
		
		gl.uniform1i(textureLoc, 0);
		
        gl.drawElements( gl.TRIANGLES, this.indices.count, gl.UNSIGNED_SHORT, 0 );
    }
};

function isPowerOf2(value)
{
	return (value & (value - 1)) === 0;
}
