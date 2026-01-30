#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI=3.14159265359;
const float speed=0.6;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-0.5;
	float size=0.05;
	float thickness=0.02;
	p.x*=resolution.x/resolution.y;
	float d=smoothstep(thickness+0.01,thickness,abs(length(p)-size));
	d*=smoothstep(0.01,1.0,fract(atan(p.x,p.y)/(2.0*PI)-speed*time));
	d+=step(d,0.1)*smoothstep(thickness+0.01,thickness,distance(p,size*vec2(sin(speed*2.0*PI*time),cos(speed*2.0*PI*time))));
	
	gl_FragColor=vec4(d);

}