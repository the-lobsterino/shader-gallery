#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi = 3.141592;
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	//uv.x *= resolution.x / resolution.y;

	vec2 v = uv - vec2(0.5, 0.5);
	float t = atan(v.y, v.x) / pi;
	float d = distance(uv, vec2(0.5, 0.5));	
	//float c = (sin(d*pi*10.0 + time)*0.5+0.5) * (cos(d*pi*10.0-time)*0.5+0.5);
	float c = sin(d * pi * 1.0 + t * mod(time * 1.0, 100.0));
	//c = t;
	gl_FragColor = vec4( c, c, c, 1.0 );

}