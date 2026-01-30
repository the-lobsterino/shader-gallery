#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = vec2(gl_FragCoord.xy/resolution.xy) - vec2(0.5, 0);
	pos.x *= pos.y;
	float color = 0.0;
	for (float i = 0.0; i < 1.0; i++)
	{
		pos.x *= 1.05;
		pos.y *= 1.01;
		color += abs(floor(mod(pos.x*15.0 + time*0.05, 1.0) + 0.5) - floor(mod(pos.y*4.0 + time*0.1, 1.0) + 0.5)) * 0.125;
	}
	gl_FragColor = vec4(vec3(sin(color), sin(color*8.0)*0.1, atan(color*8.0)), 1.0 );

}