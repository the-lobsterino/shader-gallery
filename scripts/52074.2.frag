#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotMat2 (float phi)
{
	return mat2(cos(phi), -sin(phi), sin(phi), cos(phi));	
}

float toGrid (float val, float gridSize)
{
	return floor(val / gridSize);
}

void main (void) 
{
	float gridSize = 8.0;
	vec3 gridCoords;
	
	vec2 pixel = vec2(gl_FragCoord.x - resolution.x / 2.0, gl_FragCoord.y - resolution.y / 2.0);
	
	mat2 rotMat = rotMat2(3.14 * 2.0 / 3.0);
	
	vec2 pixelFromAxisX = pixel;
	gridCoords.x = toGrid(pixelFromAxisX.x, gridSize);
	
	vec2 pixelFromAxisY = rotMat * pixel;
	gridCoords.y = toGrid(pixelFromAxisY.x, gridSize);
	
	vec2 pixelFromAxisZ = rotMat * rotMat * pixel;
	gridCoords.z = toGrid(pixelFromAxisZ.x, gridSize);
	
	vec3 gridCoordsAbs = abs(gridCoords);
	
	float i = 0.035;
	gl_FragColor = vec4(vec3(gridCoordsAbs) * i, 0);
}