// 180620N

// By Saw-mon and Natalie

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
const float zoom = 10.0;
const int maxDepth = 100;
uniform vec2 mouse;
uniform vec2 resolution;

#define AAstep(thre, val) smoothstep(-.7,.7,(val-thre)/min(.05,fwidth(val-thre)))

float cost(vec2 p) {
	return exp(-length(p) + cos(length(p)));
}

vec2 f(vec2 p) {
	 return vec2(p.x * p.x - p.y * p.y, 2. * p.x * p.y) - 2. * mouse + 1.;
}

vec3 depth(vec2 p) {
	
	float depth = 1.;
	float c = cost(p * p);
	float c2 = 1.;
	for(int i=0; i < maxDepth; i++){
		float diff = length(p) - 2. * (1. + mouse.y);
		if(diff > 0.) {
			break;
		}
		vec2 pp = f(p);
		depth++;
		c += cost(p - pp);
		c2 *= length(p - pp);
		p = pp;
	}
	
	return vec3(p.x, c2, c);
}




float render2( void ) {

	vec2 position = (gl_FragCoord.xy) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	vec2 p = position * 2.0 - 1.0;
	p *= 3.;
	float k = 0.0;
	
	for (int i =0; i < 64; i++) {
		
		p = vec2((p.y * p.y - p.x * p.x) * 0.5, (p.y * p.x)) - mouse;
		k += 0.06;
		if (dot(p, p) > 10.0) {
			break;
		}

	}

	return k; // gl_FragColor = vec4(k, 0.0, 0.0, 1.0 );
}

	
	
void main( void ) {

	
	
	vec2 uv = ( gl_FragCoord.xy / resolution.y  - vec2(resolution.x/resolution.y/2., 0.5));
	vec3 dd = depth(uv * 5. * mouse.x);
	float d = dd[2] / float(maxDepth);
	
	float f = render2();
	
	float r = exp( - d * d * d)  + f;
	float g = exp(-d * d) + f;
	float b = exp(-d * d) + f;
	
	g = g;
	b = (1. + b) /2.;

	gl_FragColor = vec4(r, g, b, 1.0);

}