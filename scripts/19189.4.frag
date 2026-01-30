#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
        float xscale = 10.0;
	float x = position.x *xscale;
	
	float m = mod(time, 10.);
	float f = exp(-((x-m)*(x-m)))/sqrt(2.*PI);
	float color = 200.*abs(f-position.y);
	gl_FragColor = vec4( vec3( color, color, color), 1.0 );

}