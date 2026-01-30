#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define miter 200
#define citer 16

//hmn, this shouldnt require iterations

float lm(float a, float r)
{
	float m = r*a*(1.-a);
    return m;
}

void main()
{
	vec2 uv = gl_FragCoord.xy/resolution;
	float w = (uv.x)/resolution.x;
	uv 	*= vec2(4., 1.);
	uv 	+= vec2(0., 0.);

	float f = 1.;

	float cl = log(abs(cos((1.-mouse.y)*3.14)+2.))*float(citer);
	float ml = log(abs(cos((1.-mouse.x)*3.14)+2.))*float(miter);
	float la = f;
	
	for (int i=0; i<citer; ++i)
	{
		float a = float(i)/float(citer);
       		
		if(float(i) < cl)
		{
			for (int j=0; j<miter; ++j)
			{
				if(float(j) < ml)
				{
					
	            			a  = lm(a, uv.x);
					//a  = witch(a*8., .5);
				}
			}
		}
		
        	f = min(f, abs(uv.y-a));
    	}
    

	f = 1.-float(abs(f-w) > 4. * w);
	
    	gl_FragColor = vec4(f,f,f,1.);
}