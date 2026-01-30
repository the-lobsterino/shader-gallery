#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat3 ry = mat3(cos(time), 0, -sin(time), 0, 1, 0, sin(time), 0, cos(time));

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}
float sdBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float opU(float d1, float d2) {
	return min(d1, d2);
}
float opS(float d1, float d2) {
	return max(-d1, d2);
}
float opI(float d1, float d2) {
	return max(d1, d2);
}

float displace(vec3 p) {
	return sin(p.x)*sin(p.y + 1.3*time)*sin(p.z);
}

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}
float opDisplace(vec3 p) {
	
	vec3 q = p+vec3(0,.7,0);
	float w = 0.2;
	float d1 = sdBox(q, vec3(w, .3, w));
	
	#define stack() {w *= 0.67;q.y -= 0.6;d1 = opU(d1, sdBox(q, vec3(w, .3, w)));}
	stack();stack();stack();stack();
	q.z += 0.2;
	
	float at = atan(q.x, q.y);
	q = 0.7*rotate(q, vec3(0,0,1), 6.*fract(time)+5.*at);
	stack();
	
	float d2 = 0.;//displace(p);
	return d1+d2;
}

float dist(vec3 p) {
	return opU(opDisplace(p), sdBox(p + vec3(0, 1.1, 0), vec3(3, 0.1, 3)));
}


vec3 calcNormal(vec3 p) {
	float d = 0.001;
	return normalize(vec3(
		dist(p + vec3(d, 0, 0)) - dist(p + vec3(-d, 0, 0)),
		dist(p + vec3(0, d, 0)) - dist(p + vec3(0, -d, 0)),
		dist(p + vec3(0, 0, d)) - dist(p + vec3(0, 0, -d))
		));
}


struct ray {
	vec3 rayDir;
	vec3 position;
	vec3 normal;
	int steps;
	float t;
};

const int maxStep = 100;
ray trace(vec3 from, vec3 rayDir) {
	float t = 0.0;
	vec3 p = vec3(0);
	int steps = 0;
	for(int i = 0; i < maxStep; i++) {
		p = from + t*rayDir;
		float d = dist(p)/2.0;
		t += d;
		if(d < 0.01) {
			p -= 0.001*rayDir;
			steps = i;
			break;
		}
	}
	return ray(rayDir, p, calcNormal(p), steps, t);
}
vec3 spin(vec3 v)
{
    for(int i = 1; i < 6; i++)
    {
        v+=(rotate((v),vec3(sin(v.x),sin(v.y+1.04719),sin(v.z+4.18879))*0.5+0.5,float(i*i)));
	v=float(i)*vec3(sin(v.x),sin(v.y+1.04719),sin(v.z+4.18879))*0.5+0.5;
    }
    return sin(v.xyz)*0.5+0.5;
}
vec3 lightPos = vec3(2, 1.5, 2);
const float mix1 = 0.3;
const float mix2 = 0.3;
const float shininess = 12.0;
vec3 shade(vec3 position, vec3 rayDir, vec3 normal, int steps) {
	ray tr = trace(lightPos, normalize(position - lightPos));
	bool visible = distance(tr.position, position) < 0.1;
	float diffuse = max(dot(normal, -tr.rayDir), 0.0);
	float specular = pow(max(dot(rayDir, reflect(normal, -tr.rayDir)), 0.0), shininess);
	vec3 directColor = float(visible)*vec3(mix(diffuse, specular, mix1));
	
	float ao = 1.0 - float(steps)/float(maxStep);
	vec3 indirectColor = ao * vec3(.6, .7, 1);
	
	return vec3(mix(directColor, indirectColor, mix2));
}

void main( void ) {
	vec2 uv = (2.0*gl_FragCoord.xy - resolution)/resolution.x;
	
	vec3 camPos = vec3(5.0*cos(time/2.0), 1, -5.0*sin(time/2.0));
	vec3 camFront = normalize(-camPos);
	vec3 camUp = vec3(0, 1.0, 0);
	vec3 camRight = cross(camFront, camUp);
	
	vec3 rayDir = normalize(uv.x*camRight + uv.y*camUp + 1.0*camFront);
	ray tr = trace(camPos, rayDir);
	vec3 color = shade(tr.position, tr.rayDir, tr.normal, tr.steps);
	
	gl_FragColor = vec4(color, 1.0);
}