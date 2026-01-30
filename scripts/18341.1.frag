#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define PI 3.1415926535897932384626433832795
float rand(vec2 co){
	return fract(sin(dot(co.xy, vec2(12.9898,78.233)))*43758.5453);
}
void main( void ) {

	vec2 p = surfacePosition*30. ;

	float r = length(p);
	float rc= floor(r+.5);
	float t=rc*time*0.01;
	mat2 m = mat2(cos(t),sin(t),-sin(t),cos(t));
	p*=m;
	
	float a = atan(p.y,p.x)+PI;
	
	float nc= floor(rc*2.*PI);
	float ax= (PI*2.)/nc;
	
	float ac= (floor((a/ax))+0.5)*ax+PI;

	
	vec2 cc = vec2(cos(ac)*rc,sin(ac)*rc);
	
	float rn = rand(vec2(rc,ac));
	float color = 0.0;
	float ln=length( p-cc );
	if( ln < rn*0.5)
		color =2.-ln*3.;

	
	color *= rand(vec2(ac,rc))*2.;
	gl_FragColor = vec4( vec3( color, color*color, color*color*color*0.2), 1. );

}