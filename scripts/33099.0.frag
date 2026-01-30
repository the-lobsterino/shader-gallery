#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec4 colormap(float x, float k)
{
	x=smoothstep(0.0,1.0,x);
	return vec4(k*x,k*x*x,cos(k+x),1.0);
}



void main( void ) {

	vec2 p = gl_FragCoord.xy -resolution.xy /2.0;

	p*=.072;
	
	
	
	
        vec4 color = vec4(0.0,0.0,0.0,1.0);
        for(float i = 0.0; i < 205.0; i++)
	{
             color += colormap(0.021*sqrt(i) / length(vec2(p.x + .5*i* sin(time+i), p.y +1.5*cos(time)* sin(time *i))),  i*sin(i)*cos(i));
        }

	    
	gl_FragColor = color;

}