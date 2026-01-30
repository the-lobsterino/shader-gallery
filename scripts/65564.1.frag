// 190620N)ecips GENESIS PROJECT: DIVINE FACTORY FINGERPRINT II

// By Saw-mon and Natalie

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
const float zoom = 10.0;
const int maxDepth = 20;
const int maxPower = 10;
uniform vec2 mouse;
uniform vec2 resolution;

#define AAstep(thre, val) smoothstep(-.7,.7,(val-thre)/min(.05,fwidth(val-thre)))

float cost(vec2 p) {
	return exp(-length(p) + cos(length(p)));
}

vec2 product(vec2 p, vec2 q) {
	return vec2(p.x * q.x - p.y * q.y, p.x * q.y + p.y * q.x);
}

vec2 conj(vec2 p) {
	return vec2(p.x, -p.y);
}

vec2 c_exp(vec2 p, int n) {
	vec2 c = vec2(1.);
	for(int i=0; i < maxPower; i++){
		if( i >= n ) break;
		c = product(c, p);
	}
	
	return c;
}

vec2 f(vec2 p, vec2 offset) {
	vec2 p2 = product(p,p);
	vec2 p3 = c_exp(p, 4);
	
	 return p3 - 0.5 * p2 + p * min(mouse.x, mouse.y) - 2. * offset + 1.;
}

vec3 depth(vec2 p, vec2 offset) {
	
	float depth = 1.;
	float c = cost(p * p);
	float c2 = 1.;
	for(int i=0; i < maxDepth; i++){
		float diff = length(p) - 2. * (1. + offset.y);
		if(diff > 0.) {
			break;
		}
		vec2 pp = f(p, offset);
		depth++;
		c += cost(p - pp);
		c2 *= length(p - pp);
		p = pp;
	}
	
	return vec3(p.x, c2, c);
}

vec4 render( vec2 uv, vec2 offset  ) {

	vec3 dd = depth(uv * 2., offset);
	float d = dd[2] / float(maxDepth);
	
	
	float r = exp( - d * d * d) ;
	float g = exp(-d * d);
	float b = exp(-d * d);
	
	g = g;
	b = (1. + b) /2.;

	return vec4(r, g, b, 1.0);

}


void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.y  - vec2(resolution.x/resolution.y/2., 0.5));
	
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	// gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	
	gl_FragColor += render(position, vec2(0.8 + 8.*sin(color + position.x+2.*time) / 16., 1. + 2.* cos(position.y+2.*time) / 16.));	
}