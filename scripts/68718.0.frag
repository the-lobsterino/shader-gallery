#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 axel = vec2(1.0);
const float count = 100.0;
float brght = 0.01; //1.0/count;
float dist = 0.5;
float radius = 0.05;

float l = 1.;
float w = 1.;

void main( void ) {

	
	//axel += (mouse - axel) / 5.0;
	axel = mouse;
	
	vec3 Color = vec3(0.5, 0.3, 0.5);
	float col = -0.3;
	vec2 centr = 2.0 * (gl_FragCoord.xy * 2.0 - resolution) /
		min(resolution.x, resolution.y);
	
	for(float i = 0.0; i < count; i++)
	{
	  float si = sin(time + i * dist * axel.x ) * l;
	  float co = cos(time + i * dist * axel.y ) * w;
		
	  col += brght / abs(length(centr + vec2(si , co )) - radius);
	}

	
	gl_FragColor = vec4(vec3(Color * col), 1.0);
}