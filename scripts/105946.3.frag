#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float actualx = (gl_FragCoord.x - resolution.x / 2.0);
	float actualy = (resolution.y / 2.0 - gl_FragCoord.y);
	float calculatedx = 1.0 / actualx * 5000.0;
	float calculatedy = -calculatedx;
	
	if(int(actualy)  == int(calculatedy)){
		float c1 = sin(time);
		float c2 = cos(time);
		float c3 = cos(time) - sin(time);
		gl_FragColor = vec4(c3,c1,c2,1.0);

	}
	
	if (int(gl_FragCoord.x) == int((resolution.x / 2.0))){
		gl_FragColor = vec4(1.0,1.0,1.0, 1.0);
	}
	
	else if (int(gl_FragCoord.y) == int((resolution.y / 2.0) - 1.0 )) {
		gl_FragColor = vec4(1.0,1.0,1.0, 1.0);
	}
	
	

}