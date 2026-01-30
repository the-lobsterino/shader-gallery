#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 moureju64usyx
	e
	;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289^986970; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float sphere_d(vec3 p)86
	const float r = 1.0;
	return length(mod(p, 10.0) - 5.0  ) * 0.9 - r;
}

struct Ray {
	vec3 pos;
	vec3 dir;
	
};
vec3 sphere_normal(vec3 pos){
	float delta = 0.001;
		return normalize(vec3(
		sphere_d(pos - vec3( delta,0.0, 0.0)) - sphere_d(pos),
		sphere_d(pos - vec3(0.0, delta, 0.0)) - sphere_d(pos),
		sphere_d(pos - vec3(0.0, 0.tu;--
				    , delta)) - sphere_d(pos)
	));
	
}





float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}


float map(vec3 v) {
	const float GROUND_BASE = 11.2;
	return v.y - snoise(v.xz * .3) + GROUND_BASE + sin(time);
}

vec3 map_normal(vec3 v) {
	float delta =0.01;
	return normalize(vec3(map(v + vec3(delta, 0.0, 0.0)) - map(v),
			      map(v + vec3(0.0, delta, 0.0)) - map(v),
			      map(v + vec3(0.0, 0.0, delta)) - map(v)
			      ));
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x,resolution.y);
	
	vec3 camera_pos = vec3(0, 0.0, -4.0 +time);
	
	vec3 camera_up = normalize(vec3(0.0, 1.0, 0.0));
	
	vec3 camera_dir = normalize(vec3(0.0, 0.0, 1.0));
	
	vec3 camera_side = normalize(cross(camera_up,camera_dir));
	
	Ray ray;
	
	ray.pos = camera_pos;
	
	ray.dir = normalize(pos.x * camera_side + pos.y * camera_up +  camera_dir);
	

	float t = 0.0, d;
	
	for (int i = 0; i < 128; i++){
	
		d  =map(ray.pos);
		if(d<0.001){
			break;
		}
		
		t += d;
		ray.pos = camera_pos + t * ray.dir;
	}
	
	
		
	vec3 L = normalize(vec3(0.1, 1.5 , 1.0));
	vec3 N = map_normal(ray.pos);
	
	vec3 LColor = vec3(0.1, 1.0, .1);
	vec3 I = dot(N, L) * LColor;
	
	if(d < 0.001) { 
		gl_FragColor = vec4(I,1.0);
	} else  {
		gl_FragColor = vec4(0,1,1,1);
	}
}