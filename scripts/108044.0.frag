#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iTime = time;
#define I resolution
#define PI 3.1415926
#define rot( r ) mat2(cos(r), sin(r), -sin(r), cos(r) )
#define v( a ) clamp(a , 0., 1. )
#define T( s ) fract( iTime * s ) * PI * 4.

// shane's Refractive Poly
// https://www.shadertoy.com/view/DtjSWh
const float PHI = (1. + sqrt(5.))/2.; // 1.618
const float J = (PHI - 1.)/2.; // .309016994375
const float K = PHI/2.; // J + .5
const mat3 R0 = mat3(.5,  -K,   J,  K,  J, -.5,  J , .5,  K);
const mat3 R1 = mat3( K,   J, -.5,  J, .5,   K, .5 , -K,  J);
const mat3 R2 = mat3(-J, -.5,   K, .5, -K,  -J,  K ,  J, .5);

vec3 repNormal(vec3 p){ 
    p *= .9;
    p = R0*abs(p);

    p = R1*abs(p);
    //p.xz *= rot( -T( .0125 ) );
    p = R2*abs(p);
    p.yz *= rot( -T( .025 ) );
    return abs(p) - .1;  
}

float smin (float a, float b, float r)
{
    float h = clamp(.5+.5*(b-a)/r,0.,1.);
    return mix(b, a, h) - r*h*(1.-h);
}

float smax(float a, float b, float c) {
    return -smin(-a, -b, c);
}

#define ax( a, b ) smin( a, b, .1 )

float sp( vec3 p ){
    
    float c = 5.;
    
    for( float i = 0.; i < 20.; i++ ){
	    
	if( i >= c ){
		break ;
	}
	    
        p.xz = abs( p.xz );
        p.xy *= rot( i / c );
        p.x = abs( p.x );
        p.xz *= rot( i /c * .5 );
        p.yz = abs( p.yz );
        p.yz *= rot( i /c * .5 );
    }

    return max(
        max( abs( p.x ) - .4, abs( p.y ) - .4 ),
        abs( p.z ) - .004
    );
}

float st( vec3 p ){
    p.xz *= rot( T( .025 ) );
    // return sp( p );
    
	float s=0.3;
	for(float i=0.;i<3.;i++){
		p=abs(p)-s;
		p.xz *= rot( i / 3. );
		s=s/2.5;
	}
    
    return max(
        -sp( p ),
        length( p ) - .35
    );
}


float calcCore( vec3 p ){
    p.y -= .1;

    p.xz *= rot( T( .05 ) );
    p.yz *= rot( -T( .05 ) );
    
    p = repNormal( p );

    float d = max(
        max( abs( p.y ) - .2, abs( p.z ) - .2 ),
        abs( p.x ) - .09
    );
    
    d = max(
        d,
        -st( p * 2.1 )
    );
    
    
    return d;
}
    

float df( vec3 p ){
    
    vec3 p2 = p;
    
    return calcCore( p );
}

vec3 l(in vec3 b) {
  vec2 a = vec2(1, -1) * .5773;
  return normalize(a.xyy * df(b + a.xyy * 5e-4) + a.yyx * df(b + a.yyx * 5e-4) +
                   a.yxy * df(b + a.yxy * 5e-4) + a.xxx * df(b + a.xxx * 5e-4));
}

vec3 l2(in vec3 b) {
  vec2 a = vec2(1, -2) * 2.;
  return normalize(a.xyy * df(b + a.xyy * 5e-4) + a.yyx * df(b + a.yyx * 5e-4) +
                   a.yxy * df(b + a.yxy * 5e-4) + a.xxx * df(b + a.xxx * 5e-4));
}

float g( vec3 a, vec3 p ){
    return v( dot( a, l(p) ) );
}

float S( vec3 p, vec3 ca, vec3 r, float q ){
    return v( pow( dot( l( p ), normalize( normalize( ca ) - r ) ), q ) );
}

float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax, int technique )
{
	float res = 1.0;
    float t = mint;
    float ph = 1e10; // big, such that y = 0 on the first iteration
    
    for( int i=0; i<32; i++ )
    {
		float h = df( ro + rd*t );

        // traditional technique
        if( technique==0 )
        {
        	res = min( res, 10.0*h/t );
        }
        // improved technique
        else
        {
            // use this if you are getting artifact on the first iteration, or unroll the
            // first iteration out of the loop
            //float y = (i==0) ? 0.0 : h*h/(2.0*ph); 

            float y = h*h/(2.0*ph);
            float d = sqrt(h*h-y*y);
            res = min( res, 10.0*d/max(0.0,t-y) );
            ph = h;
        }
        
        t += h;
        
        if( res<0.0001 || t>tmax ) break;
        
    }
    res = clamp( res, 0.0, 1.0 );
    return res*res*(3.0-2.0*res);
}

float bgFractal(vec2 u ){
    float s = .2;
    // u *= rot( iTime );
    for( float i = 0.; i < 20.; i++ ){
        u=abs(u)-.1;
        u.y = abs( u.y ) - .1 * s;
        u*=rot( i/3.1415 + ( .6 - cos( iTime * .25 ) * .2 ) );
        u.x = sin( abs( u.x ) - .01 );
        s *= 1.1;
    }
    
    float p = abs( length( u ) ) - .1;
    
    p = smoothstep( 0.01, p, 0.019 );
    p = dot( p, p );
    return p;
}

vec3 hsl2rgb( in vec3 c ){
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0,1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}
// some where but for desgin
vec3 colorCir( vec2 p ){
    // Position normalised into (-1, 0, 1)
    vec2 d = 1.0 - (p * 2.0);
    
    // Distance from screen center
    float dist = sqrt((d.x*d.x) + (d.y*d.y));
    
    // Rotation
    float r = acos(d.x / dist);
    // r += T( .025 );
    if (d.y < 0.0) { r = PI-(r + PI); } // Sort out the bottom half (y=-1)

    // From radians (0 - 2_PI) to hue (0 - 1)
    float hue = ((r / PI) / 2.0);
    
    // Into color
    return hsl2rgb( vec3(hue, 1.0, 0.5));
}


vec4 mainImage( in vec2 V )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 u = ( V * 2. - I.xy ) / I.y;
    
    vec3 c, p, o = vec3( 0., 0., -1.5 ), r = vec3( u * .4, 1. );
    c += .05;
    c += smoothstep( 0.5, .0, ( u.y / 2. + .5 ) + .2 );

    c += 
    (bgFractal( u ) * colorCir( u ) * .3 * ( 1. - smoothstep( 0., 1.5, length(u)-.01 ) ) ) * ( 1. - smoothstep( 1., .3, ( u.y / 2. + .5 ) + .2 ) );
    
    float t, d;
    for( float i = 0.; i < 64.; i++ )
        p = o + r * t,
        d = df( p ),
        t += d;
    
    if( d < 1e-3 ){
        
          vec3 p2 = p;

            p2 = repNormal( p2 );
            
            vec3 n = l( p );
            float rc = g( vec3( .0, 1.1, -.1 ), p );

            // c += rc * .1;
            
            vec3 rr = reflect(l(p), r);

            
            //c += rr * .1;
            float amb = dot(n, vec3(1.0, 1.0, -1.6));
            
            c = vec3( .1 );
            
            c += S( p, n, r, 5. ) * .1;
            //c +=  rr.x * .1;

            float ss = calcSoftshadow( p, vec3( -.5, 1.1, -1. ), 0.1, .5, 0 ) * rc;
            c += ss ;
            
            c = sqrt( c );
            c += p2 * .4;
            c = v( c );
    }
    
    
    p = vec3( 0 );
    d = 0.,
    t = 0.;
    
    for( float i = 0.; i < 24.; i++ )
        p = o + r * t,
        p.y *= -1.,
        //p.x -= .05,
        p.y -= .77,
        d = df( p ),
        t += d;
    if( d < 1e-3 ){
        vec3 p2 = repNormal( p );
        vec3 rr = reflect(l(p), c);
        /*
        c += vec3( p2.x, p2.y, p2.z / 2. + .5 ) * .1 +
            (.5 + .35 * cos(o + p.xyx * 2. + vec3(1, 5, 2))) * .05;
        c += rr * .1;
        */
        c -= rr.r * .1 - p2 * .1;
    }
    
    // Output to screen
    return vec4(c,1.0);
}


void main( void ) {

	gl_FragColor = mainImage( gl_FragCoord.xy );

}