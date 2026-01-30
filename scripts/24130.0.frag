// PHO State

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) 
{

		
	float x = (gl_FragCoord.x-resolution.x/2.0)/127.0;
        float y = (gl_FragCoord.y-resolution.y/2.0)/127.0;
        
	
	float t = sin(time * 2.0);
	
        float a = ((y+0.008)*y)/2.0 + ((x+0.008)*x)/2.0;
	
	float r = a+t ;
	float g = a;
	float b = a;
	
	vec3 c = vec3(r, g, b);
	
	
	
	gl_FragColor = vec4( c, 0.0 );
	

	
	
}