#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// Created by michal klos - spolsh/2016

// based on:
// Created by inigo quilez - iq/2013
// https://www.shadertoy.com/view/Xds3zN


#define PI 3.14
#define TIME ( 15.0 + time )


float hash( float n ) {
	return fract(sin(n)*43758.5453);
}

float sdPlane( vec3 p )
{
	return p.y;
}

float sdSphere( vec3 p, float s )
{
    return length(p)-s;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

//----------------------------------------------------------------------

float opS( float d1, float d2 )
{
    return max(-d2,d1);
}

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

vec3 opTwist( vec3 p )
{
    float  c = cos(10.0*p.y+10.0);
    float  s = sin(10.0*p.y+10.0);
    mat2   m = mat2(c,-s,s,c);
    return vec3(m*p.xz,p.y);
}

//----------------------------------------------------------------------

// rotation matrix
mat3 rotX(float a)
{
	float c=cos(a);
	float s=sin(a);
	return mat3(1.0,0.0,0.0,0.0,c,-s,0.0,s,c);
}

mat3 rotY(float a)
{
	float c=cos(a);
	float s=sin(a);
	return mat3(c,0.0,s,0.0,1.0,0.0,-s,0.0,c);
}

mat3 rotZ(float a)
{
	float c=cos(a);
	float s=sin(a);
	return mat3(c,-s,0.0,s,c,0.0,0.0,0.0,1.0);
}


// rotate the box and 
float sdQuaterBox( vec3 p, vec3 b, vec2 sign )
{
    b.xy *= sqrt(2.0);
	float boxBase = udRoundBox( p * rotZ( 0.25 * 3.14 ), b, 0.01 );
        
    return max( sign.y * p.y, max( sign.x * p.x, boxBase ) );
}

float sdHalfBox( vec3 p, vec3 b, float cutRot )
{    
	float boxBase = udRoundBox( p, b, 0.01 );
    vec3 cp = p * rotZ( cutRot );
        
    return max( cp.x, boxBase );
}


vec2 map( in vec3 pos )
{
	float bevel = 0.01;
    float side = 0.25;
    
    vec2 res1 =      vec2( sdPlane(       pos), 1.0 );
    
    vec2 res2 = vec2(       udRoundBox(   pos-vec3( 0.0, 0.25, 0.0), vec3(side), bevel ), 3.0 );
    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( 0.0, 0.75, 0.0), vec3(side), bevel ), 3.0 ) );
    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( 0.0, 1.25, 0.0), vec3(side), bevel ), 3.0 ) );

	res2 = opU( res2, vec2( udRoundBox(   pos-vec3( 0.0, 1.25, 0.5), vec3(side), bevel ), 3.0 ) );        

    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( 0.0, 0.25, 1.0), vec3(side), bevel ), 3.0 ) );
    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( 0.0, 0.75, 1.0), vec3(side), bevel ), 3.0 ) );
    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( 0.0, 1.25, 1.0), vec3(side), bevel ), 3.0 ) );        

	res2 = opU( res2, vec2( udRoundBox(   pos-vec3( -0.5, 0.25, 0.0), vec3(side), bevel ), 3.0 ) );
	res2 = opU( res2, vec2( sdHalfBox(    pos-vec3( -0.5, 1.25, 0.0), vec3(side), 0.75 * PI ), 3.0 ) );
   
    res2 = opU( res2, vec2( sdQuaterBox(  pos-vec3( -0.5 + 0.25, 0.0, 1.0), vec3(0.25), vec2( 1.0, -1.0 ) ), 3.0 ) );        

     
    res2 = opU( res2, vec2( sdHalfBox(    pos-vec3( -1.0, 0.25, 0.0), vec3(0.25), 0.75 * PI ), 3.0 ) );
    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( -1.0, 0.75, 0.0), vec3(side), bevel ), 3.0 ) );       
    
	res2 = opU( res2, vec2( sdHalfBox(    pos-vec3( -1.0, 0.25, 0.5), vec3(0.25), 0.25 * PI ), 3.0 ) );
    res2 = opU( res2, vec2( udRoundBox(   pos-vec3( -1.0, 0.75, 0.5), vec3(side), bevel ), 3.0 ) );

   	res2 = opU( res2, vec2( sdSphere(     pos-vec3( -1.0, 0.25, 1.0), 0.25 ), 46.9 ) );                    
    
    return opU( res1, res2 );
}

vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = 1.0;
    float tmax = 20.0;
    
#if 0
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) tmin = max( tmin, tp2 );
                                                 else           tmax = min( tmax, tp2 ); }
#endif
    
	float precis = 0.0005;
    float t = tmin;
    float m = -1.0;
    for( int i=0; i<75; i++ )
    {
	    vec2 res = map( ro+rd*t );
        if( res.x<precis || t>tmax ) break;
        t += res.x;
	    m = res.y;
    }

    if( t>tmax ) m=-1.0;
    return vec2( t, m );
}


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );

}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.001, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}




vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 col = vec3(0.7, 0.9, 1.0) + rd.y*0.8;
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        
        // material        
		col = 0.45 + 0.3*sin( vec3(0.05,0.08,0.10)*(m-1.0) );
		
        if( m<1.5 )
        {
            float f = mod( floor( 2.0 * ( pos.z + 0.25 ) ) + floor( 2.0 * ( pos.x + 0.25 ) ), 2.0);
            col = 0.4 + 0.1*f*vec3(1.0);
        } else {
            // float f = length( floor( 2.0 * ( pos + vec3( 0.25, 0.5, 0.25 ) ) ) );
            // col = 0.1 + 0.1 * hash( f + fract( pos ).x ) + 0.1*f*vec3(1.0);
        }

        // lighitng        
		vec3  lig = normalize( vec3(-0.6, 0.7, -0.5) );
		float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
		float dom = smoothstep( -0.1, 0.1, ref.y );        
		float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        
        float occ = calcAO( pos, nor );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);        
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
		float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);
        
        dif *= softshadow( pos, lig, 0.02, 2.5 );
        dom *= softshadow( pos, ref, 0.02, 2.5 );
	
		vec3 lin = vec3(0.0);
        lin += 1.20*dif*vec3(1.00,0.85,0.55);
		lin += 1.20*spe*vec3(1.00,0.85,0.55)*dif;
        lin += 0.20*amb*vec3(0.50,0.70,1.00)*occ;
        lin += 0.30*dom*vec3(0.50,0.70,1.00)*occ;
        lin += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
        lin += 0.40*fre*vec3(1.00,1.00,1.00)*occ;
		col = col*lin;

    	col = mix( col, vec3(0.8,0.9,1.0), 1.0-exp( -0.002*t*t ) );		

    }

	return vec3( clamp(col,0.0,1.0) );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main()
{
	vec2 q = gl_FragCoord.xy/resolution.xy;
    vec2 p = -1.0+2.0*q;
	p.x *= resolution.x/resolution.y;
    vec2 mo = mouse.xy/resolution.xy;
		 
	// float time = 15.0 + iTime;

	// camera	
	vec3 ro = vec3( 3.5*cos(0.1*TIME + 6.0*mo.x), 0.85 + 2.0*mo.y, 3.5*sin(0.1*TIME + 6.0*mo.x) );
	vec3 ta = vec3( 0.0, 0.4, 0.0 );
	
	// camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );
    
    // ray direction
	vec3 rd = ca * normalize( vec3(p.xy,2.0) );

    // render	
    vec3 col = render( ro, rd );

	col = pow( col, vec3(0.4545) );

    gl_FragColor=vec4( col, 1.0 );
}