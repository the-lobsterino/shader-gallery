#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// ------------------------------------------------------------

vec3 xy2rgb3( in vec2 pos ) {
    vec2 modpos = fract( pos *= 8. );
    return vec3( dot( pos -= modpos, vec2( 1./64., 1./8. )), modpos );
}

vec2 rgb3toxy2( in vec3 rgb ) {
    rgb *= vec3( 8.0, 0.125, 0.125);
    float f8 = fract( rgb.r );
    return rgb.yz + vec2( (rgb.r - f8) * 0.125, f8 );
}

vec3 bpt_xy2rgb3dot( vec2 pos, float v ) {
   vec2 modpos = fract( pos /= v );
   return vec3( dot( pos -= modpos, vec2( v*v, v )), modpos );
}

vec2 bpt_rgb3toxy2dot(vec3 rgb, float v)
{
	rgb *= vec3(1.0 / (v*v), v, v);
	float f8 = fract(rgb.r);
	return rgb.yz + vec2((rgb.r - f8) * v, f8);
}

// ------------------------------------------------------------

float Lattice( vec2 uv0, float n, float roundness )
{
    vec2 uv = (uv0 * n);
    vec2 k = fract(uv) - 0.5;
    return fract(roundness*2.0 - roundness * dot( k, k ));
}

float DiscoBall( vec2 uv0, float n, float roundness )
{
    vec2 uv = (uv0 * n);
    vec2 k = fract(uv) - 0.5;
    return 1.0 - roundness * dot( k, k );
}

vec2 Lissajous(float A, float B, float t, float w, float o)
{
       return vec2( A * sin( w * t + o ), B * sin(t) );
}

// ------------------------------------------------------------

vec3 LatticeTest02()
{
    float t = time;
    vec2 fuv = surfacePosition;
    vec2 uv = fract(fuv) - 0.5;
    float l = Lattice(uv,t,2.0);
    float dp = l * (1.-l);
    return vec3( Lattice( uv, 8.0, 32.0/(4.0+dp) ) );
}

// ------------------------------------------------------------

vec3 pseudospherelattice()
{
    float t = time;
	
    vec2 fuv = surfacePosition;
	
    vec2 uv = fract(fuv) - 0.5;
	
    float fr = 0.25;
	
    float d = max(fr - dot(uv,uv), 0.);

    vec2 cs = vec2(1.0,0.0);
		    
    if ( 0.01 > d ) {
	    
	    for ( float s = 13.0; s > 0.0; --s ) {
		    
		if ( 0.01 > d ) {
		
		    uv = (fract(uv*4.+cs)-0.5);
			
		    d = max(fr - dot(uv,uv), 0.0) * (1.-fr); // d = pow( max(0.25 - dot(uv,uv), 0.), .18);
	
		}
	    }
    }
	
    d = fract(d);
	
    float d2 = pow( abs(d), 1./2.2 );
	
    uv *= uv+=d2;
	
    uv *= step(.1,d2);
	
    float uvdp = dot(uv,uv);
	
    vec3 xyz = vec3(uv,d2);
	
    vec3 n = normalize( uvdp*dot(xyz,xyz) + xyz );
	
    vec3 rgb = xyz+n*d2*mouse.x;
	
    return rgb;
}

// ------------------------------------------------------------

void main( void )
{
	gl_FragColor = vec4( pseudospherelattice(), 1.0 );	
}