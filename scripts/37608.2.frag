#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;

	vec3 color = vec3(0.0);
	color.r = 1.0;
	
	if(mod(p.x, 0.1) < 0.05 * abs(sin(time)) ^^ mod(p.y, 0.1) < 0.05 * abs(cos(time))) {
		color += mod(p.x, 0.5) + mod(p.y, 0.5);
	}
	
	if(mod(p.x, 0.2) < 0.05 * abs(cos(time)) ^^ mod(p.y, 0.2) < 0.05 * abs(sin(time))) {
		color -= mod(p.x, 0.5) + mod(p.y, 0.5);
	}
	
	if(mod(p.x, 0.05) < 0.05 * abs(sin(time)) ^^ mod(p.y, 0.05) < 0.05 * abs(cos(time))) {
		color *= mod(p.x, 0.5) + mod(p.y, 0.5);
	}

	gl_FragColor = vec4( color, 1.0 );

}

// sina5an