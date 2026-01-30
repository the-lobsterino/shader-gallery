#ifdef GL_ES
precision mediump float;
#endif

//Lut generation by robobo1221
//http://www.robobo1221.net/

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float numRows = 8.0;

vec3 generateLut(vec2 p)
{
	if (p.x * numRows > numRows || p.y * numRows > numRows) return vec3(0.0);
	
	vec2 coeff = vec2(p.x, 1.0 - p.y);
	
	float tileID = (floor(coeff.x * numRows) + floor(coeff.y * numRows) * numRows) / (numRows * numRows);
	vec2 tileCoord = fract(coeff * numRows);
	
	return vec3(tileCoord, tileID);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / max(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	     color = generateLut(position * 2.0);

	gl_FragColor = vec4(color, 1.0 );

}