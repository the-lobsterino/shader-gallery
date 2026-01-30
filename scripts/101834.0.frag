/*
 * Original shader from: https://www.shadertoy.com/view/NlGfzV
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//==========================================================================================
// hashes (low quality, do NOT use in production)
//==========================================================================================

#define hash21(p)  fract(sin(dot(p, vec2(11.9898, 78.233))) * 43758.5453) 

float hash1( vec2 p )
{
    p  = 50.0*fract( p*0.3183099 );
    return fract( p.x*p.y*(p.x+p.y) );
}

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

vec2 hash2( vec2 p ) 
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    float n = 111.0*p.x + 113.0*p.y;
    return fract(n*fract(k*n));
}
float blueNoise(vec2 U) {                           // 5-tap version 
    float v =  hash21( U + vec2(-1, 0) )
             + hash21( U + vec2( 1, 0) )
             + hash21( U + vec2( 0, 1) )
             + hash21( U + vec2( 0,-1) ); 
    return  hash21(U) - v/4.  + .5;
}
//==========================================================================================
// noises
//==========================================================================================

// value noise, and its analytical derivatives
vec4 noised( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    #if 1
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);
    #else
    vec3 u = w*w*(3.0-2.0*w);
    vec3 du = 6.0*w*(1.0-w);
    #endif

    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
	float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return vec4( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z), 
                      2.0* du * vec3( k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                                      k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                                      k3 + k6*u.x + k5*u.y + k7*u.x*u.y ) );
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    #if 1
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    #else
    vec3 u = w*w*(3.0-2.0*w);
    #endif
    


    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
	float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}

vec3 noised( in vec2 x )
{
    vec2 p = floor(x);
    vec2 w = fract(x);
    #if 1
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec2 du = 30.0*w*w*(w*(w-2.0)+1.0);
    #else
    vec2 u = w*w*(3.0-2.0*w);
    vec2 du = 6.0*w*(1.0-w);
    #endif
    
    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));

    float k0 = a;
    float k1 = b - a;
    float k2 = c - a;
    float k4 = a - b - c + d;

    return vec3( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k4*u.x*u.y), 
                 2.0*du * vec2( k1 + k4*u.y,
                            k2 + k4*u.x ) );
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 w = fract(x);
    #if 1
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    #else
    vec2 u = w*w*(3.0-2.0*w);
    #endif

    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));
    
    return -1.0+2.0*(a + (b-a)*u.x + (c-a)*u.y + (a - b - c + d)*u.x*u.y);
}

//==========================================================================================
// fbm constructions
//==========================================================================================

const mat3 m3  = mat3( 0.00,  0.80,  0.60,
                      -0.80,  0.36, -0.48,
                      -0.60, -0.48,  0.64 );
const mat3 m3i = mat3( 0.00, -0.80, -0.60,
                       0.80,  0.36, -0.48,
                       0.60, -0.48,  0.64 );
const mat2 m2 = mat2(  0.80,  0.60,
                      -0.60,  0.80 );
const mat2 m2i = mat2( 0.80, -0.60,
                       0.60,  0.80 );

//------------------------------------------------------------------------------------------




#define AA 1   // make this 2 or 3 for antialiasing
#define ZERO 0

float fbm_4( in vec2 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    for( int i=ZERO; i<9; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        float amp = 0.2 * step(4., float(i));
        x = f * m2 * x * (1.-amp);
        
    }
	return a;
}

float fbm_4( in vec3 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    for( int i=ZERO; i<4; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        float amp = 0.2 * step(4., float(i));
        x = f * m3 * x * (1.-amp);
    }
	return a;
}

vec4 fbmd_7( in vec3 x )
{
    float f = 1.92;
    float s = 0.5;
    float a = 0.0;
    float b = 0.5;
    vec3  d = vec3(0.0);
    mat3  m = mat3(1.0,0.0,0.0,
                   0.0,1.0,0.0,
                   0.0,0.0,1.0);
    for( int i=ZERO; i<7; i++ )
    {
        vec4 n = noised(x);
        a += b*n.x;          // accumulate values		
        d += b*m*n.yzw;      // accumulate derivatives
        b *= s;
        x = f*m3*x;
        m = f*m3i*m;
    }
	return vec4( a, d );
}

vec4 fbmd_8( in vec3 x )
{
    float f = 2.0;
    float s = 0.65;
    float a = 0.0;
    float b = 0.5;
    vec3  d = vec3(0.0);
    mat3  m = mat3(1.0,0.0,0.0,
                   0.0,1.0,0.0,
                   0.0,0.0,1.0);
    for( int i=ZERO; i<8; i++ )
    {
        vec4 n = noised(x);
        a += b*n.x;          // accumulate values		
        if( i<4 )
        d += b*m*n.yzw;      // accumulate derivatives
        b *= s;
        x = f*m3*x;
        m = f*m3i*m;
    }
	return vec4( a, d );
}

float fbm_9( in vec2 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    for( int i=ZERO; i<9; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m2*x;
    }
    
	return a;
}

vec3 fbmd_9( in vec2 x )
{
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    vec2  d = vec2(0.0);
    mat2  m = mat2(1.0,0.0,0.0,1.0);
    for( int i=ZERO; i<9; i++ )
    {
        vec3 n = noised(x);
        a += b*n.x;          // accumulate values		
        d += b*m*n.yz;       // accumulate derivatives
        b *= s;
        x = f*m2*x;
        m = f*m2i*m;
    }

	return vec3( a, d );
}

vec2 map( in vec3 pos )
{
    vec2 res = vec2( 1e10, 0.0 );

    if ((res.x = length(pos - vec3(31.0, 14.0, 40.)) -1.5) < .0)
        res.y = 2.0;
    
    float s = smoothstep(1., 105.3, pos.z);
    float floorDist = pos.y  + .5 + fbm_9(pos.xz / 2.3) / 4.0
    - s * (fbm_4(pos.xz / 30.0)) *60.;
    if (floorDist  < res.x) {
        res.x = floorDist;
        res.y = 1.0;
    }
    
    return res;
    float r = 1.;
    pos.x;// += pos.y * iTime / 50.;
    vec2 id = floor(pos.xz * r);
    float h = hash2(id.xy).x * 10. - iTime * 20. * (.5 + abs(hash2(id.xy).y)) / 2.;
    vec3 pmod = vec3(mod(pos.xz, r) - vec2(r / 2.0), pos.y);
    h = mod(h, 100.);
    float snowflake = length(pmod*5. - vec3(0., 0., h))-0.2;
    if (snowflake < res.x){
        res.x = snowflake;
        res.y = 1.0;
    }
    return res;
}

const float maxHei = 0.8;

vec2 castRay( in vec3 ro, in vec3 rd )
{
    vec2 res = vec2(-1.0,-1.0);

    float tmin = 1.0;
    float tmax = 90.0;

    // raymarch primitives   
    {
    
        float t = tmin;
        for( int i=ZERO; i<400; i++ )
        {
            if (t>=tmax) break;
            vec2 h = map( ro+rd*t );
            if( abs(h.x)<(0.01*t) )
            { 
                res = vec2(t,h.y); 
                 break;
            }
            t += h.x * 0.3;
        }
    }
    
    return res;
}


// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.5;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
					  e.yyx*map( pos + e.yyx ).x + 
					  e.yxy*map( pos + e.yxy ).x + 
					  e.xxx*map( pos + e.xxx ).x );
 
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

vec3 kMoonCol = vec3(196.0 / 255., 212.0 / 255., 304.0 / 255.);
vec3 kDirtCol = vec3(18.0 / 255., 12.0 / 255., 35.0 / 255.);
vec3 ndotl(vec3 light, vec3 nor, vec3 pos, vec3 ro) {
 return  kMoonCol* 
        max(.0, dot(nor-normalize(pos - ro),
        light));
}

vec3 light(vec3 pos, vec3 nor, vec3 ro, vec3 rd) {
float s = pow(abs(blueNoise( pos.xz / 1.) - 0.2), 4.0);
     float sparkle = min(1.0, s); 
    vec3 ref = reflect(rd, nor);
    vec3 l1_dir = normalize(vec3(-1.0, 1.0, 1.0));
    vec3 ret = vec3(.0);
    ret += vec3(
        max(.0, abs(pow(dot(ref, 
        l1_dir), 5.0) ))) * sparkle;
    vec3 l1 = l1_dir;
    vec3 l2 = normalize(vec3(10.0, 1.0, -1.0));
    ret += ndotl(l1, nor, pos, ro) + ndotl(l2, nor, pos, ro);
    return ret;
}


vec3 applyFog( in vec3  rgb,       // original color of the pixel
               in float distance ) // camera to point distance
{
    float fogAmount = 1.0 - exp( -distance*0.5 );
    vec3  fogColor  = vec3(0.5,0.6,0.7) / 10.;
    return mix( rgb, fogColor, fogAmount );
}
vec3 render( in vec3 ro, in vec3 rd )
{
    vec3 col = vec3(.0);
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    vec3 pos = ro + rd * t;
    vec3 nor = calcNormal(pos);
    if (res.y >= 1.0 && res.x > 0.) {
         float s = max(0., smoothstep(-1.0, 5.0, pos.y));
         col = mix(vec3(1.0), kDirtCol, s * 1. * noise(pos.xz / 1.0));
        
    	col = col * 0.5 + light(pos, nor, ro, rd) * col;
        col = applyFog(col, res.x / 10.);
        } else if (res.x > 0.) {
            
            float u = 0.5 + atan(rd.y, rd.z) / (2. * 3.14);
            float v = 0.5 - asin(rd.x  ) / 3.14;
            vec2 uv = vec2(v * 1., u * 2.);
            col = 1.6*pow(.2 + .8*vec3(.5*(1.0 + fbm_4(uv * 310.))), vec3(3.5));
        }
    else {
        col = vec3(4.0 * pow(blueNoise(rd.xy * 2.0) - 0.4, 21.0 ));
        res.x =10.;
    }
    
   	return vec3(col);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float mapRectangle(vec2 p, vec2 dim) {
    return smoothstep(0.01112, -0.01112, max( abs(p.x) - dim.x, abs(p.y) - dim.y));
}
float mapSnowFlake(vec2 p, float size) {

    vec2 s = vec2(1., 20.0) * size;
    float tot;
    
    tot += mapRectangle(p, s);
    tot += mapRectangle(p * rotate2d(3.14 / 3.), s);
    tot += mapRectangle(p * rotate2d(-3.14 / 3.), s);
    
    vec2 s2 = s / 4.;
    s2.x = 0.;
    for (int i = 0; i < 6; ++i) {
       // tot += mapRectangle( ( p - vec2(0.01, 0.041) * rotate2d(float(i) * 3.14 / 2. + 3.14/2.) )  , s2 );
    //    tot += mapRectangle( ( p * rotate2d(-3.14/3.) - vec2(-0.01, 0.041))  , s2 );
    }
    return tot;
}

vec3 snowFlakes(vec2 base_uv) {
    
    vec3 ret = vec3(0.);
    
    for (int i = 0; i < 4; ++i) {
    
    vec2 uv = base_uv;
       uv.x += iTime / 10.;// * hash1(uv.x);
 
//    vec2 uv = base_uv * float(i + 1) * 2.;
    vec2 r = vec2(0.2, 2.0);
    vec2 id = floor(uv / r);
    
    vec2 s = hash2(id.xx);
    float speed = iTime * ( 1. + s.x) / 2.;
    uv.y += speed;
    vec2 m_uv = mod(uv, r) - r / 2.;
    float size = 0.0021;
    ret += vec3( mapSnowFlake(m_uv, size) );
    base_uv *= 2.;
    }
    return ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 mo = vec2(0);//iMouse.xy/iResolution.xy;
	float time = .0; //iTime;

    // camera	
    vec3 ro = vec3(.0, 1.0, -5.0);//vec3( 4.6*cos(0.1*time + 6.0*mo.x), 1.0 + 2.0*mo.y, 0.5 + 4.6*sin(0.1*time + 6.0*mo.x) );
    vec3 ta = vec3( -0.0, 1.4, 0.5 );
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
        vec3 rd = normalize( vec3(p.xy,2.0) * ca );

        // render	
        vec3 col = render( ro, rd );
        col = max(vec3(.0), col);
        col += snowFlakes(p);
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
    mainImage(gl_FragColor, gl_FragCoord.xy);
}