#ifdef GL_ES
precision highp float;
#endif

//spectrums

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define trees
#define dragons
		
#define iter 32
#define pi (4.*atan(1.))

void main(void) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	float scale  	= 1.;
	
	#ifdef dragons
	scale = 32.;
	#endif 
	
	#ifdef trees
	scale = .6;
	#endif
	
	uv 		= uv * scale - .5 * scale;
	uv.x    	*= resolution.x/resolution.y;
	
	vec4 a 		= vec4(uv, -uv);	
	    
	float m 	= (mouse.x-.5)*pi;

	const float t	= float(iter);
	
	bool debug 	= gl_FragCoord.x > resolution.x * .75;
	vec4 db 	= vec4(0.);
	float p 	= floor(gl_FragCoord.y/resolution.y*t);;
	uv.y 		= debug ? 1. : uv.y;
	a 		= gl_FragCoord.x > resolution.x * .875 ? vec4(uv, -uv) : a;
	
	
	vec4 b = vec4(0.);
	
	vec4 r	= vec4(0.); 
	for ( int i = 0; i < 64; i++ )
	{
		if(mouse.y*t>float(i))
		{
			#ifdef trees
			float x = .313131 * m - .1;
			float y = 1.69;			
		        a = (a.wxyz) * x + b.yzwx;     
		        b = fract((a.yzwx-a.wxyz) * y + y);
		        b *= (1. - b);
			r += a+a/b;
			#endif
			
			#ifdef dragons
			a = (a.wxyz+a).yzwx * .5 + b.wxyz;   
		        b = fract((a-a.wxyz) * m + m);
			b *= 1. - b;
			r += a;
			#endif
			
			
			db = debug ? (float(i) == p ? normalize(b) : db) : db + b;
		}
	}
    
	r = normalize(r-(mouse.y*t));
	r *= r;
	r = debug ? db : r;
	gl_FragColor = r;
}//sphinx
