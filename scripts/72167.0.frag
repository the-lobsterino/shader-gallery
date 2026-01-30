#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool b = false;


vec3 barycentric(vec2 uv)
{	
//	uv.y		/= sqrt(3.);
	uv.y		/= 1.73205080757;
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
//	uvw		*= cos(pi/6.);
	uvw		*= .86602540358;
	return uvw;
}


vec4 harmonic(in vec2 uv)
{
    vec4 f, r, s;

    vec3 b = barycentric(uv);
    f = vec4(b.x, b.y, b.z, b.x);
 
    r = s;
    //float m = mouse.y * 3.14;
    float m = 9.;
    float a = 1.;
    const int it = 32;
    for ( int i = 0; i < it; i++ )
    {
        f = (f.wxyz + f) * .5 + s;
        
        f.xzw = f.zwz;
        
        s = fract(sin(m) + cos(m) * (f-f.wxyz));
        s = s * s;
        s = s * (1. - s);
        
        r += s * a; 
        
        a *= 2.;
        
	}
    
    return r/a*16.;
}


//#extension GL_OES_standard_derivatives : enable
//dFdx(c), dFdy(c)


void main(void) 
{
    	vec2 fc 		= gl_FragCoord.xy;
	fc 			-= resolution*.5;

	fc 			*= length(gl_FragCoord.xy - mouse * resolution) < 128. ? .1 : cos(time*.1)*.005+mouse.x*.5-.25;
    	vec4  r			= vec4(0., 0., 0., 0.);
	
	for(float i = 0.; i < 4.; i+= 1.)
	{		
		
		r 		= abs(r-harmonic(time + fc / pow(2., i + r.w)));			
	}
	
    	gl_FragColor.xyz	= abs(cross(r.xyz,.5-r.yxz/r.www));
    	gl_FragColor.w		= 1.;
}
