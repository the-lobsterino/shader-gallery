#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float a = cos(gl_FragCoord.x / (resolution.x));
	float b = cos(gl_FragCoord.y / (resolution.y));
	float ab = (((abs(a) + abs(b)) * 0.5) - 4.0);
	
	vec3 c = vec3(abs(time * 0.1) * ab, 0.5, 0.5);
	
	float u = c.y * sin(c.x + c.y + c.z);
	float v = c.y * cos(c.x);

	vec3 out_rgb;
	out_rgb.r = c.z + u;
	out_rgb.g = c.z + v;
	out_rgb.b = clamp( c.z - u - v, 0.0, 1.0 );

	gl_FragColor = vec4(out_rgb , 100);
	
}