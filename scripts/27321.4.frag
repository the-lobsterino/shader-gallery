#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 5.0 - 1.0;
	float t = abs( sin(time*10.0) * (20.0 * sin(-time)) / (sin( uv.y + time + sin( uv.y * uv.x ) * uv.y ) * 100.0) );
	vec3 o = vec3( t * 0.05, t * 0.1, t * 0.7 );
	gl_FragColor = vec4(o, 6.0);
}