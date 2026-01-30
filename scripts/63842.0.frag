/*
 * Original shader from: https://www.shadertoy.com/view/lljBzz
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// dizzy the egg - Del 27/12/17


//------------------------------------------------------------------------
// Camera
//------------------------------------------------------------------------
void doCamera( out vec3 camPos, out vec3 camTar, in float time, in vec2 mouse )
{
    vec2 mouse2 = vec2(0.0);
    if (iMouse.z > 0.5)
    {
        mouse2 = mouse;
        mouse2.y -= 0.1;
    }
    
//    float an = 0.3*iTime + 10.0*mouse.x;
    float an = 10.0*mouse2.x;
    mouse2.y *= 4.0;
	camPos = vec3(5.5*sin(an),0.0+mouse2.y*2.0,5.5*cos(an));
    camTar = vec3(0.0,0.0,0.0);
}


    
//------------------------------------------------------------------------
// Modelling 
//------------------------------------------------------------------------

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

vec2 doModel( vec3 p )
{
    float c = pMod1(p.z,7.5);
//    p.x += 2.75*c;				// fucked because of mirroring
    pMod1(p.x,5.5);

    vec2 res = vec2(0.0,0.0);			// distance,material index
    //p.z += 0.8;
    
    vec3 bodyp = p;
    vec3 legp = p;
    float bodyanim = 0.12+(1.0+sin(iTime*8.5))*0.06;
    bodyp.y += bodyanim;

    float d1 = sdEllipsoid(bodyp,vec3(1.3,1.7,1.3));	// white egg shape...
    float d2 = sdPlane(p-vec3(0.0,-2.2,0.0));		// checkered floor distance...
    
    float armanim = (1.0+sin(iTime*7.5))*0.5;
    armanim = smoothstep(0.0,1.0,armanim);
    
	legp = vec3( abs(legp.x), legp.y, legp.z );
    legp.y += 1.6;
    legp.x -= 0.5;
    float d5 = cylinder(legp,vec2(0.18,0.6));
    legp.y += 0.65;
    legp.z -= 0.3;
   	float d6 = sdEllipsoid(legp,vec3(0.35,0.35,0.54));
    
	d6 = opS(d6,d2);		// subtract floor from boots!
    d5 = smin(d5,d6,0.1);
    
    // p2 = mirrored position...
	vec3 p2 = vec3( abs(bodyp.x), bodyp.y, bodyp.z );
    // box arm (placeholder)
    float zrot = mix(-10.0,10.0,armanim);			// -10 to +10 degrees rot for arms
    vec3 p3 = rotateZ(p2,zrot*DEG2RAD)-vec3(1.2,0.0,0.0);
    p3.x -= 0.10;
    vec3 p4 = rotateZ(p3,90.0*DEG2RAD);
    float d3 = cylinder(p4,vec2(0.3,0.05));
    p3.x -= 0.44;
	float d4 = sdEllipsoid(p3,vec3(0.44,0.38,0.38));
    p3.x += 0.1;
    p3.y -= 0.29;
	float d8 = sdEllipsoid(p3,vec3(0.1,0.2,0.1));	// thumb
    
    res = vec2(d1,2.0);
    res = opUnionRound(res,vec2(d2,1.0),0.001);
    res = opUnionRound(res,vec2(d3,3.0),0.01);		// + glove
    res = opUnionRound(res,vec2(d4,3.0),0.2);		// + glove
    res = opUnionRound(res,vec2(d8,3.0),0.15);		// + glove
    res = opUnionRound(res,vec2(d5,3.0),0.02);		// + feet
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


//======================
// Line functions
//======================

float distanceToSegment( vec2 a, vec2 b, vec2 p )
{
	vec2 pa = p - a, ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h );
}

// bend(Y)
vec2 opBendTest( vec2 p, float angle )
{
    mat2 m = rotate( angle * p.x );
    return   m*p.xy;
}

// NAND, our only primitive
float csg_nand (float a, float b) {
    return -max(a,b);
}

// aka A AND NOT B, NOT(NAND(A,NOT(B)))
float csg_sub (float a, float b) {
    float o = csg_nand(a, csg_nand(b, b));
    return csg_nand(o, o);
}
// NAND(NOT(A),NOT(B))
float csg_or (float a, float b) {
    return csg_nand(
        csg_nand(a,a),
        csg_nand(b,b));
}

float Eye(vec2 p,vec2 offset)
{
    float rad = 0.06;
    float rad2 = 0.057;
    float d = circle(p,rad);
    float d2 = circle(p,rad2);
    float d3 = circle(p+offset,0.015);	// pupil
    
    // blink
    float blink = step(sin(iTime * 2.8 + cos(iTime * 2.0) * 2.0), 0.95);
	d3 = max(d3,1.0-blink);
    
    d = csg_sub(d,d2);
    d = csg_or(d,d3);
    return d;
    
}


vec4 FaceTest(vec2 p)
{
    vec4 color = vec4(0.0,0.0,0.0,1.0);
    vec2 p1 = vec2(-0.15,-0.03);
    vec2 p2 = vec2(0.15,-0.03);
    float dist = 100.0;

    vec2 offset1 = vec2(0.015,0.02);
    vec2 offset2 = vec2(-0.015,0.02);
    float d2 = Eye(p+vec2(-0.08,-0.2),offset1);
    float d3 = Eye(p+vec2(0.08,-0.2),offset2);

    p = opBendTest(p,DEG2RAD*174.0);	////sin(iTime));
    float d1 = distanceToSegment(p1,p2,p);

    dist = min(dist,d2);
    dist = min(dist,d3);
    dist = smoothstep(0.0,0.01, dist);		// alias,thickness
    color.xyz += vec3(1.0-dist);

    // mouth
    dist = smoothstep(0.004,0.015, d1);		// alias,thickness
    color.xyz += vec3(1.0-dist);
	color = (1.0-color)*0.3;
    color.w = 0.5;
    return color;
    
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
        float f = mod( floor(2.0*pos.z) + floor(2.0*pos.x), 2.0);
        vec4 col = 0.1 + 0.3*f*vec4(0.2,1.0,0.2,0.0);
	    return col;
    }
    else if (c<=2.0)
    {
        vec3 bodyp = pos;
        float c = pMod1(bodyp.z,7.5);
        //bodyp.x += 2.75*c;	// fucked because of mirroring
        pMod1(bodyp.x,5.5);

        float bodyanim = 0.12+(1.0+sin(iTime*8.5))*0.06;
        bodyp.y += bodyanim;
        
        vec3 q = normalize( bodyp );
        vec2 uv = vec2( atan(q.z,q.x), acos(-q.y ) )*0.25;
        
        uv.y -= 0.3;
        uv.x -= 0.38;
        return FaceTest(uv);
    }
    else if (c<=3.0)
    {
		return vec4(0.3, 0.0, 0.0,3.0);	// feet/gloves
    }

	return vec4(0.0, 0.0, 0.0,2.0);	// eyes
    
//    return vec3(0.2,0.07,0.01);
    
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
	const float maxd = 50.0;           // max trace distance
	const float precis = 0.001;        // precission of the intersection
    float h = precis*2.0;
    float t = 0.0;
	//float res = -1.0;
    vec2 res = vec2(-1.0,0.0);
    float c = 0.0;
    
    for( int i=0; i<180; i++ )          // max number of raymarching iterations is 90
    {
        if( h<precis||t>maxd ) break;
        vec2 res2 = doModel( ro+rd*t );
	    h = res2.x;
        c = res2.y;
        
        t += h;
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
    for( int i=0; i<40; i++ )         // 40 is the max numnber of raymarching steps
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

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;

    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
    
    // camera movement
    vec3 ro, ta;
    doCamera( ro, ta, iTime, m );

    // camera matrix
    mat3 camMat = calcLookAtMatrix( ro, ta, 0.0 );  // 0.0 is the camera roll
    
	// create view ray
	vec3 rd = normalize( camMat * vec3(p.xy,2.0) ); // 2.0 is the lens length

    //-----------------------------------------------------
	// render
    //-----------------------------------------------------
  	vec3 col = mix( vec3(0.2, 0.2, 0.5), vec3(0.5, 0.7, 1.0), fragCoord.y / iResolution.y );

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
	   
    fragColor = vec4( col, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 1., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}