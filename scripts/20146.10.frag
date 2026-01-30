#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.141592653589793;

float sdCapsule( vec2 p, vec2 a, vec2 b, float r ) {
	vec2 pa = p - a, ba = b - a;
	float h = clamp( dot(pa, ba) / dot(ba , ba), 0.0, 1.0 );
    	return length( pa - ba * h ) - r;
}

float motor(float _min, float _max, float time) {
	float t = 0.5 + 0.5 * sin(time);
	return mix(_min, _max, t);
}
    
void rotate_from_origin(vec2 origin, out vec2 target, float r, float angle) {
	target.x = origin.x + r * cos(angle);
	target.y = origin.y + r * sin(angle);
}

vec2 preserve(vec2 p0, vec2 p1, float len) {
	vec2 v = p1 - p0;
	vec2 u = normalize(v);
	return p0 + len * u;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.y = 1.0 - p.y;
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float t = time * 2.0;
	float cx = 0.25;
	vec2 p0 = vec2(-cx, 0.0);
	vec2 p1 = vec2(-cx, -0.2);
	vec2 p2 = vec2(-cx, -0.4);
	vec2 p3 = vec2(-cx, 0.2);
	vec2 p4 = vec2(-cx, -0.4);
	
	vec2 p5 = vec2(cx, 0.0);
	vec2 p6 = vec2(cx, -0.2);
	vec2 p7 = vec2(cx, -0.4);
	vec2 p8 = vec2(cx, 0.2);
	vec2 p9 = vec2(cx, -0.4);
	
	vec2 p10 = vec2(0.0, 0.0);
	vec2 p11 = vec2(cx, -0.2);

	
	
		
	float angle0 = 0.0;
	float angle1 = 0.0;
	p0.y = motor(-0.05, 0.05, t * 4.0);
	angle0 = motor(pi * 0.15, pi * 0.65, t * 2.0 - pi * 0.5);
	angle1 = motor(pi * 0.15, pi * 0.65, t * 2.0 + pi * 0.5);
	rotate_from_origin(p0, p1, 0.2, angle0); 
	rotate_from_origin(p0, p3, 0.2, angle1); 
	angle0 += motor(0.0, pi * 0.5, t * 2.0 + pi);
	angle1 += motor(0.0, pi * 0.5, t * 2.0 + pi + pi);
	rotate_from_origin(p1, p2, 0.2, angle0);
	rotate_from_origin(p3, p4, 0.2, angle1);
	
	p5.y = motor(-0.05, 0.05, t * 4.0);
	angle0 = motor(pi * 0.15, pi * 0.65, t * 2.0 - pi * 0.5);
	angle1 = motor(pi * 0.15, pi * 0.65, t * 2.0 + pi * 0.5);
	rotate_from_origin(p5, p6, 0.2, angle0); 
	rotate_from_origin(p5, p8, 0.2, angle1); 
	angle0 += motor(0.0, pi * 0.5, t * 2.0 + pi);
	angle1 += motor(0.0, pi * 0.5, t * 2.0 + pi + pi);
	rotate_from_origin(p6, p7, 0.2, angle0);
	rotate_from_origin(p8, p9, 0.2, angle1);
	
	p10.y = motor(-0.02, 0.02, t * 4.0 - pi * 0.5);
	p11 = preserve(p5, p11, 0.25);
	
	float col = 0.0;
	float d = 0.0;
	float w = 0.05;
	d = sdCapsule(p, p0, p1, w);
	d = min(d, sdCapsule(p, p1, p2, w));
	d = min(d, sdCapsule(p, p0, p3, w));
	d = min(d, sdCapsule(p, p3, p4, w));
	
	d = min(d, sdCapsule(p, p5, p6, w));
	d = min(d, sdCapsule(p, p6, p7, w));
	d = min(d, sdCapsule(p, p5, p8, w));
	d = min(d, sdCapsule(p, p8, p9, w));
	
	d = min(d, sdCapsule(p, p0, p10, w));
	d = min(d, sdCapsule(p, p10, p5, w));
	d = min(d, sdCapsule(p, p5, p11, w));
	
	col = d;
	float c = sin(d * pi * 50.0);
	col = smoothstep(0.0, 0.01, d) * c;

	
	float rad = length(p);
	float r = col;
	float g = col * rad;
	float b = col * 0.25;

	gl_FragColor = vec4( vec3( r, g, b), 1.0 );
}