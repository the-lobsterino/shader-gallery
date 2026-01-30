#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) 
{
	vec2 p = surfacePosition * 2.0;
	
	int j = 0;
	vec2 z = p;
	//vec2 c = p;
	vec2 c = vec2(0.33, 0.4);
	
	for(int i = 0; i < 360; i++)
	{
		j++;
		if(length(z) > 2.0) break;
		z = vec2(z.x * z.x - (mouse.x*1.6+0.95)*z.y * z.y, 2.0 * z.x * z.y) + c - mouse.y*0.01;
	}
	gl_FragColor = vec4(vec3(4.8,1.6,1.2)*pow(vec3(float(j) / 360.0), vec3(1.-float(j)*.02, 1.-float(j)*.02, 1.-float(j)*.012)), 1.0);
}