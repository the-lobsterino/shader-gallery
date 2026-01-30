//from shadertoy ./. gigatron 
#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//#define M_PI 3.1415926535897932384626433832795
vec2 center = vec2 (resolution.x/2.0,resolution.y/1.8)  ;
void main()
{
	float size = 10.0;
	
	
	 
	
	 	vec3 color = vec3(0.03,0.,0.);
	
		
		
		 
		float t =sin(time)*18.0;	
		
		color = vec3(1.0 - distance(gl_FragCoord.xy, center) / (0.5 * size),4.*mouse.x,2.*mouse.y);
		color = color * t / (abs(gl_FragCoord.y - center.y)) * t / (abs(gl_FragCoord.x - center.x));
		 
		 
	
	
	gl_FragColor = vec4(vec3(color),1.0);
}

