#ifdef GL_ES
precision highp float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;

#define SCALE 64.
#define PI (4. * atan(1.))

vec4 koch_harmonic(in vec2 uv);
vec4 tree_harmonic(in vec2 uv);
vec2 format_to_screen( vec2 p );

void main(void) 
{
    vec2 uv = format_to_screen(gl_FragCoord.xy/resolution.xy);
    uv      *= SCALE;
    
    gl_FragColor = koch_harmonic(uv);
//    gl_FragColor = tree_harmonic(uv);
}

vec4 tree_harmonic(vec2 uv)
{
    vec4 v  = vec4(uv, -uv) * (.125 * mouse.y + .01);
    float x = mouse.x * 1.;
	float y = 1.68;

    vec4  r	= vec4(0.); 
    vec4  f = vec4(0.);
    
	for ( int i = 0; i < 1; i++ )
	{
	    v    = (v.wxyz) * x + f.yzwx;     
        
        f    = fract((v.yzwx-v.wxyz) * y + y);
        f    *= 1. - f;
		r    += f;
    }
    r /= 4.;
    r *= r;
	return r;
}

vec4 koch_harmonic(in vec2 uv)
{
    const int iterations    = 20;
    float total             = float(iterations);
	
    
    bool side_panel    = gl_FragCoord.x > resolution.x * .75;
    float step_slice   = floor(gl_FragCoord.y/resolution.y * total);
    uv.y               = side_panel ? .5 : uv.y;
    
    
    vec4 basis = vec4(uv, -uv);
    vec4 span = vec4(0.);
    float rotation     = mouse.x;
    
    
    vec4 harmonic      = vec4(0.);
    vec4 steps         = vec4(0.);
  
    
  	for ( int i = 0; i < iterations; i++ )
    {
        if( mouse.y * total > float(i))
        {
            
            basis       += basis.wxyz;
            basis       *= .5;
            basis       = basis.yzwx + span.wxyz;

            span        = fract(basis - basis.wxyz + rotation);
            span        *= 1. - span;

            harmonic    = span + harmonic * .5;
			            
            steps        = float(i) == step_slice ? harmonic : steps; 
	    }
        else
        {
            break;
        }
    }
    
    
    harmonic = side_panel ? steps : harmonic;
  	harmonic *= PI*.5;
    return harmonic;
}


vec2 format_to_screen( vec2 p )
{
    p       = p * 2. - 1.;
    p.x     *= resolution.x / resolution.y;
    return p;
}
