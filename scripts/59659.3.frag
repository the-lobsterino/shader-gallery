#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

float distSphere(vec3 p){
	return length(p) - 1.0;
}

float distanceFunc(vec3 p){
	return distSphere(p);
}

vec3 getNormal(vec3 p){
	float d = 0.0001;
	return normalize(
		vec3(
			distanceFunc(p + vec3( d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
			distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc( p + vec3(0.0, -d, 0.0)),
			distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
			)
		);
}

void main( void ) {

	vec2 p = (( gl_FragCoord.xy / resolution.xy)) - 0.5;

	vec3 cPos = vec3(0.0, 0.0, 3.0);
	vec3 cDir = vec3(0.0, 0.0, -1.0);
	vec3 cUp = vec3(0.0, 1.0, 0.0);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 0.1;
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
	
	float distance = 0.0;
	float rLen = 0.0;
	vec3 rPos = cPos;
	for( int i = 0; i<16; i++){
		distance = distanceFunc(rPos);
		rLen += distance;
		rPos = cPos + ray * rLen;
	}
	
	vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
	
	if(abs(distance) < 0.001){
		vec3 normal = getNormal(rPos);
		float diff = clamp(dot(lightDir, normal),0.0, 1.0);
		color.xy *= diff;
	}
	else{
		color = vec4(vec3(0.0),1.0);
	}
	
	
	gl_FragColor = color;

}