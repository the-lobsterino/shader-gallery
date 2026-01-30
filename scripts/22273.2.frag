#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

struct sphere {
	vec3 pos;
	float rad;
};

float intersectsphere(vec3 spos, float srad, vec3 o, vec3 d) {
    float b = dot(d, o - spos);
    float c = pow(length(o - spos),2.0) - srad*srad;
    float d1 = b * b - c;

    if (d1 < 0.0) {
        return -1.0;
    }
    return -b - sqrt(d1);
}

vec3 spherenormal(vec3 spos, vec3 pos)
{
	return normalize(pos - spos);		
}

vec4 normalmap(vec3 n)
{
	return vec4((n.x+1.0)/2.0,(n.y+1.0)/2.0,(n.z+1.0)/2.0,1);
}

vec4 shade(vec3 ldir, vec3 normal, float ambient)
{
	float NdotL = dot(ldir, normal);
	NdotL = clamp(NdotL, 0.0, 1.0);
	float l = clamp(NdotL + ambient, 0.0, 1.0);
	return vec4(l, l, l, 1);
}

void main( void ) {
	sphere objects[10];
	for(int i=0;i<10;i++){
		float x = float(i)/5.0;
		sphere s; s.pos = vec3(x,0,-2); s.rad = x * 0.05;
		objects[i] = s;
	}
	
	
	vec2 pos = surfacePosition;
	
	vec4 c = vec4(0,0,0,1);
	
	vec3 orig = vec3(1.0 + pos.x + sin(time)/2.0, pos.y, 0);
	vec3 dir = vec3(0,0,-1);
	
	for(int i=0;i<10;i++){
		float z = intersectsphere(objects[i].pos, objects[i].rad, orig, dir);
		if(z>0.0){
			vec3 normal = spherenormal(objects[i].pos, orig + dir * z);
			c = shade(normalize(vec3(1,1,1)), normal, 0.1);
		}
	}

	gl_FragColor = c;
}