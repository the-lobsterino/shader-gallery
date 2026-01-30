#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float sdSphere(vec3 p, float r) 
{
	return length(p) - r;
}

float sdBox(vec3 p, vec3 b) 
{
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float opU(float d1, float d2) {return min(d1, d2);}
float opS(float d1, float d2) {return max(-d1, d2);}
float opI(float d1, float d2) {return max(d1, d2);}



float dist(vec3 p, out vec3 color) 
{
	int c = -1;
	float d ;
	float di = 1.;
	float d1 = sdSphere(p - vec3(0, 0, 0.4), 0.75);
	if(di > d1) {di = d1; c = 0;}
	float d2 = sdBox(p - vec3(0, 0, 0.4+cos(time/2.)), vec3(0.6, 0.6, 0.6));
	if(di > d2) {di = d2; c = 1;}
	float d3 = sdBox(p - vec3(0, 0, -1.1), vec3(3, 3, 0.1));
	if(di > d3) {di = d3; c = 2;}
	if (c == 0) color = vec3(1.0, 0.1, 0.1);
	if (c == 1) color = vec3(1.0, 0.1, 0.1);
	if (c == 2) 
	{
		if (fract(p.x * 1.15) > 0.53)
	   		if (fract(p.y * 1.15) > 0.53)
				color = vec3(0, 1, 0.95);
   			else
     				color = vec3(0.8, 0.7, 0.0);
 		else 
			if (fract(p.y * 1.15) > 0.53)
     				color = vec3(0.8, 0.7, 0.0);
   			else
     				color = vec3(0, 1, 0.4);
	}
	return opU(opS(d1,d2), d3);
}


vec3 calcNormal(vec3 p) 
{
	vec3 c;
	float d = 0.01;
	return normalize(vec3(
		dist(p + vec3(d, 0, 0), c) - dist(p + vec3(-d, 0, 0), c),
		dist(p + vec3(0, d, 0), c) - dist(p + vec3(0, -d, 0), c),
		dist(p + vec3(0, 0, d), c) - dist(p + vec3(0, 0, -d), c)
		));
}


struct ray 
{
	vec3 rayDir;
	vec3 position;
	vec3 normal;
	int steps;
	float t;
	vec3 color;
};

const int maxStep = 120;
ray trace(vec3 from, vec3 rayDir) 
{
	float t = 0.;
	vec3 color, p;
	int steps = 0;
	for(int i = 0; i < maxStep; i++) {
		p = from + t*rayDir;
		float d = dist(p, color);
		t += d;
		if(d < 0.001) {
			p -= 0.0001*rayDir;
			steps = i;
			break;
		}
	}
	return ray(rayDir, p, calcNormal(p), steps, t, color);
}

vec3 lightPos = vec3(3.0*cos(time/1.0), 2.0*cos(time/2.0), 3.5);
const float mix1 = 0.3;
const float mix2 = 0.15;
const float shininess = 12.0;
vec3 shade(vec3 position, vec3 rayDir, vec3 normal, int steps, vec3 color) 
{
	ray tr = trace(lightPos, normalize(position - lightPos));
	bool visible;
	if (distance(tr.position, position) < 0.1) 
		visible = true;
	else 
		visible = false;
	
	float diffuse = max(dot(normal, -tr.rayDir), 0.0);
	float specular = pow(max(dot(rayDir, reflect(normal, -tr.rayDir)), 0.0), shininess);
	vec3 directColor;
	if(visible) directColor = vec3(mix(diffuse, specular, mix1));

	if (steps > 0) 
		return vec3(mix(directColor * color, color, mix2));
	else
		return vec3(.1, .1, .4);
}

void main( void ) 
{
	vec2 uv = (2.0*gl_FragCoord.xy - resolution)/resolution.x;
	
	vec3 camPos = vec3(3.0*cos(time/2.0), -5.0*sin(time/2.0), 2.8);
	vec3 camFront = normalize(-camPos);
	vec3 camUp = vec3(0, 0, 1.0);
	vec3 camRight = cross(camFront, camUp);

	vec3 rayDir = normalize(uv.x*camRight + uv.y*camUp + camFront);
	ray tr = trace(camPos, rayDir);
	vec3 color = shade(tr.position, tr.rayDir, tr.normal, tr.steps, tr.color);
	
	gl_FragColor = vec4(color, 1.0);
}