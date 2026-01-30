//@FL1NE

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;


const float sphereSize = 4.0;
const vec3 lightDir = vec3(-0.57, 0.57, 0.57);


vec3 Hue(float hue){
	vec3 rgb = fract(hue + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0));
	rgb = abs(rgb * 2.0 - 1.0);
	return clamp(rgb * 3.0 - 1.0, 0.0, 1.0);
}


vec3 trans(vec3 p){
	return mod(p, 64.0) - vec3(32.0, 32.0, 4.0);	
}


float lengthN(vec3 v, float n){
	vec3 tmp = pow(abs(v), vec3(n));
	return pow(tmp.x + tmp.y + tmp.z, 1.0 / n);
}

float distanceFunc(vec3 p){
	return lengthN(trans(p), 16.0) - sphereSize;
}


vec3 getNormal(vec3 p){
	float d = 0.0001;
	return normalize(vec3(
		distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
		distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
		distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
		));
}


void main( void ) {
	vec2 p = surfacePosition;
	
	vec3 cPos = vec3(sin(time) * 100.0, cos(time * 0.25) * 250.0, -fract(time * 0.75) * 128.0);
	vec3 cDir = vec3(0.0, 0.0, -1.0);
	vec3 cUp = vec3(sin(time), cos(time), 1.0);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = .5;
	
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

	
	float dist = 0.0;
	float rLen = 0.0;
	vec3 rPos = cPos;
	
	for(int i = 0; i < 32; i++){
		dist = distanceFunc(rPos);
		rLen += dist;
		rPos = cPos + ray * rLen;		
	}
	
	if(dist < 0.001){
		vec3 normal = getNormal(rPos);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		gl_FragColor = vec4(vec3(diff) + Hue(ray.z + sin(time * 0.25)), 1.0);
	}else{
		//gl_FragColor = vec4(dist * 0.0);
		gl_FragColor = vec4(dist * sin(time * 0.0)) + texture2D(backbuffer, (gl_FragCoord.xy / resolution.xy)) * 0.65;
	}
}