#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 axel = vec2(1.0);
const float count = 100.0;
float brght = 0.2; //1.0/count;
float dist = 5.0;
float radius = 0.05;

float l = 1.;
float w = 1.;


float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {
 
	
	vec3 Color = vec3(0.99, 0.99, 0.5);
	float col = -0.3;
	vec2 centr =  (gl_FragCoord.xy * 2.0 - resolution) /
		min(resolution.x, resolution.y);
	
	 axel = vec2(rand(centr))+0.5*sin(time*0.003)+mouse*0.1;
	
	
	 
	  float si = sin(time   * dist * axel.x ) * l;
	  float co = cos(time   * dist * axel.y ) * w;
		
	  col += brght / abs(length(centr + vec2(si , co )) - radius);
	 

	
	gl_FragColor = vec4(vec3(Color * col), 1.0);
}