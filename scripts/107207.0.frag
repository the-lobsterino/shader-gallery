/*
 * Original shader from: https://www.shadertoy.com/view/tlVXRz
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
// Math
const float PI = 3.1415926535897932384626433832795;
const float PI_2 = 1.57079632679489661923;
const float PI_4 = 0.785398163397448309616;

mat2 rot(float phi)
{
    float c = cos(phi);
    float s = sin(phi);

    return mat2(
        vec2(c, -s),
        vec2(s, c));
}

// SDF
float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0));
}

float sdCappedCylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}


float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

// SDF Operators
float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 26. );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h); }

// Noise
vec2 random(vec2 st)
{
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noiseo(vec2 st)
{
    vec2 f = fract(st);
    vec2 i = floor(st);
    
    vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
    
    float r = mix( mix( dot( random(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    return r * .5 + .5;
}

float fbm(vec2 st)
{
    float value = 0.;
    float amplitude = .5;
    float frequency = 0.;
    
    for (int i = 0; i < 8; i++)
    {
        value += amplitude * noiseo(st);
        st *= 2.;
        amplitude *= .5;
    }
    
    return value;
}

// Noise and FBM (as seen on iq tutorials)
//==========================================================================================
// hashes
//==========================================================================================

float hash1( vec2 p )
{
    p  = 50.0*fract( p*0.3183099 );
    return fract( p.x*p.y*(p.x+p.y) );
}

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

vec2 hash2( float n ) { return fract(sin(vec2(n,n+1.0))*vec2(43758.5453123,22578.1459123)); }


vec2 hash2( vec2 p ) 
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    p = p*k + k.yx;
    return fract( 16.0 * k*fract( p.x*p.y*(p.x+p.y)) );
}

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//==========================================================================================
// noises
//==========================================================================================

// value noise, and its analytical derivatives
vec4 noised( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

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
    
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    
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
    
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec2 du = 30.0*w*w*(w*(w-2.0)+1.0);
    
    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));

    float k0 = a;
    float k1 = b - a;
    float k2 = c - a;
    float k4 = a - b - c + d;

    return vec3( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k4*u.x*u.y), 
                      2.0* du * vec2( k1 + k4*u.y,
                                      k2 + k4*u.x ) );
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 w = fract(x);
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    
#if 0
    p *= 0.3183099;
    float kx0 = 50.0*fract( p.x );
    float kx1 = 50.0*fract( p.x+0.3183099 );
    float ky0 = 50.0*fract( p.y );
    float ky1 = 50.0*fract( p.y+0.3183099 );

    float a = fract( kx0*ky0*(kx0+ky0) );
    float b = fract( kx1*ky0*(kx1+ky0) );
    float c = fract( kx0*ky1*(kx0+ky1) );
    float d = fract( kx1*ky1*(kx1+ky1) );
#else
    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));
#endif
    
    return -1.0+2.0*( a + (b-a)*u.x + (c-a)*u.y + (a - b - c + d)*u.x*u.y );
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

float fbm_2( in vec3 x )
{
    float f = 2.0;
    float s = 0.5;
    float a = 0.0;
    float b = 0.5;
    for( int i=0; i<2; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m3*x;
    }
	return a;
}

float fbm_4( in vec3 x )
{
    float f = 2.0;
    float s = 0.5;
    float a = 0.0;
    float b = 0.5;
    for( int i=0; i<4; i++ )
    {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m3*x;
    }
	return a;
}

// Comment this line for a faster compiling time, but no noisey textures on surfaces
#define NOISE

#define AA 1

#define ZERO (min(iFrame,0))
#define MAX_STEPS			300
#define MAX_DIST			9.0
#define SURFACE_DIST		0.001

const vec3 bin_disp = vec3(0.0, -0.72, 1.0);

float sin_func(float x, int t)
{
    float vi = sin(x);
    float v = vi;
    for (int i = 2; i < 10; i++)
    {
        if (i > t) break;
        v += sin(vi * float(i)) / 10.0;
    }
    
    return v;
}

float cos_func(float x, int t)
{
    float vi = cos(x);
    float v = vi;
    for (int i = 2; i < 10; i++)
    {
        if (i > t) break;
        v += cos(vi * float(i)) / 10.0;
    }
    
    return v;
}

vec2 map(vec3 p, bool complete)
{
    vec2 v = vec2(MAX_DIST, 0.0);
    
    // floor
    float f = dot(p + vec3(0.0, 0.3, 0.0), vec3(0.0, 1.0, 0.0)) + 0.0;
    f = min(f, sdBox(p + vec3(0.0, 0.32, 0.0), vec3(10.2, 0.3, 2.7)) - .025);

    #ifdef NOISE
    if (p.y < 0.1 && complete) f -= abs(fbm_2(p * 40.0)) * .01 + (p.z > -2.73 ? abs(noise(p * 10.0)) * .03 : 0.0);
    #endif
    if (f < v.x) v = vec2(f, 1.0);
    
    // trash bin
    vec3 bin_pos = p + bin_disp;
    if (sdBox(bin_pos, vec3(1.3, 1.5, 0.6)) < v.x)
    {
        float dl = smoothstep(0.3, 1.0, ((p.y + 4.1) * 0.2));
        float t = sdBox(bin_pos, vec3(1.0 * dl, 0.5, 0.5 * dl));
        t = min(t, sdBox(bin_pos + vec3(0.0, -0.8 - p.z * 0.3, 0.0), vec3(1.0, 0.2, 0.5))) - .05;
        t = opSmoothUnion(t, sdBox(bin_pos + vec3(0.0, -0.95 - p.z * 0.3, 0.0), vec3(1.0 * dl, 0.05, 0.5 * dl)) - .07, 0.05);
        t = opSmoothSubtraction(sdBox(bin_pos + vec3(0.0, -0.3, 0.0), vec3(0.95 * dl, 0.7, 0.45 * dl)), t, 0.19);
        t = opSmoothUnion(t, sdBox(abs(bin_pos + vec3(0.0, -0.015, 0.51)) + vec3(-0.4, 0.0, 0.0), vec3(0.005 * dl, 0.32, 0.002 * dl)), 0.035);
        if (t < v.x) v = vec2(t, 3.0);
    
        // bin wheels
        vec3 wheel_pos = abs(bin_pos + vec3(0.0, 0.62, 0.0));
        wheel_pos.xy *= rot(PI_2);
        wheel_pos +=  vec3(-0.0, -0.7, -0.4);

        float bw = sdCappedCylinder(wheel_pos, 0.081, 0.016) - .02;
        if (bw < v.x) v = vec2(bw, 4.0);

        // bin lid
        float x = iTime * 1.82;
        float sx = sin(x * PI_4);
        float s = sx + sin(2.0 * sx) / 2.0 + sin(3.0 * sx) / 3.0 + sin(4.0 * sx) / 10.0 + sin(5.0 * sx) / 10.0;
        vec3 lid_pos = bin_pos - vec3(0.0, 0.88, 0.0) - vec3(0.0, 0.0, .5);
        lid_pos.yz *= rot(PI_4 * 0.4 + ((PI_4) * -smoothstep(2.0, 0.1, exp(s)) * 1.0 - 0.0));
        lid_pos += vec3(0.0, 0.0, .5);

        float lid = sdBox(lid_pos, vec3(0.99, 0.015, 0.5)) - .03;
        lid = opSmoothUnion(lid, 
                 sdBox(
                     abs(
                         abs(
                             abs(lid_pos - vec3(0.0, 0.04, 0.0)) 
                             - vec3(0.5, 0.0, 0.0))
                         - vec3(0.2, 0.0, 0.0))
                     - vec3(0.1, 0.0, 0.0), vec3(0.005, 0.018, 0.4)) - .01, 
                     0.1);

        if (lid < v.x) v = vec2(lid, 3.0);

        // character
        float s2 = sin_func(x * PI_2, 6);
        float s3 = sin_func(x * PI + PI_2, 2);
        vec3 e_pos = bin_pos - vec3(-0.1 + s2 * 0.35, max(0.1 - s * 0.42 - s3 * 0.06, 0.1), 0.0);
        
        if (sdSphere(e_pos, 0.2) < v.x && complete)
        {
            float c2 = cos_func(x * PI_2, 6);

            float eh = (cos_func(x * PI_2 + PI_4, 7) * 0.5 + 0.5) * 0.03;
        	float eh2 = (sin_func(x * PI_2, 8) * 0.5 + 0.5) * 0.03;
            
            float eye = sdSphere(abs(e_pos - vec3(0.06 + s2 * .02, max(0.0, -0.25 - s * 0.16), -0.02)) - vec3(0.074, 0.0, 0.0), .038);
            if (eye < v.x) v = vec2(eye, 6.0);

            float eyes = sdEllipsoid(e_pos - vec3(0.0, eh, 0.0), vec3(.075, .095 + eh, .07));
            eyes = min(eyes, sdEllipsoid(e_pos - vec3(0.15, eh2, 0.0), vec3(.075, .095 + eh2, .07)));
            eyes = opSmoothSubtraction(eye - .002, eyes, .04);
            if (eyes < v.x) v = vec2(eyes, 5.0);
        }
    }
    
    // wall
    if (sdBox(p - vec3(0.0, 1.5, 0.2), vec3(20.0, 1.5, 0.5)) < v.x)
    {
        float w = sdBox(p - vec3(0.0, 0.0, 0.2), vec3(20.0, 5.0, 0.2));
        if (w < v.x) v = vec2(w, 2.0);

       	if (complete)
        {
            // wall bricks
            vec3 c = vec3(0.45, 0.4, 0.0);
            vec3 bp = p - vec3(0.0, 0.13, 0.01);
            vec3 bp1 = mod(bp + 0.5 * c, c) - 0.5 * c;
            bp -= vec3(0.225, 0.2, 0.0);
            vec3 bp2 = mod(bp + 0.5 * c, c) - 0.5 * c;

            float br = sdBox(bp1, vec3(0.188, 0.06, 0.03));
            br = min(br, sdBox(bp2, vec3(0.188, 0.06, 0.03))) - .01;
            
            #ifdef NOISE
            float abs_noise_1 = abs(fbm_4(p * 30.0));
            float abs_noise_2 = abs(noise(p * 5.0));
            
            br -= abs_noise_2 * 0.02 + abs_noise_1 * .01;
            #endif
            
            if (br < v.x) v = vec2(br, 7.0);
        }
        
    }

    
    return v;
}

vec3 calcNormal(vec3 p)
{
    vec2 e = vec2(0.0001, 0.0);
    return normalize(vec3(
        map(p + e.xyy, true).x - map(p - e.xyy, true).x,
        map(p + e.yxy, true).x - map(p - e.yxy, true).x,
        map(p + e.yyx, true).x - map(p - e.yyx, true).x)
    );
}

vec2 rayMarch(vec3 ro, vec3 rd)
{
    float t = 0.0;
    vec3 p;
    vec2 obj;
    for (int i = 0; i < MAX_STEPS; i++)
    {
        p = ro + t * rd;
       	
        obj = map(p, true);
        
        if (obj.x < SURFACE_DIST || t > MAX_DIST) break;
        
        t += obj.x;
    }
    
    obj.x = t;
    return obj;
}

// Lighting
float ambientOcclusion(vec3 p, vec3 n)
{
	float stepSize = 0.0016;
	float t = stepSize;
	float oc = 0.0;
	for(int i = 0; i < 10; ++i)
	{
		vec2 obj = map(p + n * t, true);
		oc += t - obj.x;
		t += pow(float(i), 2.2) * stepSize;
	}

	return 1.0 - clamp(oc * 0.2, 0.0, 1.0);
}

float getVisibility(vec3 p0, vec3 p1, float k)
{
	vec3 rd = normalize(p1 - p0);
	float t = 10.0 * SURFACE_DIST;
	float maxt = length(p1 - p0);
	float f = 1.0;
	for (int i=0; i<100; ++i)
	{
		if (t >= maxt && t >= MAX_DIST) break;
		vec2 o = map(p0 + rd * t, false);

		if(o.x < SURFACE_DIST)
			return 0.0;

		f = min(f, k * o.x / t);

		t += o.x;
	}

	return f;
}

// Texturing
vec2 triplanar(vec3 p, vec3 normal)
{
    if (abs(dot(normal, vec3(0.0, 1.0, 0.0))) > .8)
    {
        return p.xz;
    }
    else if (abs(dot(normal, vec3(1.0, 0.0, 0.0))) > .8)
    {
        return p.yz;
    }
    else
    {
        return p.xy;
    }
}

// Renderer
vec3 render(vec2 obj, vec3 p, vec3 rd, vec2 uv)
{
    vec3 col = vec3(0.);
    
    vec3 normal = calcNormal(p);
    float fog;
    
    vec3 background = vec3(0.0, 0.01, 0.05);
    float n = fbm(uv * 250.0 + iTime * .4);
    n = smoothstep(0.6, 0.65, n) * .5;
    background += n;
    
    if (obj.x >= MAX_DIST)
    {
        col = background;
    }
    else
    {
        float wallnoise = ((noise(p * 2.0)) * .2 + 0.7);
        
        vec3 albedo = vec3(0.0, 0.0, 0.0);
        fog = pow((obj.x / MAX_DIST), 6.8);
        float aa = 1.0;
        
        float diff_mask = 1.0;
        float spec_power = 15.0;
        float spec_mask = 1.0;
        
        if (obj.y >= 7.0) // wall bricks
        {
            float n = abs(noise(uv * 2.0));
            albedo = vec3(0.505, 0.194, 0.184) * (n * 0.4 + 0.6);
            
            aa = ambientOcclusion(p, normal);
            spec_power = 20.0;
            spec_mask = .6 * n + .4;
        }
        else if (obj.y >= 6.0) // character eyes
        {
            //vec2 uv = triplanar(p, normal) * 3.0;
            //uv = mod(uv * 0.02 + 0.5, 1.0);
            albedo = vec3(0.165, 0.154, 0.184);
            diff_mask = 0.0;
            spec_power = 90.0;
            spec_mask = 1.7;
        }
        else if (obj.y >= 5.0) // character eye balls
        {
            albedo = vec3(1.365, 1.354, 1.384);
            diff_mask = 0.0;
            spec_power = 90.0;
            spec_mask = .8;
        }
        else if (obj.y >= 4.0) // bin wheel
        {
            albedo = vec3(0.105, 0.154, 0.184);
        }
        else if (obj.y >= 3.0) // bin
        {
            albedo = vec3(0.145, 0.454, 0.194);
            vec3 d = (bin_disp - vec3(0.0, -1.5, 1.8)) - p;
            vec3 n = normalize(d);
            if (dot(normal, n) > 0.0) albedo *= (dot(normal, n) * .5 + .5) * .1;
            aa = ambientOcclusion(p, normal);
            spec_power = 90.0;
            spec_mask = 2.5;
             
        }
        else if (obj.y >= 2.0) // Walls
        {
            albedo = vec3(0.305, 0.354, 0.384) * wallnoise;
            aa = ambientOcclusion(p, normal);
        }
        else if (obj.y >= 1.0) // floor
        {
            float n = abs(fbm_2(p * 0.8));
            albedo = vec3(0.285, 0.364, 0.294) * (n * .1 + 0.9) * (p.z < -2.73 ? 0.6 : 0.8);
            aa = ambientOcclusion(p, normal);
            spec_power = 10.0;
            spec_mask = 0.5;
        }
        
        // Ambient light
        #if 1
        col += albedo * pow(aa, 2.0) * .4;
        #endif
        
        // Top Light
        #if 1
        {
            vec3 light_pos = vec3(-10.0, 20.0, 0.4);
            vec3 light_col = vec3(0.2, 0.2, 1.0);
			vec3 refd = reflect(rd, normal);
            vec3 light_dir = normalize(light_pos - p);
            
            float diffuse = dot(light_dir, normal);
            float visibility = getVisibility(p, light_pos, 10.0);
        	float spec = pow(max(0.0, dot(refd, light_dir)), spec_power);

            col += diff_mask * diffuse * albedo * visibility * light_col * .46;
            col += spec * (light_col * albedo) * spec_mask;
        }
        #endif
        
        // Street Light
        #if 1
        {
            vec3 light_pos = vec3(6.0, 7.0, -4.0);
            vec3 light_col = vec3(0.725, 0.285, 0.0);
            vec3 refd = reflect(rd, normal);
            vec3 light_dir = normalize(light_pos - p);

            float diffuse = dot(normalize(light_pos - p), normal);
            float visibility = getVisibility(p, light_pos, 10.0);
            float spec = pow(max(0.0, dot(refd, light_dir)), spec_power);

            col += diff_mask * diffuse * albedo * visibility * light_col * 2.0;
            col += spec * (light_col * albedo) * spec_mask;
        }
        #endif
        
    }
    
    return mix(col, background, fog);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec3 ro = vec3(-1.5, 2.0, -4.0);
    
// Free camera 1
#if 0
    float d = 1.0;
    float v = ((iMouse.x / iResolution.x) - .5) * -5.;
    vec3 ta = ro + vec3(sin(v) * d, clamp((iMouse.y / iResolution.y) - .5, -0.5, 0.5), cos(v) * d);
    
// Free camera 2
#elif 0
    float d = 5.0;
    float u = iMouse.x / iResolution.x * -5.0;
    float v = (1.0 - iMouse.y / iResolution.y) * 10.0;
    vec3 ta = vec3(0.0, 0.6, -1.0);
    ro = vec3(
        sin(u) * d,
        v * .1 * d,
        cos(u) * d
    );
    
// Fixed camera
#elif 1 
    float mx = iMouse.x / iResolution.x * -0.2;
    float my = (1.0 - iMouse.y / iResolution.y) * 0.5;
    
    float d = 5.0;
    float u = mx + -2.6 + (sin(iTime * .3)) * -0.2;
    float v = my + 2.6 + sin(iTime * .2) * 0.5;
    vec3 ta = vec3(0.0, 0.8, -1.0);
    ro = vec3(
        sin(u) * d,
        v * .1 * d,
        cos(u) * d
    );
#endif

    
    vec3 tot = vec3(0.0);
#if AA>1
    for(int m=ZERO; m<AA; m++)
    for(int n=ZERO; n<AA; n++)
    {
        vec2 o = vec2(float(m), float(n)) / float(AA) - 0.5;
        vec2 uv = (2.0 * (fragCoord + o) - iResolution.xy) / iResolution.y;
#else    
    	vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
#endif       
        // Ray direction
        vec3 ww = normalize(ta - ro);
        vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
        vec3 vv = normalize(cross(uu, ww));
        
        vec3 rd = normalize(uv.x * uu + uv.y * vv + 2.3 * ww);
        
        // render	
        vec2 obj = rayMarch(ro, rd);
        vec3 p = ro + obj.x * rd;
    
   		vec3 col = render(obj, p, rd, uv);
        
        tot += col;
#if AA>1
    }
    tot /= float(AA*AA);
#endif
        

    fragColor = vec4(tot,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}