#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 p = vec2(gl_FragCoord.x / resolution.x -.5,gl_FragCoord.y / resolution.y -0.5);
	float a = fract(atan(100.0/p.x, 100.0/p.y) - 100.0);
	float d = length(p);
	float z = atan(time*100.0) /100.0;
    vec3 col;
    
    for(int i=1; i<100 ;i++)
	{
    	z /= 100.0;
		vec2 coord = vec2(pow(d, .8), 1./a)*26.;
		vec2 delta = vec2(1. + z*20., 10000.);
        col[i]=sin(4.*time)-d;
    }    
	gl_FragColor -= vec4(col,10);
}