// test...
// ...by ändrom3da


// options
#define Zoom                     (1./1.)
#define speed	 	         (1./4.)
#define timeOffset               0.0
#define rotation                 0               // rotation 0 = off, 1 = on
#define stepless                 1

// options > more options
#define program_Mode             99
#define gfx_2D                   1
#define gfx_2Dsdf                1
#define gfx_3Dsdf                0
#define surfacePosition_Mode     0
#define bb_Mode                  1
#define bb_Strength              (1./8.)
#define smoothstep_Mode          1               // smoothstep 0 = off, 1 = on                  
#define smoothstep_EdgeLen       (1./128.)
#define nfloor_Mode              stepless
#define backbuffer_Mode          1
#define backbuffer_Strength      (1./3.)
#define colorBar_Mode            1
#define colorBar_Tiles           16.
#define colorBar_Speed           (2./1.)
#define colorBar_Palette         pal1
#define colorBar_Pos             vec2(0.0, 0.0)
#define colorBar_Size            vec2(1.0, 0.04)
#define gammaCorrection_Mode     0
#define gammaCorrection_Value    0.4545
#define onlyBlackWhite           0
#define dithering_Mode           0

// options > raymarch options
#define rm_MaxSteps              128
#define rm_MaxDist               200.0
#define rm_SurfDist              0.001
#define rm_Epsilon               0.0001
#define rm_LightPos              vec3(0.0, 0.0, 0.0)
#define rm_RayOrigin	         vec3(0.0, 0.0, 3.0)
#define rm_UseFog                1
#define rm_FogStrength           0.25
#define rm_Light_Mode            1
#define rm_LightIntensity        (1./1.)
#define rm_ColNormal_Mode        1
#define rm_ColNormal_Strength    (7./10.)

// stuff > #1
#extension GL_OES_standard_derivatives : enable
precision highp                  float;
uniform float                    time;
uniform vec2                     mouse;
uniform vec2                     resolution;
#define res                      resolution
uniform sampler2D                backBuffer;
#define bb		         backBuffer
varying vec2                     surfacePosition;
#define tau		         6.283185307179586
#define pi                       3.141592653589793
#define phi                      1.618033988749895
#define inv_phi                  0.618033988749895
#define rot( a )         	 mat2( cos(a), -sin(a), sin(a), cos(a) )
#define time                     (time*speed + timeOffset)
#define nsin( a )                sin( a )*.5 + .5
#define ncos( a )                cos( a )*.5 + .5
#define tw                       nsin( time )
#define black                    vec3(0.0)
#define white                    vec3(1.0)

// stuff > #2 (step vs. smoothstep)
#define smoothstep_Factor 1.
#if (smoothstep_Mode == 0)
  #define nstep( a, b )  step( a, b )
#else
  #define nstep( a, b )  smoothstep( a + (-smoothstep_EdgeLen/(2.*smoothstep_Factor)), a + (smoothstep_EdgeLen/(2.*smoothstep_Factor)), b ) 
#endif

// stuff > #3 nfloor (steps vs. steplessly)		 
#if ( nfloor_Mode == 0 )
  #define nfloor		         floor
#else
  #define nfloor( a )                    (a)
#endif


// stuff > #4 (global variables)
vec2 p, p0, p1;         // these are the domain variables
float zoom =            Zoom;
vec3 col =              vec3(0.0);

// program mode threads
float program0()
{
     col += vec3(0.5)*step(p.x, 0.5);
     return 0.;
}

float program1()
{
    col += vec3(0.5,0.1,0.9)*step(p.x, 0.5);
    return 0.;
}

// functions > noise functions
#define seed 447585453.12344
float N21(vec2 p) 
{
    p = mod(p, tau*20.);
    float a = (mod(43758.5453123 + seed, 37562.) + 13548.);
    float f = dot (p, vec2 (127.1, 351.7));
    return fract(sin(f)*a);
}
vec2 N22(vec2 p) 
{
    p = mod(p, tau*20.);
    float a = (mod(43758.5453123 + seed, 37562.) + 13548.);
    p = vec2(dot (p, vec2 (127.1, 351.7)), dot(p, vec2(245.5, 304.4)));
    return fract(sin(p)*a);
}
vec3 N23(vec2 p)
{
    p = mod(p, tau*20.);
    float a = (mod(43758.5453123 + seed, 37562.) + 13548.);
    vec3 p3 = vec3(dot (p, vec2 (127.1, 351.7)), dot (p, vec2 (261.5, 183.3)), dot(p, vec2(245.5, 304.4)));
    return fract(sin(p3)*a);
}
vec2 N32(vec3 p)
{
    p = mod(p, tau*20.);
    float a = (mod(43758.5453123 + seed, 37562.) + 13548.);
    vec2 p2 = vec2(dot (p, vec3 (127.1, 351.7, 251.45)), dot (p, vec3 (261.5, 183.3, 376.89)));
    return fract(sin(p2)*a);
}
float N31(vec3 p)
{
    p = mod(p, tau*20.);
    float a = (mod(43758.5453123 + seed, 37562.) + 13548.);
    float f = dot (p, vec3 (127.1, 351.7, 251.45));
    return fract(sin(f)*a);
}
/*float noise21( in vec2 x )
{
  vec2 p  = floor(x);
  vec2 f  = smoothstep(0.0, 1.0, fract(x));
  float n = p.x + p.y*57.0;

  return mix(mix( N11(n+  0.0), N11(n+  1.0),f.x),
    mix( N11(n+ 57.0), N11(n+ 58.0),f.x),f.y);
}*/
/*float noise( const in  float p ) {    
    float i = floor( p );
    float f = fract( p );	
	float u = f*f*(3.0-2.0*f);
    return -1.0+2.0* mix( hash( i + 0. ), hash( i + 1. ), u);
}

float noise( const in  vec2 p ) {    
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}
float noise( const in  vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float tri( const in vec2 p ) {
    return 0.5*(cos(6.2831*p.x) + cos(6.2831*p.y));
   
}
*/

// functions > color & palette functions
vec3 hsv2rgb( vec3 c )
{
    vec4 K = vec4( 1.0, (2.0/3.0), (1.0/3.0), 3.0 );
    vec3 p = abs( fract( c.xxx + K.xyz )*6.0 - K.www );
    return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );
}
vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    #define pal1 vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3( 1.0, 1.0, 1.0),vec3(0.0, 0.33, 0.67)  
    #define pal2 vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3( 1.0, 1.0, 1.0),vec3(0.0, 0.10, 0.20)
    #define pal3 vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3( 1.0, 1.0, 1.0),vec3(0.3, 0.20, 0.20)
    #define pal4 vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3( 1.0, 1.0, 0.5),vec3(0.8, 0.90, 0.30)
    #define pal5 vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3( 1.0, 0.7, 0.4),vec3(0.0, 0.15, 0.20)
    #define pal6 vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3( 2.0, 1.0, 0.0),vec3(0.5, 0.20, 0.25)
    #define pal7 vec3(0.8, 0.5, 0.4),vec3(0.2, 0.4, 0.2),vec3( 2.0, 1.0, 1.0),vec3(0.0, 0.25, 0.25)        // stolen from iq!
    return a + b*cos( tau*( c*t + d ) );
}
vec3 dualPalette( float t, vec3 color1, vec3 color2 )
{
	vec3 c = vec3(1.0);
	c *= mix( color1, color2, t );
	return c * 1.0;
}
vec3 simplePalette( float t, vec3 r, vec3 g, vec3 b ) 
{
       vec3 c = vec3(
			sin( tau*(+r.x/+r.y)*t + r.z ),
			sin( tau*(+g.x/+g.y)*t + g.z ),
			sin( tau*(+b.x/+b.y)*t + b.z )
		);
	return c;
}


// functions > 2d geometry
float rectangle( vec2 p, vec2 size )
{
	vec2 halfsize = size/1.;
	float r = step(-halfsize.x, p.x)  * step(-halfsize.y, p.y) *
        	step(p.x, halfsize.x)   * step(p.y, halfsize.y);
		return r;
}
float rectangleBar( vec2 p1, vec2 size )
{
		vec2 halfsize = size/2.;
		float r = step(0., p1.x)      * step(0., p1.y) *
			step(p1.x, size.x)  * step(p1.y, size.y);
		return r;
}


// functions > 3d raymarching > sdf operators
float smin( float a, float b, float k )
{
	float h = clamp( 0.5+0.5*(b-a)/k, 0., 1. );
	return mix( b, a, h ) - k*h*(1.0-h);
}
vec3 opRep(in vec3 p, in vec3 size)
{
	vec3 q = mod( p + 0.5*size, size ) - 0.5*size;
	// ti = floor((p + c*0.5)/c);  // tile index global variable
	return q;
}
vec3 opRepLim(in vec3 p, in float c, in vec3 limita, in vec3 limitb)
{
	return p - c * clamp(floor(p / c + 0.5), limita, limitb);
}
vec3 opMod3( inout vec3 p, vec3 size) {                      // from www.mercury.sexy/hg_sdf version
	vec3 ti = floor( (p + size/2.)/size );
	p = mod(p + size/2., size) - size/2.;
	return ti;               
}

// functions > 3d raymarching > sdf geometry
float sdPlane( vec3 p, vec3 origin, vec3 normal )
{ 
    return dot( p - origin, normal );   
}
float sdBox( vec3 p, vec3 s )
{
	p = abs(p) - s;
	return length( max(p, 0.) ) + min( max ( p.x, max( p.y, p.z ) ), 0. );
}
float sdSphere( vec3 p, float size )
{
	return length(p) - size;
}
float sdTorus( vec3 p, vec2 r )
{
	float x = length(p.xz)-r.x;
	return length(vec2(x, p.y))-r.y;
}
float sdTetrahedron(vec3 p, float d)
{
    float dn =1.0/sqrt(4.0);

	//The tetrahedran is the intersection of four planes:
	float sd1 = sdPlane(p,vec3(d,d,d) ,vec3(-dn,dn,dn)) ; 
	float sd2 = sdPlane(p,vec3(d,-d,-d) ,vec3(dn,-dn,dn)) ;
	float sd3 = sdPlane(p,vec3(-d,d,-d) ,vec3(dn,dn,-dn)) ;
	float sd4 = sdPlane(p,vec3(-d,-d,d) ,vec3(-dn,-dn,-dn)) ;
	//max intersects shapes
	return max(max(sd1,sd2),max(sd3,sd4));
}
float sdRhombicTriacontahedron2( vec3 p, float r )
{
	float c = cos(pi/5.);
	float s = sqrt(0.75 - c*c);
	vec3 n = vec3(-0.5, -c, s);
	p = abs(p);
	p -= 2.*min(0., dot(p, n))*n;
	p.xy = abs(p.xy);
	p -= 2.*min(0., dot(p, n))*n;
	p.xy = abs(p.xy);
	p -= 2.*min(0., dot(p, n))*n;
	float d = p.z - 1.0;
	return d;
}


// the color bar !
vec3 colorBar( vec2 p1, vec3 c )
{
	vec3 o = vec3(1.0);
	const float  border  =  0.002;
	vec2 rectSize        =  colorBar_Size;
	vec2 rectPos         =  colorBar_Pos;
	o *= rectangleBar(p1 - rectPos, rectSize);
	o *= cosPalette( ( floor( colorBar_Tiles*p1.x + 0.5*colorBar_Tiles*time*(colorBar_Speed) ) )/colorBar_Tiles, colorBar_Palette );  // one second for one rotation
	p1 += rectPos;
	return (o - c) * step( p1.y - border, rectSize.y + rectPos.y );  // minus c because the color should be "overwritten
}

// scene
float scene_2D( vec2 p )
{

    //p *= rot(time);
    vec2 m = mouse; m.x = m.x*.5+.5;
    float zoom = 1.0; // zoom = 1./pow(2.*( ( 1.2 - (m.x) ) ), 16.0);
    m.x = 1.-m.x;

	zoom = m.x;
    /*
       left side: zoom 1.
       middle:    zoom 10.
       right:     10000. 
    */
	
    p *= zoom;
	//p*=pow(m.x);
    /* col += 1./( pow( 2.0, nfloor( mouse.y*8. ) ) + 1. );	
    
    float rep2 = nfloor( pow( 2.0, ( (1.75 - mouse.x)*2. ) ) + 0. );
    float rep = 16.;
    col += length( sin( rep*p.x + sin(16.*p.y+64.*time) ) + rep2*p.y );	
    col *= ( 3./4. );
	
    col = 1. - col; */  
    float flip;
    vec2 size = vec2( 1.0, 1.0 );
    for ( int i = 0; i < 6; i++ )
    {
	float offset = zoom;
	float zoomOffset = float(i) + 2.*offset;
	float color = cos( float( zoomOffset )*pi );  // is flipping between -1. and +1.
	size = vec2( 1.0, 1.0 )*pow( 2.0, float( -zoomOffset ) );
	col += ( 1./2. )*rectangle( p, size )*color;
        //col -= rectangle( p, vec2( size ) );
    }
    float d; 
    #if ( colorBar_Mode == 1 )
      col += colorBar( p1, col );
    #endif	
    return d;
}

float scene_2Dsdf( vec2 p )
{
    float d; 
 
    return d;
}

float scene_3Dsdf( vec3 p )
{
    p.xz *= rot(-(mouse.x-.5));
    p.yz *= rot(mouse.y-.5);
 
    float d = 0.0;
    p = opRep( p, vec3(5.0, 8.0, 5.0) );
    p.xy *= rot(1.*time);
    p.xz *= rot(0.5*time);
    float rhombTri = sdRhombicTriacontahedron2( p, 0.5 );
    d = rhombTri;
    return d;
}

//// functions > 3D raymarching graphics > calculating shadow
/* float shadow( in vec3 ro, in vec3 rd, float mint, float maxt )
{
    for( float t = mint; t < maxt; )
    {
        float h = scene_3Dsdf(ro + rd*t);
        if( h<0.001 )
            return 0.0;
        t += h;
    }
    return 1.0;
} 
float softshadow( in vec3 ro, in vec3 rd, float mint, float maxt, float k )
{
    float res = 1.0;
    for( float t = mint; t < maxt; )
    {
        float h = scene_3Dsdf(ro + rd*t);
        if( h<0.001 )
            return 0.0;
        res = min( res, k*h/t );
        t += h;
    }
    return res;
} */


// functions > 3d raymarching > march function
float march( vec3 ro, vec3 rd )
{
	float dO = 0.0;
	for( int i = 0; i < rm_MaxSteps; i++ )
	{
		vec3 p = ro + rd * dO;
		float dS = scene_3Dsdf( p );
		dO += dS;
		if( dO > rm_MaxDist ) break;    // important 
		// if ( dO > rayMaxDist || abs(dS) < surfDist ) break;
	}
   	return dO;
}

// functions > 3D raymarching > calculating normals
	vec3 normal( vec3 p )
	{
		float d = scene_3Dsdf( p );
    	        vec2 e = vec2(rm_Epsilon, 0.0);
    	        vec3 n = d - vec3(
							scene_3Dsdf( p - e.xyy ),
							scene_3Dsdf( p - e.yxy ),
							scene_3Dsdf( p - e.yyx )
					     );
	    return normalize( n );
	}

// functions > 3D raymarching > calculating light
	float light( vec3 p )
	{
		vec3 lp = rm_LightPos;
		lp.x += 40.*sin(2.*time);
		//lp.y -= time;
		//lp = vec3(0.0, 3.0, 0.0);
		vec3 l = normalize( lp - p );
		vec3 n = normal( p );
		float dif = clamp( dot( n, l )*0.5 + 0.5, 0.0, 1.0);
		float d = march( p + 2.0*rm_SurfDist*n, l );
		return dif;
	}

        float diffuse( const in vec3 n, const in vec3 l)
	{ 
        	return clamp(dot(n,l),0.,1.);
        }

	float specular( const in vec3 n, const in vec3 l, const in vec3 e, const in float s)
	{    
    		float nrm = (s + 8.0) / (3.1415 * 8.0);
    	return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
	}

	float fresnel( const in vec3 n, const in vec3 e, float s )
	{
    		return pow(clamp(1.-dot(n,e), 0., 1.),s);
	}
       
        // https://blog.mmacklin.com/2010/06/10/faster-fog/
        float InScatter(vec3 start, vec3 dir, vec3 lightPos, float d)
        {
   		vec3 q = start - lightPos;
   		float b = dot(dir, q);
   		float c = dot(q, q);
   		float s = 1.0 / max(0.001,sqrt(c - b*b));
   		float x = d*s;
 	  	float y = b*s;
   		float l = s * atan(x/max(0.001,1.+(x+y)*y));
   		return l;
	}


// ray for raymarching
vec3 ray(vec2 p, vec3 camPos, vec3 lookAt, float z)                   // l = lookat position (?) , camPos = camera position (?) 
{  
	vec3 f = normalize( lookAt - camPos ),                        // forward vector
		 r = normalize( cross( vec3(0.0, 1.0, 0.0), f ) ),    // the right vector (?) , the vec3 stands for the "world up" vector   (?)
		 u = cross( f, r ),                                   // camera up (?)
		 c = camPos + f*z,                                    // is this the center of the screen?
		 i = c + p.x*r + p.y*u,                               // intersection point ray with screen
		 d = normalize( i - camPos );                         // i guess ray direction ? (or distance...)
	return d;
}

// render function for raymarching
vec3 render3Dsdf( vec2 p )
{
	vec3 c = vec3(0.0);
	vec3 rayO = rm_RayOrigin;
	vec3 rm_RayDir = ray( p, rayO, vec3(0.0, 0.0, 0.0), 1.0 );   // i changed this from vec3(0,1,0)
	float d = march( rayO, rm_RayDir );
       
	if ( d < rm_MaxDist )        
	{
		vec3 p = rayO + rm_RayDir * d;
		#if ( rm_ColNormal_Mode == 1 )
		  c = rm_ColNormal_Strength*(normal( p )*0.5 + 0.5);
		#endif
		#if ( rm_Light_Mode == 1 )
		  float dif = rm_LightIntensity*light( p );
		  c += (dif/2.);
		#endif
		//c = (normal( p )*0.5 + 0.5);
		/* if ( isStar == true )
		{
			c = white * vec3(0.3, 0.4, 1.0);
		} */
		//c += softshadow( rayO, rayD );
	}
	#if ( rm_UseFog == 1 )
		float fog = 0.005;
		fog *= rm_FogStrength;
       	        c *= (1.25) / (1.0 + d*d*fog);
	#endif
	return c;
 }

// main 0 thread
void main0()
{
    col = hsv2rgb( vec3( nsin( (1./4.)*time ), (4./5.), (1./5.) ) );
}

// main 1 thread
void main1()
{
    // rotation	
    #if ( rotation == 1 )
      p *= rot( time*tau );  // 360° rotation in 1 sec
    #endif
    #if ( gfx_3Dsdf == 1 )
      col += render3Dsdf( p );
    #endif
    #if ( gfx_2D == 1 )
      scene_2D( p );
    #endif
    #if ( gfx_2Dsdf == 1 )
      scene_2Dsdf( p );
    #endif   
}


// main thread
void main( void )
{
    // domain
    #if ( surfacePosition_Mode == 1 ) 
      p = 2.*surfacePosition;
    #else
      p = ( 2.*gl_FragCoord.xy - res )/min( res.x, res.y );
    #endif
    p0  = gl_FragCoord.xy/res.xy;                // not centered for "previous frame" backbuffer
    p1  = gl_FragCoord.xy/res.xy; p1.y = 1.0 - p1.y;
    p *= (1./zoom);
     
    #if ( program_Mode < 10 )
      main0();
    #endif
    #if ( program_Mode == 99 )
      main1();
    #endif
    
    // "previous frame" backbuffer smoothness effect
    #if ( backbuffer_Mode == 1)
      col = ( backbuffer_Strength/1. )*texture2D( bb, p0 ).x + ( (1. - backbuffer_Strength)/1. )*col;
    #endif

    // gamma correction
    #if ( gammaCorrection_Mode == 1 )
      col = pow(col.rgb, vec3(1.0/gammaCorrection_Value));
    #endif
	
    // black & white
    #if ( onlyBlackWhite == 1 )
      float c = (col.r + col.g + col.b)/3.;
      col = vec3(c);
    #endif
	
    // vignetting
//    col *= exp(-(2./5.) * length( p )) * (8./7.);    
	
    // experimental cheap dithering
    #if ( dithering_Mode == 1 )
      col += floor(p.y - fract(dot(gl_FragCoord.xy, vec2(0.5, 0.5))) * 4.0) * (1./8.)*step( p.y, 2.-1.08);  // dithering effect
    #endif
	
    // final fragment
    gl_FragColor = vec4(col, 1.0);
}