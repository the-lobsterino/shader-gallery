/*
 * Original shader from: https://www.shadertoy.com/view/WtSSDw
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

#define HW_PERFORMANCE 0

// Emulate some GLSL ES 3.x
mat3 inverse(mat3 m)
{
    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

    float b01 =  a22 * a11 - a12 * a21;
    float b11 = -a22 * a10 + a12 * a20;
    float b21 =  a21 * a10 - a11 * a20;

    float det = a00 * b01 + a01 * b11 + a02 * b21;

    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

// --------[ Original ShaderToy begins here ]---------- //
// The MIT License
// Copyright © 2019 David Gallardo @galloscript
// Just modeling over Original IQ Raymarching example https://www.shadertoy.com/view/Xds3zN

//Raymarching utility functions
    

const vec3 X_AXIS = vec3(1,0,0);
const vec3 Y_AXIS = vec3(0,1,0);
const vec3 Z_AXIS = vec3(0,0,1);


// Shortcut for 45-degrees rotation
void pR45(inout vec2 p) {
	p = (p + vec2(p.y, -p.x))*sqrt(0.5);
}

// Repeat space along one axis. Use like this to repeat along the x axis:
// <float cell = pMod1(p.x,5);> - using the return value is optional.
float pMod1(inout float p, float size) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

// The "Columns" flavour makes n-1 circular columns at a 45 degree angle:
float fOpUnionColumns(float a, float b, float r, float n) {
	if ((a < r) && (b < r)) {
		vec2 p = vec2(a, b);
		float columnradius = r*sqrt(2.)/((n-1.)*2.+sqrt(2.));
		pR45(p);
		p.x -= sqrt(2.)/2.*r;
		p.x += columnradius*sqrt(2.);
		if (mod(n,2.) == 1.) {
			p.y += columnradius;
		}
		// At this point, we have turned 45 degrees and moved at a point on the
		// diagonal that we want to place the columns on.
		// Now, repeat the domain along this direction and place a circle.
		pMod1(p.y, columnradius*2.);
		float result = length(p) - columnradius;
		result = min(result, p.x);
		result = min(result, a);
		return min(result, b);
	} else {
		return min(a, b);
	}
}

// The "Stairs" flavour produces n-1 steps of a staircase:
// much less stupid version by paniq
float fOpUnionStairs(float a, float b, float r, float n) {
	float s = r/n;
	float u = b-r;
	return min(min(a,b), 0.5 * (u + a + abs ((mod (u - a + s, 2. * s)) - s)));
}

// first object gets a v-shaped engraving where it intersect the second
float fOpEngrave(float a, float b, float r) {
	return max(a, (a + r - abs(b))*sqrt(0.5));
}

float fOpIntersectionRound(float a, float b, float r) {
	vec2 u = max(vec2(r + a,r + b), vec2(0));
	return min(-r, max (a, b)) + length(u);
}

// polynomial smooth min (k = 0.1);
float smin2( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

	
// power smooth min (k = 8);
float smin3( float a, float b, float k )
{
    a = pow( a, k ); b = pow( b, k );
    return pow( (a*b)/(a+b), 1.0/k );
}


// exponential smooth min (k = 32);
float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}


//------------------------------------------------------------------

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

float sdEllipsoid( in vec3 p, in vec3 r ) // approximated
{
    float k0 = length(p/r);
    float k1 = length(p/(r*r));
    return k0*(k0-1.0)/k1;
    
}

float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0)) - r
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}

float sdTorus( vec3 p, vec2 t )
{
    return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
}

float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb)
{
    p.x = abs(p.x);
    float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
    return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}

float sdHexPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);

    const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
    p = abs(p);
    p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
    vec2 d = vec2(
       length(p.xy - vec2(clamp(p.x, -k.z*h.x, k.z*h.x), h.x))*sign(p.y - h.x),
       p.z-h.y );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/(dot(ba,ba)), 0.1, 0.9 );
	return length( pa - ba*h ) - r;
}

float sdRoundCone( in vec3 p, in float r1, float r2, float h )
{
    vec2 q = vec2( length(p.xz), p.y );
    
    float b = (r1-r2)/h;
    float a = sqrt(1.0-b*b);
    float k = dot(q,vec2(-b,a));
    
    if( k < 0.0 ) return length(q) - r1;
    if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
    return dot(q, vec2(a,b) ) - r1;
}

float dot2(in vec3 v ) {return dot(v,v);}
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2)
{
    // sampling independent computations (only depend on shape)
    vec3  ba = b - a;
    float l2 = dot(ba,ba);
    float rr = r1 - r2;
    float a2 = l2 - rr*rr;
    float il2 = 1.0/l2;
    
    // sampling dependant computations
    vec3 pa = p - a;
    float y = dot(pa,ba);
    float z = y - l2;
    float x2 = dot2( pa*l2 - ba*y );
    float y2 = y*y*l2;
    float z2 = z*z*l2;

    // single square root!
    float k = sign(rr)*rr*rr*x2;
    if( sign(z)*a2*z2 > k ) return  sqrt(x2 + z2)        *il2 - r2;
    if( sign(y)*a2*y2 < k ) return  sqrt(x2 + y2)        *il2 - r1;
                            return (sqrt(x2*a2*il2)+y*rr)*il2 - r1;
}

float sdEquilateralTriangle(  in vec2 p )
{
    const float k = 1.73205;//sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x += 2.0 - 2.0*clamp( (p.x+2.0)/2.0, 0.0, 1.0 );
    return -length(p)*sign(p.y);
}

float sdTriPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
    float d1 = q.z-h.y;
    h.x *= 0.866025;
    float d2 = sdEquilateralTriangle(p.xy/h.x)*h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

// vertical
float sdCylinder( vec3 p, vec2 h )
{
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

// arbitrary orientation
float sdCylinder(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 pa = p - a;
    vec3 ba = b - a;
    float baba = dot(ba,ba);
    float paba = dot(pa,ba);

    float x = length(pa*baba-ba*paba) - r*baba;
    float y = abs(paba-baba*0.5)-baba*0.5;
    float x2 = x*x;
    float y2 = y*y*baba;
    float d = (max(x,y)<0.0)?-min(x2,y2):(((x>0.0)?x2:0.0)+((y>0.0)?y2:0.0));
    return sign(d)*sqrt(abs(d))/baba;
}

// rounded cylinder
float sdRoundedCylinder( vec3 p, float ra, float rb, float h )
{
    vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

// vertical
float sdCone( in vec3 p, in vec3 c )
{
    vec2 q = vec2( length(p.xz), p.y );
    float d1 = -q.y-c.z;
    float d2 = max( dot(q,c.xy), q.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float dot2( in vec2 v ) { return dot(v,v); }
float sdCone( in vec3 p, in float h, in float r1, in float r2 )
{
    vec2 q = vec2( length(p.xz), p.y );
    
    vec2 k1 = vec2(r2,h);
    vec2 k2 = vec2(r2-r1,2.0*h);
    vec2 ca = vec2(q.x-min(q.x,(q.y < 0.0)?r1:r2), abs(q.y)-h);
    vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );
    float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
    return s*sqrt( min(dot2(ca),dot2(cb)) );
}

// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdCone(vec3 p, vec3 a, vec3 b, float ra, float rb)
{
    float rba  = rb-ra;
    float baba = dot(b-a,b-a);
    float papa = dot(p-a,p-a);
    float paba = dot(p-a,b-a)/baba;

    float x = sqrt( papa - paba*paba*baba );

    float cax = max(0.0,x-((paba<0.5)?ra:rb));
    float cay = abs(paba-0.5)-0.5;

    float k = rba*rba + baba;
    float f = clamp( (rba*(x-ra)+paba*baba)/k, 0.0, 1.0 );

    float cbx = x-ra - f*rba;
    float cby = paba - f;
    
    float s = (cbx < 0.0 && cay < 0.0) ? -1.0 : 1.0;
    
    return s*sqrt( min(cax*cax + cay*cay*baba,
                       cbx*cbx + cby*cby*baba) );
}



float sdOctahedron(vec3 p, float s)
{
    p = abs(p);
    float m = p.x + p.y + p.z - s;

    // exact distance
    #if 0
    vec3 o = min(3.0*p - m, 0.0);
    o = max(6.0*p - m*2.0 - o*3.0 + (o.x+o.y+o.z), 0.0);
    return length(p - s*o/(o.x+o.y+o.z));
    #endif
    
    // exact distance
    #if 1
 	vec3 q;
         if( 3.0*p.x < m ) q = p.xyz;
    else if( 3.0*p.y < m ) q = p.yzx;
    else if( 3.0*p.z < m ) q = p.zxy;
    else return m*0.57735027;
    float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
    return length(vec3(q.x,q.y-s+k,q.z-k)); 
    #endif
    
    // bound, not exact
    #if 0
	return m*0.57735027;
    #endif
}


//------------------------------------------------------------------


//------------------------------------------------------------------
mat3 rotation(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return inverse(mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s, 
 						oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  
 						oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c));
}

#define M_PI 3.142
#if HW_PERFORMANCE==0
#define AA 0
#else
#define AA 1  // make this 2 or 3 for antialiasing
#endif

//------------------------------------------------------------------

#define ZERO 0

//------------------------------------------------------------------

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}


vec3 opCheapBend( in vec3 p, float k )
{
    float c = cos(k*p.x);
    float s = sin(k*p.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return q;
}


float opSmoothUnion( float d1, float d2, float k ) 
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

vec3 opMirrorX(in vec3 pos)
{
    vec3 lPos = pos;
    lPos.x = abs(lPos.x);
    return lPos;
}

vec3 opMirrorY(inout vec3 pos)
{
    pos.y = abs(pos.y);
    return pos;
}

vec2 map( in vec3 pos )
{
    vec2 res = vec2( 1e10, 0.0 );
	
    //Body
    		//Torso
    float 	lBody = sdEllipsoid( pos - vec3(0.0, 0.39, 0.0), vec3(0.16, 0.28, 0.15));
    		//Espalda
    		lBody = opSmoothUnion(lBody, sdEllipsoid( pos - vec3(0.0, 0.31, 0.05), vec3(0.18, 0.25, 0.18)), 0.1);
    		//Barriguita
    		lBody = opSmoothUnion(lBody, sdEllipsoid( pos - vec3(0.0, 0.25, -0.02), vec3(0.1, 0.1, 0.1)), 0.1);
    		//Piernas
    	  	lBody = opSmoothUnion(lBody, sdEllipsoid( opMirrorX(pos) - vec3(0.15, 0.13, 0.0), vec3(0.08 , 0.1, 0.08)), 0.1);
    		//Pies
    	  	lBody = opSmoothUnion(lBody, sdEllipsoid( opMirrorX(pos) - vec3(0.15, -0.0025, -0.03), vec3(0.036 , 0.035, 0.09)), 0.02);
    		//Brazos
    		lBody = opSmoothUnion(lBody, sdEllipsoid( rotation(Y_AXIS, 0.6) * rotation(X_AXIS, -0.8) * rotation(Z_AXIS, 0.5) * (opMirrorX(pos) - vec3(0.121, 0.36, -0.10)), vec3(0.05, 0.14, 0.032)), 0.01);		
    
    //Head
    vec3 lHeadPos = pos - vec3(0.0, 0.56, 0.0);
    vec3 lMirrorHeadPos = opMirrorX(pos) - vec3(0.0, 0.56, 0.0);
    		//Cabeza
    float   lHead = sdEllipsoid( lHeadPos, vec3(0.18, 0.19, 0.17));
    		//Morro
    	    lHead = opSmoothUnion(lHead, sdEllipsoid( rotation(X_AXIS, 0.8) * (lHeadPos - vec3(0.0, -0.02, -0.13)), vec3(0.12, 0.08, 0.06)), 0.04);
    		//Orejas
    		lHead = opSmoothUnion(lHead, sdEllipsoid( rotation(Z_AXIS, 0.6) * (lHeadPos - vec3(0.17, 0.22, 0.0)), vec3(0.04, 0.15, 0.034)), 0.02);
            lHead = opSmoothUnion(lHead, sdEllipsoid( rotation(Z_AXIS, -1.2) * (lHeadPos - vec3(-0.22, 0.20, 0.0)), vec3(0.04, 0.15, 0.034)), 0.02);
    
    float lEarsCutter = sdTorus( rotation(X_AXIS, M_PI * 0.5) * (lHeadPos - vec3(-0.02, 0.15, 0.0)), vec2(0.34, 0.07) );
    lEarsCutter = max(lHead, lEarsCutter);
    //Head + Body
    lBody = opSmoothUnion(lBody, lHead, 0.006);
    
    //Ears black
    res = opU( res, vec2( lBody, 2.0 ) );
    
    if(pos.y > 0.7)
    {
    	res = opU( res, vec2( lEarsCutter, 4.0 ) );
    }
    
    
    //Morrito black
    float lMorrito = sdEllipsoid( lHeadPos - vec3(0.0, 0.02, -0.19), vec3(0.02, 0.01, 0.01));
    float lMouth = sdEllipsoid( lMirrorHeadPos - vec3(0.02, -0.01, -0.198), vec3(0.03, 0.011, 0.01));
    	  lMouth = max(lMouth, -sdEllipsoid( lMirrorHeadPos - vec3(0.02, -0.006, -0.198), vec3(0.03, 0.011, 0.012)));
    	  lMouth = max(lMouth, lHead);
    lMorrito = min(lMorrito, lMouth);
    res = opU( res, vec2( lMorrito, 4.0 ) );
    
    //Mofletes
    float lMofletes = sdSphere( lMirrorHeadPos - vec3( 0.15, 0.02, -0.1), 0.04 );
    lMofletes = max(lMofletes, lHead);
	res = opU( res, vec2( lMofletes, 3.0) );
    
	//Eyes
    float lEyes = sdSphere( lMirrorHeadPos-vec3( 0.077, 0.07, -0.13), 0.028 );
    lEyes = max(lEyes, lHead);
	res = opU( res, vec2( lEyes, 4.0) );
    float lEyesWhite = sdSphere( lMirrorHeadPos-vec3( 0.073, 0.075, -0.13), 0.019 );
    lEyesWhite =  max(lEyes, lEyesWhite);
    res = opU( res, vec2( lEyesWhite, 5.0) );
    
    //Back marks
    float 	lBackMarks = sdEllipsoid( lHeadPos - vec3(0.0, -0.13, 0.18), vec3(0.2, 0.03, 0.1));
    		lBackMarks = min(lBackMarks, sdEllipsoid( lHeadPos - vec3(0.0, -0.25, 0.18), vec3(0.2, 0.03, 0.1)));
    		lBackMarks = max(lBackMarks, lBody);
    res = opU( res, vec2( lBackMarks, 6.0) );
    
    
    //Tail
    mat3 lTailAnimRot = rotation(Y_AXIS, sin(iTime*0.8) * 0.4);
    vec3 lTailPos = rotation(X_AXIS, 0.22) * lTailAnimRot * (pos - vec3(0.0, 0.18, 0.18));
    
    float 	lTail = 			sdCone( lTailPos, vec3(0.0, 0.00, 0.00), vec3(0.0, 0.00, 0.14), 0.01, 0.02);
	    	lTail = min(lTail, 	sdCone( lTailPos, vec3(0.0, 0.00, 0.12), vec3(0.0, 0.1, 0.13), 0.02, 0.03));
    		lTail = min(lTail, 	sdCone( lTailPos, vec3(0.0, 0.08, 0.1),  vec3(0.0, 0.08, 0.25), 0.025, 0.04));
    		lTail = min(lTail, 	sdCone( lTailPos, vec3(0.0, 0.05, 0.22), vec3(0.0, 0.2, 0.22), 0.035, 0.045));
    		lTail = min(lTail, 	sdCone( lTailPos, vec3(0.0, 0.16, 0.20), vec3(0.0, 0.16, 0.37), 0.04, 0.05));
    		lTail = min(lTail, 	sdCone( lTailPos, vec3(0.0, 0.12, 0.33), vec3(0.0, 0.36, 0.34), 0.04, 0.06));
    		lTail = min(lTail, 	sdCone( lTailPos, vec3(0.0, 0.34, 0.28), vec3(0.0, 0.36, 0.57), 0.05, 0.072));
    float lBoxCutter = sdBox( opMirrorX(lTailAnimRot * (pos - vec3(0.0, 0.0, 0.2))) - vec3(0.1, 0.4, 0.4), vec3(0.093,0.4,0.4) );
    lTail = max(lTail, -lBoxCutter);
    res = opU( res, vec2( lTail, 2.0) );
    //res = opU( res, vec2( lBoxCutter, 4.0) );
    float   lTailBrown = sdCone( lTailPos, vec3(0.0, 0.00, 0.00), vec3(0.0, 0.00, 0.15), 0.02, 0.02);
    lTailBrown = max(lTailBrown, -lBoxCutter);
    lTailBrown = max(lTailBrown, lTail);
    res = opU( res, vec2( lTailBrown, 6.0) );
    
    return res;
}

// http://iquilezles.org/www/articles/boxfunctions/boxfunctions.htm
vec2 iBox( in vec3 ro, in vec3 rd, in vec3 rad ) 
{
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
	return vec2( max( max( t1.x, t1.y ), t1.z ),
	             min( min( t2.x, t2.y ), t2.z ) );
}

const float maxHei = 0.8;

vec2 castRay( in vec3 ro, in vec3 rd )
{
    vec2 res = vec2(-1.0,-1.0);

    float tmin = 1.0;
    float tmax = 20.0;

    // raytrace floor plane
    float tp1 = (0.0-ro.y)/rd.y;
    if( tp1>0.0 )
    {
        tmax = min( tmax, tp1 );
        res = vec2( tp1, 1.0 );
    }
    //else return res;
    
    // raymarch primitives   
    vec2 tb = iBox( ro-vec3(0.8,0.8,-0.8), rd, vec3(4.0,4.0,4.0) );
    if( tb.x<tb.y && tb.y>0.0 && tb.x<tmax)
    {
        tmin = max(tb.x,tmin);
        tmax = min(tb.y,tmax);

        float t = tmin;
        for( int i=0; i<70; i++ )
        {
            if (t>=tmax) break;
            vec2 h = map( ro+rd*t );
            if( abs(h.x)<(0.0001*t) )
            { 
                res = vec2(t,h.y); 
                 break;
            }
            t += h.x;
        }
    }
    
    return res;
}


// http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
    // bounding volume
    float tp = (maxHei-ro.y)/rd.y; if( tp>0.0 ) tmax = min( tmax, tp );

    float res = 1.0;
    float t = mint;
    for( int i=ZERO; i<16; i++ )
    {
		float h = map( ro + rd*t ).x;
        float s = clamp(8.0*h/t,0.0,1.0);
        res = min( res, s*s*(3.0-2.0*s) );
        t += clamp( h, 0.02, 0.10 );
        if( res<0.005 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 pos )
{
#if 1
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
					  e.yyx*map( pos + e.yyx ).x + 
					  e.yxy*map( pos + e.yxy ).x + 
					  e.xxx*map( pos + e.xxx ).x );
#else
    // inspired by tdhooper and klems - a way to prevent the compiler from inlining map() 4 times
    vec3 n = vec3(0.0);
    for( int i=ZERO; i<4; i++ )
    {
        vec3 e = 0.5773*(2.0*vec3((((i+3)>>1)&1),((i>>1)&1),(i&1))-1.0);
        n += e*map(pos+0.0005*e).x;
    }
    return normalize(n);
#endif    
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=ZERO; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.y);
}

// http://iquilezles.org/www/articles/checkerfiltering/checkerfiltering.htm
float checkersGradBox( in vec2 p, in vec2 dpdx, in vec2 dpdy )
{
    // filter kernel
    vec2 w = abs(dpdx)+abs(dpdy) + 0.001;
    // analytical integral (box filter)
    vec2 i = 2.0*(abs(fract((p-0.5*w)*0.5)-0.5)-abs(fract((p+0.5*w)*0.5)-0.5))/w;
    // xor pattern
    return 0.5 - 0.5*i.x*i.y;                  
}

vec3 calcColor(float m, vec3 pos, vec3 nor, vec3 ro, vec3 rd, in vec3 rdx, in vec3 rdy)
{
	if( m<1.5 )
	{ 	// project pixel footprint into the plane
	    vec3 dpdx = ro.y*(rd/rd.y-rdx/rdx.y);
	    vec3 dpdy = ro.y*(rd/rd.y-rdy/rdy.y);
	    float f = checkersGradBox( 5.0*pos.xz, 5.0*dpdx.xz, 5.0*dpdy.xz );
	    return 0.15 + f*vec3(0.05);
	}
    else if(m < 2.5)
    { 	//Body
    	return vec3(0.980, 0.854, 0.168) * 0.4;
        
    }
    else if(m < 3.5)
    { 	//Mofletes
        return vec3(1.0, 0.0, 0.0) ;
    }
    else if(m < 4.5)
    { 	//Black
        return vec3(0.0, 0.0, 0.0);
    }
    else if(m < 5.5)
    { 	//White
        return vec3(1.0);
    }
    else if(m < 6.5)
    { 	//Brown
        return vec3(0.545, 0.270, 0.062);
    }
    else if(m < 7.5)
    { 	//Teeth
        return vec3(1.0);
    }
    
    return vec3(0.0, 0.0, 0.0);
}


vec3 render( in vec3 ro, in vec3 rd, in vec3 rdx, in vec3 rdy )
{ 
    vec3 col = vec3(0.7, 0.7, 0.9) - max(rd.y,0.0)*0.3;
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = (m<1.5) ? vec3(0.0,1.0,0.0) : calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        
        // material        
        col = calcColor(m, pos, nor, ro, rd, rdx, rdy);


        // lighting
        float occ = calcAO( pos, nor );
		vec3  lig = normalize( vec3(-0.5, 0.4, -0.6) );
        vec3  hal = normalize( lig-rd );
		float amb = sqrt(clamp( 0.5+0.5*nor.y, 0.0, 1.0 ));
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.2, 0.2, ref.y );
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
        
        dif *= calcSoftshadow( pos, lig, 0.02, 2.5 );
        dom *= calcSoftshadow( pos, ref, 0.02, 2.5 );

		float spe = pow( clamp( dot( nor, hal ), 0.0, 1.0 ),16.0)*
                    dif *
                    (0.04 + 0.96*pow( clamp(1.0+dot(hal,rd),0.0,1.0), 5.0 ));

		vec3 lin = vec3(0.0);
        if(m < 2.5 && m > 1.5)
        {   //Gallo: trick for skin color, make shadows more yellowish
            lin += mix(vec3(0.980, 0.654, 0.268) * 0.7, col,  dif) * 2.0;
        }
        
        lin += 1.80*dif*vec3(1.30,1.00,0.70);
        lin += 0.55*amb*vec3(0.40,0.60,1.15)*occ;
        if( m < 1.5 )
        {
        	lin += 0.85*dom*vec3(0.40,0.60,1.30)*occ;
        }
        lin += 0.55*bac*vec3(0.25,0.25,0.25)*occ;
        lin += 0.25*fre*vec3(1.00,1.00,1.00)*occ;
		col = col*lin;
		col += 0.50*spe*vec3(1.10,0.90,0.70);

        col = mix( col, vec3(0.7,0.7,0.9), 1.0-exp( -0.0001*t*t*t ) );
    }

	return vec3( clamp(col,0.0,1.0) );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 mo = iMouse.xy/iResolution.xy;
	float time = -20.0 + iTime*1.5;

    // camera	
    vec3 ro = vec3( 1.6*cos(0.1*time + 12.0*mo.x),  0.5 + 2.0*mo.y, 1.6*sin(0.1*time + 12.0*mo.x) );
    vec3 ta = vec3( 0.0, 0.4, 0.0 );
    // camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );

    vec3 tot = vec3(0.0);
#if AA>1
    for( int m=ZERO; m<AA; m++ )
    for( int n=ZERO; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
#else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
#endif

        // ray direction
        vec3 rd = ca * normalize( vec3(p,2.0) );

         // ray differentials
        vec2 px = (-iResolution.xy+2.0*(fragCoord.xy+vec2(1.0,0.0)))/iResolution.y;
        vec2 py = (-iResolution.xy+2.0*(fragCoord.xy+vec2(0.0,1.0)))/iResolution.y;
        vec3 rdx = ca * normalize( vec3(px,2.0) );
        vec3 rdy = ca * normalize( vec3(py,2.0) );
        
        // render	
        vec3 col = render( ro, rd, rdx, rdy );

		// gamma
        col = pow( col, vec3(0.4545) );

        tot += col;
#if AA>1
    }
    tot /= float(AA*AA);
#endif

    
    fragColor = vec4( tot, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}