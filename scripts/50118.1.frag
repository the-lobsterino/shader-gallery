#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define V 3
void main( void ) {

#if V==1
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	//p *= mouse.x;
	
	float A=20.0;
	float e = cos(A*A*p.x*p.x+A*A*p.y*p.y) - sin(A*p.x+A*p.y)-1.0;

	gl_FragColor = vec4(abs(e));
#elif V==2
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	//p *= mouse.x;
	
	float A=20.0;
	float e = tan(A*A*p.x*p.x/A*A*p.y*p.y) - sin(A*p.x*cos(time)-A*p.y*sin(time))-1.0;

	gl_FragColor = vec4(abs(e));	
#elif V==3
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	//p *= mouse.x;
	
	float A=0.5;
	float e=1.0;
	if(abs(p.x)>0.01 && p.y<-0.02) {
		e = cos(1.0/(A*p.x))-sin(1.0/(A*p.y))-1.0;
	}

	gl_FragColor = vec4(abs(e));	
	
#endif
}