#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main()
{
	vec2 g = gl_FragCoord.xy / resolution.y * 10.;
	vec4 f = vec4(1);
    	
    	for(int x=-3;x<=3;x++)
	{
		for(int y=-3;y<=3;y++)
		{	vec2 p = vec2(x,y);
			vec2 a = sin( time * 1.5 + 9. * fract(sin((floor(g)+p)*mat2(2,5,5,2))));
			p += .5 + .5 * a - fract(g);
			f = min(f, length(p * cos(a.x*1.5)));
		}
	}
    
   	gl_FragColor = sqrt(vec4(10,5,2,1)*f) ;
	gl_FragColor.a = 1.;
}