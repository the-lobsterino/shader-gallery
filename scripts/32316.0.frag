#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec3 d = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));
	vec3 p, f, o, y, g = d; 
	y = vec3(0.2, 1.0, 0.0);
 	o.y = 1.2; o.x = 10.1; o.z = 14.;

	for( float i=.0; i<16.; i+=.05 ) 
	{
		o += d * i * .05;
        	f = fract( o ); 
		p = floor( o ) * .2;
        	if( cos(p.x) + sin(p.z) > ++p.y ) 
		{
	    		g = (f.y > 0.8 ? y : f.x * y.yxz);
            		break;
        	}
	}
	gl_FragColor.xyz = g;
}
