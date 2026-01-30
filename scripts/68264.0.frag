/*
 * Original shader from: https://www.shadertoy.com/view/wstyWl
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// simple nebula rendered using some volumetric noise and a hacky voronoi starfield - Del 06/10/2020
// this shader is purely used for baking a procedural cubemap texture, please ignore the hackery & lack of speed - a realtime version would require some baked noise textures.
// WaveletNoise by BigWigs, Voronoi by IQ.

vec3 erot(vec3 p, vec3 ax, float ro)
{
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float WaveletNoise(vec3 p, float z, float k) {
    // https://www.shadertoy.com/view/wsBfzK
    float d=0.,s=1.,m=0., a;
    for(float i=0.; i<3.; i++) {
        vec3 q = p*s, g=fract(floor(q)*vec3(123.34,233.53,314.15));
    	g += dot(g, g+23.234);
		a = fract(g.x*g.y)*1e3 +z*(mod(g.x+g.y, 2.)-1.); // add vorticity
        q = (fract(q)-.5);
        q = erot(q, normalize(tan(g+.1)), a);
        d += sin(q.x*10.+z)*smoothstep(.25, .0, dot(q,q))/s;
        p = erot(p,normalize(vec3(-1,1,0)),atan(sqrt(2.)))+i; //rotate along the magic angle
        m += 1./s;
        s *= k; 
    }
    return d/m;
}

vec3 hash( vec3 x )
{
	x = vec3( dot(x,vec3(127.1,311.7, 74.7)),
			  dot(x,vec3(269.5,183.3,246.1)),
			  dot(x,vec3(113.5,271.9,124.6)));
	return fract(sin(x)*43758.5453123);
}

// returns closest, second closest, and cell id
vec3 voronoi( in vec3 x )
{
    vec3 p = floor( x );
    vec3 f = fract( x );

	float id = 0.0;
    vec2 res = vec2( 100.0 );
    for( int k=-1; k<=1; k++ )
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec3 b = vec3( float(i), float(j), float(k) );
        vec3 r = vec3( b ) - f + hash( p + b );
        float d = dot( r, r );

        if( d < res.x )
        {
			id = dot( p+b, vec3(1.0,57.0,113.0 ) );
            res = vec2( d, res.x );			
        }
        else if( d < res.y )
        {
            res.y = d;
        }
    }

    return vec3( sqrt( res ), abs(id) );
}

// starfield hack :)
float stars(vec3 pp1)
{
    float f;
    vec3 vv = voronoi(pp1);
    f = vv.x;
    float size = abs(sin((vv.z*32.3215))*9.0);
    f = 1.0-(f*(19.0+size));
  	float twink = 0.5+sin(f+iTime*1.3+vv.z)*0.5;
    f = clamp(f+(twink*0.2),0.0,1.0);
   	return f;
}

#define brightness -7.
#define saturation 0.95

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv=fragCoord.xy/iResolution.xy-.5;
	uv.y*=iResolution.y/iResolution.x;
	vec3 dir=vec3(uv*0.8,1.);
	float time=iTime*0.04;

	//rotation
    vec2  mm = iMouse.xy/iResolution.xy;
	float a1=0.5+(mm.x*0.5);
	float a2=0.8+(mm.y*0.8);
    
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from=vec3(1.,.5,.75);
	from+=vec3(time*1.8,time,-5.);
	from.xz*=rot1;
	from.xy*=rot2;
	
	// volumetric
	float s=0.1;
    float fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<25; r++)
    {
		vec3 p=from+s*dir*.5;
		vec3 p2 = p*2.9;
		float a = WaveletNoise(p2, 0.0, 1.9)*2.0 - 1.0;
		a *= a * a;
		v += vec3(s, s*s, s*s*s*s)* a * brightness * fade;
		fade *= 0.905;
		s += 0.032*1.55;
	}

    // Star hack
    float f = 1.0;
    vec3 pp1=from+dir*1.1;
	f = stars(pp1*20.0);
    pp1=from+dir*1.35;
	f = max(f,stars(pp1*20.0));
    pp1=from+dir*1.7;
	f = max(f,stars(pp1*20.0));
    
	v=mix(vec3(length(v)),v,saturation);
    v = clamp(v.gbr*0.01,vec3(0.0),vec3(1.0));
    v+=v*f;	// dirty starblend
	fragColor = vec4(v,1.);	
	
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}