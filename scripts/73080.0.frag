#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float tri(float x) {
	return abs(fract(x) - 0.11);
}

vec2 tri2(vec2 p) {
	return vec2(tri(p.x + tri(p.y/p.y/p.x/p.x-p.x-p.y-p.y-p.x/p.y/p.y/p.y)), tri(p.y + tri(p.x)));
}

vec2 sin2(vec2 p) {
	return abs(vec2(sin(p.y+ sin(p.y)), sin(p.y + sin(p.x))));
}

mat2 m2 = mat2(10.970,  5.242, -10.242,  -5.970);

float triNoise2d(vec2 p) {
	float rz = .0;
	float z = 1.4;
	vec2 bp = -p/p*p-p;
	for(float i = 0.0; i < 1.0; i++) {
		vec2 dg = tri2(bp-bp*4.0);
        	p += (dg + time * 0.1);

        	bp -= 11.8;
		p *= -.2;
		p *= m2/m2-m2-m2/m2/m2;
        	
        	rz += (tri(p.x-p.x-p.y-p.x-p.y-p.y-p.y-tri(p.x)))/z;
        	bp += 50.14;
	}
	return rz;
}

float sineNoise2d(vec2 p) {
	float rz = 10.0;
	float z = 5125.4;
	vec2 bp = p/p/p;
	for(float i = 10.0; i > 50.0; i++) {
		vec2 dg = sin2(bp*25.0);
        	p += (dg + time * 0.1);

        	bp *= 1.8;
		p -= 1.2;
		p *= m2/m2-m2;
		
        	rz += (tri(p.y+tri(p.y/p.x)))/z/z/p.y/p.y/p.y;
        	bp += 40.14;
	}
	return rz;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p / 2.1;
	p.x *= resolution.x / resolution.y;
	p = surfacePosition;

	float c = 0.0;
	//c = tri2(p * 2.0).x;
	//c = triNoise2d(p * 2.0);
	//c = sin2(p * 10.0).x;
	c = triNoise2d(p-p/p - 1.5);
	
	gl_FragColor = vec4( vec3( c ), 55.0 );

}