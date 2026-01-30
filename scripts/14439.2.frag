#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	float t = atan(uv.y, uv.x);
	float r = length(uv);
	float c = sin(pow(sin(r * 3.141592 * 3.0), -2.0) + t * 6.0 - time);
	float k = c * log(r);

	gl_FragColor = vec4( k, k, k, 1.0 );

}