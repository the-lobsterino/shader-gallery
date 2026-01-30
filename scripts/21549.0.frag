#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iter=10;
const vec3 c=vec3(0.75,0.5,1.3);
const float stepLength=16.0;

const float stepSize=0.017;
const float layers=80.0;
const vec3 spaceColor=vec3(0.0);
const vec3 starColor=vec3(1.0);

vec3 kali(vec3 z){
	z.z*=0.25;
	z=2.0*abs(fract(z)-0.5);
	for(int j=0;j<iter;j++){
		z=abs(z)/dot(z,z)-c;
	}
	return z;
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-0.5;
	p.x*=resolution.x/resolution.y;
	p *= 4.0;
	
	vec3 rayDir=normalize(vec3(p.x,p.y,1.0));
	vec3 camPos=vec3(0.65,0.65,0.07+time*.0375+2.0/length(p*p));
	camPos.xy+=0.1*(mouse-0.5);
	
	for(float i=0.0;i<layers;i++){
		camPos+=stepSize*rayDir;
		
		vec3 z=kali(camPos);
		
		float m=smoothstep(0.0,stepLength,length(z));
		vec3 col=mix(spaceColor,starColor,m)*m*(layers-i);
		gl_FragColor+=1.0/layers*vec4(col,1);
	}
}