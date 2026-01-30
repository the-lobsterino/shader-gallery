#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NOISE .5/255.0

void main( void ) {

	// SKID FROM TENACITY(MINECRAFT HACKED CLIENT). XD
	// WHNFIDEGWI BFBERG HIERHIJGHE
	// JUST A SAVE
	
	vec2 uv = ( gl_FragCoord.yx / resolution.yx );
	
	highp vec2 coordinates = gl_FragCoord.xx / resolution.xx;
	vec2 position = coordinates;
	
	float angle = mod(time * 1000.0 / 15.0 + 1.0, 360.0);
	
	if (angle >= 180.0) {
		angle = (360.0 - angle) * 2.0;
	} else {
		angle = angle * 2.0;
	}
	
	float amount = min(1.0, max(0.0, angle / 360.0));

	gl_FragColor = vec4(mix(mix(vec3(236.0/255.0, 133.0/255.0, 209.0/255.0),vec3(100.0/255.0, 180.0/255.0, 255.0/255.0),uv.y + (amount)), 
					 mix(vec3(100.0/255.0, 180.0/255.0, 255.0/255.0),vec3(236.0/255.0, 133.0/255.0, 209.0/255.0), amount),
					 uv.y) + 0.13 +  mix(NOISE, -NOISE, fract(sin(dot(coordinates.yy, vec2(12.9898, 78.233))) * 43758.5453)), 1.0);

}