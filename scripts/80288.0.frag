//Sinus fire
#extension GL_OES_standard_derivatives : disable
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = ( gl_FragCoord.xy -.2*resolution.xy )/resolution.y;
	float x = uv.x*1000.;
	float y = uv.y*13.-2.;
	float m = 1.-(y*1.)*(10.+sin(-time/40.)*4.60)*.7+cos(y*1.+x*2.-time*9.)*cos(y*10.2-x*6.-time+sin(x*9.-y*.9-time*8.)+sin(time/18.-y*9.+x*5.)/5.)*108.;
	gl_FragColor = vec4( vec3( m*5.0,m*5.0,m*5.0), 100.0);
}