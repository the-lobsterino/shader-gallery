#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	float x = abs(gl_FragCoord.x / resolution.x * 2.0 - 1.0 + cos(time * 2.0) * 0.5);
	float z = abs(gl_FragCoord.y / resolution.y * 2.0 - 1.0 + sin(time * 2.0) * 0.5);
	x = abs(gl_FragCoord.x / resolution.x * 2.0 - 1.0);
	z += abs(gl_FragCoord.y / resolution.y * 2.0 - 1.0);
	
	//gl_FragColor = vec4(mod(x, z * 0.25), 0.0, 0.0, 1.0);
	//float neon = x / z * 0.1;
	
	gl_FragColor = vec4(1,1,0	, 1.0);
	//gl_FragColor = vec4(z);

}