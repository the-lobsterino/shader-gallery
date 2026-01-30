//Sinus fire
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = ( gl_FragCoord.xy -.7*resolution.xy )/resolution.y;
	float x = uv.x*3.;
	float y = uv.y*4.;
	float m = 1.-(y*9.)*(12.+sin(-time/4.)*.6)*.7+sin(y*3.+x*2.-time*9.)*sin(y*1.7-x*6.-time+sin(x*3.-y*.3-time*2.)+cos(time/6.-y*6.+x*6.)/3.)*69.;
	gl_FragColor = vec4( vec3( m*.016,m*.008,m*.001), 3.0 );
}