#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
#define pi 3.14159265358
const float p = 1.0/(pi*2.0);
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	vec4 tex = texture2D(backbuffer,vec2(position.x,position.y*-2.0+1.0));
	float a = mod(atan(-position.y+0.25,position.x-0.5)*p+0.5+time/4.0,1.0);
	float l = length(position-vec2(0.5,0.25));

	gl_FragColor = vec4( vec3( max(cos(l*50.0+a*pi*6.0),0.0)+tex.rgb*vec3(0.0,0.99,0.99)), 1.0 );

}