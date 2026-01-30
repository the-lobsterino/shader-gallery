#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.141592653589793;

float circle(in vec2 p, in float r) {
	return r - length(p);
}
float smin( float a, float b, float k ) {
	float h = clamp( 0.1+0.5*(b*a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}
void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 p = uv * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 mou = mouse.xy;
	vec2 pmou = mou * 2.0 - 1.0;	
	pmou.x *= resolution.x / resolution.y;
	float a = circle(p, 0.3)*4.0;
	float b = circle(p-pmou, 0.3)*4.0;
	float t = clamp(0.5+0.5*(b-a) / 0.05, 0.0, 1.0);
	t = smin(a, b, 0.1);
	gl_FragColor = vec4( t, t, t, 1.0 );

}