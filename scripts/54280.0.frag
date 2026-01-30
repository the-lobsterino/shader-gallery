#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	
	float col=0.0;
	
	
	float num=20.0;
	float angle=2.0*3.14159/num/2.0*0.4;
	
	float angCurr=atan(pos.y,pos.x);
	float m=mod(angCurr,angle);
	col=1.0*m;
	
	
	if(distance(pos,vec2(0.0))<0.1){
		col=0.0;
	}
	
	float koef=distance(pos,vec2(0.0))+abs(sin(time));
	
	vec3 color=vec3(col*sin(koef*20.0));
	
	color.z*=abs(4.0/angCurr);
	color.y*=pow(angCurr,m);
	
	
	gl_FragColor=vec4(color*4.0,1.0);
}