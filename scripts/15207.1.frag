//MG - raymarching
//distance function(s) provided by
//http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MIN	0.0
#define MAX	20.0
#define DELTA	0.001
#define ITER	100

float sphere(vec3 p, float r) {
	p = mod(p,2.0)-0.5*2.0;
	return length(p)-r;
}

float sdBox( vec3 p, vec3 b )
{
	float modnum = cos(time/20.0) * 1.2 + 4.0;
	p = mod(p,modnum)-0.5*modnum;
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) +	length(max(d,0.0));
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

float castRay(vec3 o,vec3 d) {
	float delta = MAX;
	float t = MIN;
	for (int i = 0;i <= ITER;i += 1) {
		vec3 p = o+d*t;
		delta = sdBox(p,vec3(0.5,0.5,0.5));

		t += delta;
		if (t > MAX) {return MAX;}
		if (delta-DELTA <= 0.0) {return t;}
	}
	return MAX;
}

void main() {
	vec2 p=(gl_FragCoord.xy/resolution.y)*1.0;
	p.x-=resolution.x/resolution.y*0.5;p.y-=0.5;
	vec3 o = vec3(time,0.0,time);
	vec3 d = normalize(vec3(p.x,p.y,1.0));
	
	mat4 rotZ = rotationMatrix(vec3(0.0, 0.0, 1.0), sin(time));
	
	vec4 d2 = rotZ * vec4(d, 1.0);
	
	float t = castRay(o,d2.xyz);
	vec3 rp = o+d*t;
	
	if (t < MAX) {
		t = 1.0-t/MAX;
		gl_FragColor = vec4(t,t,t,1.0);
	}
	else {
		gl_FragColor = vec4(0.0,0.1,0.0,1.0);
	}
}