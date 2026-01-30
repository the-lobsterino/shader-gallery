#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float TorusSize = 1.0;
const float TorusRadius = 0.2;
const float TorusTilt = 1.2;

const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

float distFuncTorus(vec3 p){
	float t=time*1.0;
	
	vec3 a;
	vec3 b;
	
	a.x=p.x*cos(t)-p.z*sin(t);
	a.y=p.y;
	a.z=p.x*sin(t)+p.z*cos(t);
	b.x=a.x;
	b.y=a.y*cos(TorusTilt)-a.z*sin(TorusTilt);
	b.z=a.y*sin(TorusTilt)+a.z*cos(TorusTilt);
	vec2 r = vec2(length(b.xy) - TorusSize, b.z);
	
	return length(r) - TorusRadius;
}

vec3 getNormal(vec3 p){
	float d = 0.0001;
	return normalize(vec3(
		distFuncTorus(p + vec3(  d, 0.0, 0.0)) - distFuncTorus(p + vec3( -d, 0.0, 0.0)),
		distFuncTorus(p + vec3(0.0,   d, 0.0)) - distFuncTorus(p + vec3(0.0,  -d, 0.0)),
		distFuncTorus(p + vec3(0.0, 0.0,   d)) - distFuncTorus(p + vec3(0.0, 0.0,  -d))
	));
}

void main(void){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float t=time;
	
	vec3 CameraPos = vec3(0.0,  0.0,  2.0);
	vec3 CameraDir = vec3(0.0,  0.0, -1.0);
	vec3 CameraUp  = vec3(0.0,  1.0,  0.0);
	vec3 CameraSide = cross(CameraDir, CameraUp);
	float targetDepth = 1.0;
	
	vec3 ray = normalize(CameraSide * p.x + CameraUp * p.y + CameraDir * targetDepth);
	
	float distance = 0.0;
	float RayLen = 0.0;
	vec3  RayPos = CameraPos;
	for(int i = 0; i < 64; i++){
		distance = distFuncTorus(RayPos);
		RayLen += distance;
		RayPos = CameraPos + ray * RayLen;
	}
	
	if(abs(distance) < 0.1){
		vec3 normal = getNormal(RayPos);
		float diff = clamp(dot(lightDir, normal), 0.0, 1.0);
		gl_FragColor = vec4(vec3(mix(0.5,1.0,diff),mix(0.2,0.9,diff),mix(0.0,0.6,diff)), 1.0);
	}else{
		if(sin(gl_FragCoord.y*0.05)+sin(gl_FragCoord.x*0.05) < 0.0){
			gl_FragColor = vec4(vec3(0.8,0.8,0.0), 1.0);
		}else{
			gl_FragColor = vec4(vec3(0.0,0.6,0.6), 1.0);
		}
	}
}