#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// cubic Hermite spline
// http://paulbourke.net/miscellaneous/interpolation/

const float tension = 0.0;
const float bias = 0.0;
const float lineWeight = 0.004;

float HermiteInterpolate( float y0, float y1, float y2, float y3, float mu )
{
	float m0, m1, mu2, mu3;
	float a0, a1, a2, a3;

	mu2 = mu * mu;
	mu3 = mu2 * mu;

	m0  = (y1 - y0) * (1.0 + bias) * (1.0 - tension) / 2.0;
	m0 += (y2 - y1) * (1.0 - bias) * (1.0 - tension) / 2.0;
	m1  = (y2 - y1) * (1.0 + bias) * (1.0 - tension) / 2.0;
	m1 += (y3 - y2) * (1.0 - bias) * (1.0 - tension) / 2.0;
	a0 = 2.0 * mu3 - 3.0 * mu2 + 1.0;
	a1 = mu3 - 2.0 * mu2 + mu;
	a2 = mu3 - mu2;
	a3 = -2.0 * mu3 + 3.0 * mu2;

	return(a0 * y1 + a1 * m0 + a2 * m1 + a3 * y2);
}

void main( void ) {
	vec2 p0 = vec2( -1.0/3.0, 0.1 );
	vec2 p1 = vec2( 0.0, 0.9 );
	vec2 p2 = vec2( 1.0/3.0, 0.1 );
	vec2 p3 = vec2( 2.0/3.0, 0.5 );
	vec2 p4 = vec2( 1.0, 0.2 );
	vec2 p5 = vec2( 4.0/3.0, 0.5 );
	p0 += vec2(sin(time));
	p1 += vec2(cos(time));
	p4 += vec2(sin(time + 13.));
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	float y;
	if ( pos.x < p2.x )
		y = HermiteInterpolate( p0.y, p1.y, p2.y, p3.y, pos.x * 3.0 );
	else if ( pos.x < p3.x )
		y = HermiteInterpolate( p1.y, p2.y, p3.y, p4.y, (pos.x - p2.x) * 3.0 );
	else
		y = HermiteInterpolate( p2.y, p3.y, p4.y, p5.y, (pos.x - p3.x) * 3.0 );
	
	gl_FragColor = vec4( 0.0 );
	if ( y < pos.y + lineWeight && y > pos.y - lineWeight )
		gl_FragColor = vec4( 1.0 );
}