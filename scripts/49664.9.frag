#ifdef GL_ES
//precision mediump float;
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// from https://www.shadertoy.com/view/MtdBzN
// fingerbob3d -> 3d cock-field(tm)
// added displacement + animated forskin.
// fixed shadow error & increased render distance.
// more cocks

//------------------------------------------------------------------------
// Camera
//------------------------------------------------------------------------
void doCamera( out vec3 camPos, out vec3 camTar, in float time)
{
    vec2 mouse2 = vec2(0.0,0.3);
    float an = 10.0*mouse2.x;
    mouse2.y *= 4.0;
	camPos = vec3(5.5*sin(an),0.0+mouse2.y*2.0,5.5*cos(an));
    camTar = vec3(0.0,0.0,0.0);
}


    
//------------------------------------------------------------------------
// Modelling 
//------------------------------------------------------------------------

float sdSphere( vec3 p, float s )
{
    return length(p)-s;
}

float sdPlane( vec3 p )
{
	return p.y;
}

float sdEllipsoid(const in  vec3 p, const in vec3 r) {
  return (length(p / r) - 1.0) * min(min(r.x, r.y), r.z);
}

float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float fakeEllipsoid( vec3 p, vec3 s ) {
	vec3 lp = p / s;
	vec3 ep = normalize(lp) * s;
	return length(p - ep) * sign(length(lp) - 1.0);
}

float cylinder( vec3 p, vec2 rh )
{
	vec2 cp = vec2( length(p.xz), p.y );
	return length( max(abs(cp) - rh, 0.0) );
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 opUnionRound(const in vec2 a, const in vec2 b, const in float r)
{
    vec2 res = vec2(smin(a.x,b.x,r),(a.x<b.x) ? a.y : b.y);
    return res;
}
float opS( float d1, float d2 )
{
    return max(-d2,d1);
}


vec3 rotateX(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(p.x, ca * p.y - sa * p.z, sa * p.y + ca * p.z);
}
vec3 rotateY(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
}
vec3 rotateZ(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(ca * p.x - sa * p.y, sa * p.x + ca * p.y, p.z);
}

// http://mercury.sexy/hg_sdf/
// Repeat space along one axis. Use like this to repeat along the x axis:
// <float cell = pMod1(p.x,5);> - using the return value is optional.
float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}


#define PI 3.1415926
#define DEG2RAD ((PI * 2.0) / 360.0)


// model

    // Return 2x2 rotation matrix
    // With vector swizzle/mask can use as a 3x3 xform
    // For y, you need to invert 
    // angle in radians
    // ========================================
    mat2 Rot2(float a ) {
        float c = cos( a );
        float s = sin( a );
        return mat2( c, -s, s, c );
    }


    // ========================================
    float sdCappedCylinder( vec3 p, vec2 h ) {
        vec2 d = abs(vec2(length(p.xz),p.y)) - h;
        return min(max(d.x,d.y),0.0) + length(max(d,0.0));
    }

    // iq's bend X
    // ========================================
    vec3 opCheapBend( vec3 p, float angle ) {
        mat2  m = Rot2( angle * p.y );
        vec3  q = vec3( m*p.yx, p.z );
        return q;
    }


vec3 CalcBend(vec3 bodyp,float c)
{
    float ang = sin(time+c*0.25) * 8. ;
    ang += sin(time*0.31) * 4.;
    //float flp = sign(ang);
    //ang=abs(ang);
    
    bodyp.y += 2.0;
	bodyp = opCheapBend(bodyp,(ang)*DEG2RAD);
    //bodyp.z -= 1.0;
    bodyp = rotateZ(bodyp,90.0*DEG2RAD);
    bodyp.y -= 2.0;
    return bodyp;
    
}

float smin( float a, float b )
{
    float k = 3.0;
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}


float displacement_t1(vec3 p)
{
    float height = 0.05;
    float zn = smoothstep(0.0,1.0,p.z);
    float yn = smoothstep(-0.1,0.5,p.y);
    float _x = clamp(p.x,-0.05,0.05);
    float xn = (_x + 0.05) * 10.0;			// normalize band
    xn = sin(xn*(PI));
    xn *= zn;
    xn *= yn;
    return -height*xn;
}


vec2 doModel( vec3 p )
{
    float g = 9.5;
	
    p.z += time;
    float d2 = sdPlane(p-vec3(0.0,-1.8,0.0));		// checkered floor distance...

	
    p.x += g*0.5;				// fucked because of mirroring
    float c = pMod1(p.z,3.);
    //p.x += 4.75*c;				// fucked because of mirroring
    pMod1(p.x,g);
	

    vec2 res = vec2(0.0,0.0);			// distance,material index
    //p.z += 0.8;
    
    vec3 bodyp = p;
    bodyp = CalcBend(bodyp,c);
    float dome = sdEllipsoid(bodyp-vec3(0.0,1.5,0.0),vec3(0.70,0.75,0.70));
    dome += displacement_t1(bodyp-vec3(0.0,1.4,0.0));
	float box5 = sdEllipsoid(bodyp-vec3(0.0,1.5,0.0),vec3(0.04,1.2,0.125));    
    
    float box1 = sdBox(bodyp-vec3(0.0,0.5,0.1),vec3(5.0,0.5,5.0));

    dome = opS(dome,box5);
    dome = opS(dome,box1);
    
    float _h = 1.5;
    
    float yo = (0.5+sin(time*3.63)*0.5)*0.125;
    
    float d1 = sdCappedCylinder(bodyp+vec3(0.0,yo,0.0),vec2(0.75,_h));
    float d6 = sdSphere(bodyp-vec3(0.7,-2.5,0.0),1.4);
    float d7 = sdSphere(bodyp-vec3(-0.7,-2.5,0.0),1.4);

    // nad displacement
    float k = dot(sin(p*70. - cos(p.yzx*0.1)), vec3(.333))*.006;
    d6+=k;	
    d7+=k;	
	
    
    d1 = smin(d1,d6,0.27);		// nut
    d1 = smin(d1,d7,0.27);		// nut

    res = vec2(d1,2.0);
    res = opUnionRound(res,vec2(d2,1.0),0.1);
    res = opUnionRound(res,vec2(dome,3.0),0.425);
    //res = opUnionRound(res,vec2(box5,4.0),0.03);
    return res;
}



mat2 rotate(float a)
{
    float sa = sin(a), ca = cos(a);
	return mat2(ca, -sa, sa, ca);
}

float circle(vec2 p, float radius)
{
	return length(p) - radius;
}


//------------------------------------------------------------------------
// Material 
//
// Defines the material (colors, shading, pattern, texturing) of the model
// at every point based on its position and normal.
//------------------------------------------------------------------------
// c = colour index (added by del for some materials)
// c.a == specular val fudged in...
vec4 doMaterial( in vec3 pos, in vec3 nor,float c )
{
    if (c<=1.0)
    {
        // checker floor

	    vec3 p = pos;
	    p.z += time;
	float f = mod( floor(0.25*p.z) + floor(0.25*pos.x), 2.0);
        f+=0.25;
        vec4 col = f*vec4(0.531,0.225,0.351,0.0);
	    return col;
    }
    else if (c<=2.0)
    {
        float b = 1.0;
	return vec4(0.5*b,0.09*b,0.15*b,0.7);
    }
    else if (c<=3.0)
    {
        float b = 0.45;
	return vec4(0.5*b,0.09*b,0.15*b,0.7);
    }
    //else if (c<=4.0)
    //{
    //   float b = 0.4;
	//return vec4(0.5*b,0.09*b,0.15*b,0.1);
    //}

	return vec4(1.0, 1.0, 1.0,2.0);
}

//------------------------------------------------------------------------
// Lighting
//------------------------------------------------------------------------
float calcSoftshadow( in vec3 ro, in vec3 rd );

vec3 doLighting( in vec3 pos, in vec3 nor, in vec3 rd, in float dis, in vec4 mat )
{
    
    vec3 lin = vec3(0.0);

    // key light
    //-----------------------------
    vec3  lig = normalize(vec3(0.7,0.875,0.89));		// dir
    float dif = max(dot(nor,lig),0.0);
    float sha = 0.0;
    if( dif>0.01 )
        sha=calcSoftshadow( pos+0.01*nor, lig );
    lin += dif*vec3(4.00,4.00,4.00)*sha;

	float spec = pow(dif, 160.0) *mat.a;
    
    
    // ambient light
    //-----------------------------
    lin += vec3(0.50,0.50,0.50);

    
    // surface-light interacion
    //-----------------------------
    vec3 col = mat.xyz*lin;
    col+=spec;

    
    // fog    
    //-----------------------------
	col *= exp(-0.002*dis*dis);

    return col;
}

vec2 calcIntersection( in vec3 ro, in vec3 rd )
{
	const float maxd = 70.0;           // max trace distance
	const float precis = 0.001;        // precission of the intersection
    float h = precis*2.0;
    float t = 0.0;
	//float res = -1.0;
    vec2 res = vec2(-1.0,0.0);
    float c = 0.0;
    
    for( int i=0; i<120; i++ )          // max number of raymarching iterations is 90
    {
        if( h<precis||t>maxd ) break;
        vec2 res2 = doModel( ro+rd*t );
	    h = res2.x;
        c = res2.y;
        
        t += h*0.75;		// hack * for extreme bend
    }

    if( t<maxd )
    {
        res.x = t;
        res.y = c;
    }
    return res;
}

vec3 calcNormal( in vec3 pos )
{
    const float eps = 0.002;             // precision of the normal computation

    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);

	return normalize( v1*doModel( pos + v1*eps ).x + 
					  v2*doModel( pos + v2*eps ).x + 
					  v3*doModel( pos + v3*eps ).x + 
					  v4*doModel( pos + v4*eps ).x );
}

float calcSoftshadow( in vec3 ro, in vec3 rd )
{
    float res = 1.0;
    float t = 0.0005;                 // selfintersection avoidance distance
	float h = 1.0;
    for( int i=0; i<60; i++ )         // 40 is the max numnber of raymarching steps
    {
        h = doModel(ro + rd*t).x;
        res = min( res, 64.0*h/t );   // 64 is the hardness of the shadows
		t += clamp( h, 0.02, 2.0 );   // limit the max and min stepping distances
    }
    return clamp(res,0.0,1.0);
}

mat3 calcLookAtMatrix( in vec3 ro, in vec3 ta, in float roll )
{
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(roll),cos(roll),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    return mat3( uu, vv, ww );
}

void main()
{
    vec2 st = gl_FragCoord.xy/resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
    
    // camera movement
    vec3 ro, ta;
    doCamera( ro, ta, time);

    // camera matrix
    mat3 camMat = calcLookAtMatrix( ro, ta, 0.0 );  // 0.0 is the camera roll
    
	// create view ray
	vec3 rd = normalize( camMat * vec3(p.xy,2.0) ); // 2.0 is the lens length

    //-----------------------------------------------------
	// render
    //-----------------------------------------------------
  	vec3 col = mix( vec3(0.2, 0.2, 0.5), vec3(0.5, 0.7, 1.0), gl_FragCoord.y / resolution.y );

	// raymarch
    vec2 res = calcIntersection( ro, rd ); 
    float t = res.x;
    if( t>-0.5 )
    {
        // geometry
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);

        // materials
        vec4 mat = doMaterial( pos, nor, res.y );

        col = doLighting( pos, nor, rd, t, mat );
	}

	//-----------------------------------------------------
	// postprocessing
    //-----------------------------------------------------
    // gamma
	col = pow( clamp(col,0.0,1.0), vec3(0.4545) );
	   
    gl_FragColor = vec4( col, 1.0 );
}