#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SPEED 5.

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy );
	vec2 c = vec2(0.);
	for(float i = 0.0; i < 10.0; i++){
		float r1 = pow(length(uv - vec2(600. - i * 70., 200)), 0.6);
		c.x += sin( r1 * 0.3 - time * SPEED) * i;
		c.y += 0.1 / (2. - sin(r1/100. - time));
		
		c.x *= pow(0.1, c.y);
		c.y /= pow(0.6, c.x);
	}



	gl_FragColor = vec4( vec3(c, 1. - c.x * c.y), 1.0 );

}