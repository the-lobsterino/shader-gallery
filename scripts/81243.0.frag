#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 20.0 - resolution) / min(resolution.x, resolution.y);
	
	if (mod(floor(102.75*p.x+1.8), 2.) == 1.0) {
		gl_FragColor = vec4(mix(vec3(sin(time),0.3,0.0), vec3(0.2,sin(-time),0.4), abs(sin(p.x))),sin(p.x*800.));
	} else {
		gl_FragColor = vec4(0.);
	}

}