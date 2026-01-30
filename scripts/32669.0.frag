#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray { vec3 o; vec3 d; };
struct Sphere { vec3 pos; float rad; };

float hash( float n ){
    return fract(sin(n)*758.5453);
}

float noise( in vec3 x ){
    vec3 p = floor(x);
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}

float fbm( vec3 p ){
    float f = 0.0;
    f += 0.50000*noise( p ); p = p*2.02;
    f -= 0.25000*noise( p ); p = p*2.03;
    f += 0.12500*noise( p ); p = p*2.01;
    f += 0.06250*noise( p ); p = p*4.04;
    f += 0.03500*noise( p ); p = p*4.01;
    f += 0.06250*noise( p ); p = p*4.04;
    return f/0.984375;
}

// for curious: it returns >= 0 it intersects and < 0 if no
float rsi2(in Ray ray, in Sphere sphere)
{
    vec3 oc = ray.o - sphere.pos;
    float b = 2.0 * dot(ray.d, oc);
    float c = dot(oc, oc) - sphere.rad*sphere.rad;
    float disc = b * b - 4.0 * c;
    if (disc < 0.0) return -1.0;
    float q = b < 0.0 ? ((-b - sqrt(disc))/2.0) : ((-b + sqrt(disc))/2.0);
    float t0 = q;
    float t1 = c / q;
    if (t0 > t1) {
        float temp = t0;
        t0 = t1;
        t1 = temp;
    }
    if (t1 < 0.0) return -1.0;
    if (t0 < 0.0) return t1;
    else return t0; 
}

float moon(vec3 origin, vec3 dir){
	Ray r = Ray(origin, dir);
	float m = 0.0;
	Sphere s = Sphere(vec3(0, 0, -2.0), 1.0);
	float hit = rsi2(r, s);
	if(hit < 0.0) return 0.0;
	vec3 hpos = r.o + r.d * hit;
	vec3 norm = normalize(hpos - s.pos);
	vec3 sun = vec3(sin(time), 0, cos(time));
	float diffuse = max(0.0, dot(sun, norm));
	float surfaceraw = fbm(hpos*1.9);
	float albedo = mix(0.7, 0.85, smoothstep(0.9, 0.2, surfaceraw));
	return albedo * diffuse;
}
void main( void ) {

	float ratio = resolution.x / resolution.y;	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	position.x *= ratio;
	
	vec3 color = vec3(moon(vec3(position.x, position.y, 2.0), vec3(0.0,0.0,-1.0)));

	gl_FragColor = vec4(pow(color, vec3(1.0/2.4)), 1.0 );

}