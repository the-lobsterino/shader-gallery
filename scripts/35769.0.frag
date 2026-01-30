#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4( vec3( 0 ), 1.0 );
	#define fill() gl_FragColor = vec4( vec3( 1,1,0 ), 1.0 )
	#define bfill() gl_FragColor = vec4( vec3( 0,0,1 ), 1.0 )
	vec2 sp = surfacePosition;
	sp.x -= 0.1;
	sp.y -= sp.x*0.25;
	vec2 uv = sp;
	vec2 luv = uv;
	
	if(abs(uv.y) < 0.25 && abs(uv.x+0.5) < 0.01) fill();
	
	uv = sp;uv.x += 0.5*uv.y;
	if(abs(uv.y) < 0.25 && abs(uv.x+0.365) < 0.07 && sp.x > -0.77) fill();
	
	uv = sp;
	if(abs(uv.y+0.1) < 0.03 && abs(uv.x+0.42) < 0.7) fill();


	uv = sp;
	if(abs(uv.y) < 0.25 && abs(uv.x-0.285) < 0.47) fill();
	
}