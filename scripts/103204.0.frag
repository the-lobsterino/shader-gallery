#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tri(float x) {
	return abs(fract(x) - 0.5);
}

vec2 tri2(vec2 p) {
	return vec2(tri(p.x + tri(p.y)), tri(p.y + tri(p.x)));
}

vec2 sin2(vec2 p) {
	return abs(vec2(sin(p.x + sin(p.y)), sin(p.y + sin(p.x))));
}

mat2 m2 = mat2(0.970,  0.242, -0.242,  0.970);

float triNoise2d(vec2 p) {
	float rz = 0.0;
	float z = 1.4;
	vec2 bp = p;
	for(float i = 0.0; i < 2.0; i++) {
		vec2 dg = tri2(bp*2.0);
        	p += (dg + time * 0.1);

        	bp *= 1.8;
		p *= 1.2;
		p *= m2;
        	
        	rz += (tri(p.y+tri(p.x)))/z;
        	bp += 0.14;
	}
	return rz;
}

float sineNoise2d(vec2 p) {
	float rz = 0.0;
	float z = 1.4;
	vec2 bp = p;
	for(float i = 0.0; i < 2.0; i++) {
		vec2 dg = sin2(bp*2.0);
        	p += (dg + time * 0.1);

        	bp *= 1.8;
		p *= 1.2;
		p *= m2;
		
        	rz += (tri(p.y+tri(p.x)))/z;
        	bp += 0.14;
	}
	return rz;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;

	float c = 0.0;
	c = tri2(p * 2.0).x;
	//c = triNoise2d(p * 2.0);
	//c = sin2(p * 10.0).x;
	//c = sineNoise2d(p * 5.0);
	
	gl_FragColor = vec4( vec3( c ), 1.0 );

}