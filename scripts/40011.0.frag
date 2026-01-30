#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float shape(int n, vec2 pos)
{
	int N = n;
	
	float a = atan(pos.x, pos.y) + PI;
	float r = TWO_PI / float(N);
	
	float c = floor( 0.5 + a / r);
	
	float d = cos( c * r - a) * length(pos);
	return d;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution );
	pos.x *= resolution.x / resolution.y;
	
	pos = pos * 2.0 - 1.0;

	//vec2 center = uv - vec2(0.5);
	vec3 color = vec3(0.0);
	
	
	float d = shape(6, pos);
	
	color = vec3(1.0 - smoothstep(0.4, 0.41, d));

	gl_FragColor = vec4( color, 1.0 );

}