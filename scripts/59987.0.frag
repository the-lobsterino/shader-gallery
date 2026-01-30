#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 hsv(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}
vec2 cmul(vec2 a, vec2 b) {
    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cdiv(vec2 a, vec2 b) {
    return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / dot(b, b);
}

vec2 mobius(vec2 z, vec2 a, vec2 b, vec2 c, vec2 d) {
    return cdiv(cmul(a, z) + b, cmul(c, z) + d);
}


void main( void ) {
	float a = time*0.01;
	vec2 p = surfacePosition;
	float s = sin(a);
	float c = cos(a);
	p /= dot(p, p);
	p = p / 10.0;
	vec3 col = vec3(0);
	for (int i = 0; i < 250; i++) {
		if (dot(p, p) > 4.0) {
			col = vec3(0); 
			break;
		}
		p = cmul(p, p) + p;
		p = vec2(-s*p.y+c*p.x, s*p.x+c*p.y);
		col += hsv(time*0.1+dot(p,p)*4.0, 1.0, 0.015);
	}

	gl_FragColor = vec4( sin(col), 1.0 );

}