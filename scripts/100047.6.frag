// someone please make this shader with ones and hll
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

vec3 fn(float t)
{
	t*=256.0;
	float w = mod(t,PI);// * PI/2.0;
	float p = mod(t,TAU);
	
	return vec3( cos(w)*sin(p), sin(w)*sin(p), cos(p) );
}

void main( void ) 
{	
	vec2 p = surfaceSize/2.0-surfacePosition;//gl_FragCoord.xy/12.-resolution/4.;
	//p = vec2(floor((dot(p,p))/9.6/cos(abs(mouse.x)))*0.7,34.*atan(p.y,p.x));
	float c=dot(p,p);//-mod( p.y + (time*(mouse.y+.01+mod(p.x,0.65)/2.)), cos( p.x+p.y )), d=c*c*c*c;
//	gl_FragColor = vec4( d,c,d,1 );
	gl_FragColor = vec4( fn(c)*0.5+0.5,1 );
}