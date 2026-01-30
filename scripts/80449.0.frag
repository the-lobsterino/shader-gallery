// Rolf Fleckenstein

precision highp float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

#define FOG_STRENGTH 1.67

const float PI = 3.14159265;
const float angle = 90.0;
const float fov = angle * 0.5 * PI / 180.0;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

vec2 m =  mouse;



float sphereSize = 0.75 * (sin(7.)*0.5+0.5) + 0.25;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
	return mod(0.5*p, 6.0) - 3.0;
}

float distanceFunc(vec3 p){
	return length(trans(p)) - sphereSize;
}

vec3 getNormal(vec3 p){
	float d = 0.01;
	return normalize(vec3(
		distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
		distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
		distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
	));
}

void main(void){
	m *= rot(-time);
	vec3  cPos = vec3(21.*time+1.*sin(0.2432*time), 1.1*sin(0.45*time), 5.0);   // movement
	
	// fragment position
	vec2 p = 0.67*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
        p *= rot(-time/6.);
	// ray
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));	
	
	// marching loop
	float distance = 0.0;
	float rLen = 0.0;
	
	vec3  rPos = cPos;
	
	for(float i = 0.; i < 1. ; i+=1./256.){
		distance = distanceFunc(rPos);
		rLen += distance;
		rPos = cPos + ray * rLen;
	}
	// the fog
	float light = 1.00 + pow(rLen/100., FOG_STRENGTH);
	float fog   = 0.95 - pow(rLen/80., FOG_STRENGTH);
	float fog2  = 0.95 - pow(32./rLen, FOG_STRENGTH);
	vec3 c = vec3(0.0);
	// hitting
	
		vec3 normal = getNormal(rPos);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		c = vec3(-0.5*diff+(normal.xy*0.5+0.5),1.0);  // normal values for coloring
	        c += floor(10.*p.x - fract(dot(gl_FragCoord.xy, vec2(.5, 0.5))) * 10.0) * .05;  // dithering effect
         float tw = sin(time)*0.5+0.5;
	c += rLen/400.-1.8*tw*((c.x+c.y+c.z)/3.);
	
	gl_FragColor = vec4(c, (1.0 - fog - fog2)* light);
}