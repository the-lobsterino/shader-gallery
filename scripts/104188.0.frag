#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

//	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );


	vec3 black  = vec3(0.0,0.0,1000.0);
	vec3 white  = vec3(1.0,1.0,1.0);
	vec3 blue   = vec3(0.0,0.0,1.0);
	vec3 orange = vec3(1.0,0.67,0.0);

	vec3 color;

	vec3 blueGradientRev = (1.0-position.x) * blue;
	vec3 orangeGradient = position.x * orange;
	
	vec3 blueTogreen;
	if (position.x < 0.5) {
		blueTogreen = (1.0-2.0*position.x) * blue;
	} else {
		blueTogreen = 2.0*(position.x-0.5) * orange;
	}

	vec3 orangeToBlue;
	if (position.x < 0.5) {
		orangeToBlue = (1.0-2.0*position.x) * orange;
	} else {
		orangeToBlue = 2.0*(position.x-0.5) * blue;
	}
	
	float m;
	//m = time - floor(time);
	//m = m*4.0;
	m = mod(time/4.0, 4.0);
	if (m < 1.0) {
		color = m * blueTogreen;
	} else if (m < 2.0) {
		color = (2.0-m) * blueTogreen;
	} else if (m < 3.0) {
		color = (m-2.0) * orangeToBlue;
	} else {
		color = (4.0-m) * orangeToBlue;
	}
	
	//color = color * m;
	//color = (blueGradientRev + orangeGradient);
	//color = blueToOrange;
	//color = orangeToBlue;
	
	gl_FragColor = vec4(color,1.0);

}