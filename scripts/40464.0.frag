#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// based on is shader : https://www.shadertoy.com/view/MltXz2

// z * z
vec2 zmul(vec2 a, vec2 b)
{
	//return vec2(a.x*b.x-a.y*b.y, a.x*b.y+b.x*a.y);
    return mat2(a,-a.y,a.x)*b;
}

// 1 / z
vec2 zinv(vec2 a)
{
	return vec2(a.x, -a.y) / dot(a,a);
}

const float AA = 2.;
    
void main()
{
    gl_FragColor = vec4(0);
    
	vec2 g = gl_FragCoord.xy;
	vec2 si = resolution.xy;
    
    
    for( float m=0.; m<AA; m++ )
    for( float n=0.; n<AA; n++ )
    {
        vec2 offset = vec2(m,n) / AA - 0.5;
        vec2 uv = ((g+offset)*2.-si)/min(si.x,si.y) * 2.;
        vec2 z = uv, zo = z;
        vec2 c = vec2(0.66,1.23);
        float it = 0.;
        for (int i=0;i<100;i++)
        {
			zo = z;
            z = zinv(zmul(z, z) + c);
			if( ((dot(z,z)))>8. ) break;
            it++;
        }

		float sit = it/pow((log(length(zo-z))),1.);
		gl_FragColor += 0.5 + 0.5*sin( 3.0 + sit*0.2 + vec4(1,0,1,1));
      
    }
    
    gl_FragColor /= AA * AA;
}