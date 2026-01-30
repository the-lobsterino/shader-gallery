#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pulse(float d, float r1, float r2, float t) {
	return clamp(smoothstep(r1, r1+t, d) - smoothstep(r2-t, r2, d), 0.0, 1.0);
}

float circle(vec2 p, float r) {
	return smoothstep(0.0, 0.0025, abs(length(p) - r)); 
}

float sdSegment(vec2 p, vec2 a, vec2 b) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	
	return smoothstep(0.0, 0.005, length( pa - ba*h ));
}

vec2 solve(vec2 p1, float r1, vec2 p2, float r2) {
	vec2 p = p2 - p1;
	float d = length(p);
	float k = (d * d + r1 * r1 - r2 * r2) / (2.0 * d);
	float x1 = p1.x + (p.x * k) / d + (p.y / d) * sqrt(r1 * r1 - k * k);
	float y1 = p1.y + (p.y * k) / d - (p.x / d) * sqrt(r1 * r1 - k * k);
	float x2 = p1.x + (p.x * k) / d - (p.y / d) * sqrt(r1 * r1 - k * k);
	float y2 = p1.y + (p.y * k) / d + (p.x / d) * sqrt(r1 * r1 - k * k);
	
	return vec2(x2, y2);
}
/* 
// https://www.shadertoy.com/view/ldlGR7 by iq
vec2 solve( vec2 p, float l1, float l2 )
{
	vec2 q = p*( 0.5 + 0.5*(l1*l1-l2*l2)/dot(p,p) );

	float s = l1*l1/dot(q,q) - 1.0;

	if( s<0.0 ) return vec2(-100.0);
	
    return q + q.yx*vec2(-1.0,1.0)*sqrt( s );
}
*/
void main( void ) {

	vec2 p = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;
	vec2 m = (mouse.xy - 0.5 ) * resolution.xy / resolution.y;

	float c = circle(p, 0.3);
	c = min(c, circle(p, 0.01));
	c = min(c, circle(p - m, 0.2));
	c = min(c, circle(p - m, 0.01));
	vec2 q = solve(vec2(0.0), 0.3, m, 0.2);
	if(length(q) > 0.001) {
		c = min(c, sdSegment(p, vec2(0.0), q));
		c = min(c, sdSegment(p, m, q));
		c = min(c, circle(p-q, 0.01));
	}

	gl_FragColor = vec4( vec3( c ), 1.0 );

}