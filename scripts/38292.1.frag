// sierpinski pyramide with triangles
// see also: http://glslsandbox.com/e#37866.0

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float st = sin(time);
float ct = cos(time);
mat3 rx = mat3(1, 0, 0, 0, ct, -st, 0, st, ct);
mat3 ry = mat3(ct, 0, st, 0, 1, 0, -st, 0, ct);
mat3 rz = mat3(ct, -st, 0, st, ct, 0, 0, 0, 1);

float dist(vec3 p) {
	vec3 v1 = vec3( 1, 1, 1);
	vec3 v2 = vec3(-1,-1, 1);
	vec3 v3 = vec3( 1,-1,-1);
	vec3 v4 = vec3(-1, 1,-1);
	
	vec3 c;
	float d1, d2;
	vec3 q = rx*ry*rz*p;
	for(int i = 0; i < 10; i++) {
		c = v1; d1 = distance(q, v1);
		d2 = distance(q, v2); if(d2 < d1) {c = v2; d1 = d2;}
		d2 = distance(q, v3); if(d2 < d1) {c = v3; d1 = d2;}
		d2 = distance(q, v4); if(d2 < d1) {c = v4; d1 = d2;}
		q = 2.0*q - c;
	}
	
	return length(q)*pow(2.0, float(-10));
}

vec3 calcNormal(vec3 p) {
	float d = 0.001;
	float v = dist(p);
	return normalize(vec3(dist(p + vec3(d, 0, 0)) - v,
			      dist(p + vec3(0, d, 0)) - v,
			      dist(p + vec3(0, 0, d)) - v));
}

vec4 trace(vec3 from, vec3 rayDir) {
	float totalDist = 0.0;
	float steps = 0.;
	vec3 p = vec3(0);
	vec3 normDir = normalize(rayDir);
	for(int i = 0; i < 30; i++) {
		p = from + totalDist*normDir;
		float d = dist(p) / 1.1;
		totalDist += d;
		steps++;
		if(d < 0.007) 
		  break;
		
	}
	return vec4(p, 1.0 - steps / 30.);
}

void main( void ) {
	vec2 uv = (2.0*gl_FragCoord.xy - resolution)/resolution.x;
	
	vec3 camPos   = vec3(0, 0,-5);
	vec3 camFront = vec3(0, 0, 1);
	vec3 camUp    = vec3(0, 1, 0);
	vec3 camRight = cross(camFront, camUp);

	vec3 rayDir = uv.x*camRight + uv.y*camUp + 1.6*camFront;
	
	vec4 tr = trace(camPos, rayDir);

	gl_FragColor = tr*tr;
//	gl_FragColor = vec4(1.0, 1.0, 0.3, 1)*tr.w;
//	gl_FragColor = vec4(vec3(tr.w), 1.0);
}