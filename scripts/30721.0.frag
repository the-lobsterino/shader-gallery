#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float PI2 = 2.0*3.141592653589793;
const float fov = 0.5*60.0/360.0*PI2;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 getNormal(vec3 p){
	float d = 0.001;
	return normalize(vec3(
		length(p+vec3(d,0.0,0.0))-length(p+vec3(-d,0.0,0.0)),
		length(p+vec3(0.0,d,0.0))-length(p+vec3(0.0,-d,0.0)),
		length(p+vec3(0.0,0.0,d))-length(p+vec3(0.0,0.0,-d))));
}

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy-resolution)/min(resolution.x,resolution.y);
	vec2 m = vec2((2.0*mouse.x-1.0)*resolution.x,(2.0*mouse.y-1.0)*resolution.y)/min(resolution.x,resolution.y);
	vec3 cPos = vec3(0.0,0.0,3.0);
	vec3 cUp = vec3(0.0,1.0,0.0);
	vec3 cDir = vec3(0.0,0.0,-1.0);
	vec3 cSide = cross(cDir,cUp);
	float targetDepth = 1.0;

	vec3 ray = normalize(cSide*p.x+cUp*p.y+cDir*targetDepth);
	
	vec3 rPos = cPos;
	for(int i=0;i<16;i++){
		rPos += ray*(length(rPos)-1.0*(sin(time)+1.0));
	}
	if(abs(length(rPos)-1.0*(sin(time)+1.0))<0.1)gl_FragColor = vec4(vec3(dot(normalize(vec3(m,1.0)),getNormal(rPos))),1.0);
}