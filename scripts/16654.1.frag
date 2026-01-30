#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;


////////////////////////////////////////////////////////////////////////////////
//
//
//  GPU UTILIZATION VISUALIZATION 
//
//  OR
//
//  "How a single pixel skrewed his neighbors"
//
//  by @rianflo
//
//  16x16 tiles assumed
//
//  RED...    number stalls of one pixel inside a tile (difference to max iteration inside the tile)
//  GREEN...  iteration count
//  BLUE...   averaged shading color from the sh_light
//
// 
//
//
///////////////////////////////////////////////////////////////////////////////

//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 


vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

struct SHC
{
    vec3 L00, L1m1, L10, L11, L2m2, L2m1, L20, L21, L22;
};

SHC beach = SHC(
                vec3( 0.6841148,  0.6929004,  0.7069543),
                vec3( 0.3173355,  0.3694407,  0.4406839),
                vec3(-0.1747193, -0.1737154, -0.1657420),
                vec3(-0.4496467, -0.4155184, -0.3416573),
                vec3(-0.1690202, -0.1703022, -0.1525870),
                vec3(-0.0837808, -0.0940454, -0.1027518),
                vec3(-0.0319670, -0.0214051, -0.0147691),
                vec3( 0.1641816,  0.1377558,  0.1010403),
                vec3( 0.3697189,  0.3097930,  0.2029923)
                );

vec3 sh_light(vec3 normal, SHC l)
{
    float x = normal.x;
    float y = normal.y;
    float z = normal.z;
    
    const float C1 = 0.429043;
    const float C2 = 0.511664;
    const float C3 = 0.743125;
    const float C4 = 0.886227;
    const float C5 = 0.247708;
    
    return (
            C1 * l.L22 * (x * x - y * y) +
            C3 * l.L20 * z * z +
            C4 * l.L00 -
            C5 * l.L20 +
            2.0 * C1 * l.L2m2 * x * y +
            2.0 * C1 * l.L21  * x * z +
            2.0 * C1 * l.L2m1 * y * z +
            2.0 * C2 * l.L11  * x +
            2.0 * C2 * l.L1m1 * y +
            2.0 * C2 * l.L10  * z
            );
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



#define RAY_MAX_STEPS 64
#define RAY_MAX_DIST 0.00001
#define GRAD_EPSILON 0.001

float smin(float a, float b)
{
    const float k = 32.0;
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

bool intersectUnitSphere(vec3 rayOrigin, vec3 rayDir, out float t0, out float t1) 
{	
    vec3 Q = vec3(0.0)-rayOrigin;
    float c = length(Q);
    float v = dot(Q, rayDir);
    float d = 1.0 - (c*c - v*v);
    
    // only return true on two intersections
    if (d <= 0.0) return false;
    
    t0 = (v - sqrt(d));
    t1 = (v + sqrt(d));
    return true;
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sdSphere(vec3 p, vec3 t, float r)
{
    return length(p-t)-r;
}

float brownian(vec3 p)
{
    float sd = 0.0;
	float f = 32.0;
	float l = 0.005;
	for (int i=0; i<2; i++)
	{
		sd += snoise(p*f)*l;
		//sd += abs(sd) * 0.31;
		f *= 2.01;
		l *= 0.54;
	}
	return sd;
}

float sdf(vec3 p, vec3 sel)
{
    //return sdCylinder(p, vec3(mouse, 0.1));
    //return sdCone(p, normalize(mouse));
    const float patchSize = 0.2;
    
    float sd;
    float unitSphere = sdSphere(p, vec3(0.0), 1.0);
    
    float cyl = sdSphere(p, sel, patchSize);
    if (cyl < 0.0)
    {
        float cutoff = (1.0 - distance(p, sel)/patchSize);
        cutoff *= cutoff;
        float disp = brownian(p) * cutoff;
        sd = unitSphere - disp;
    }
    else
    {
        sd = unitSphere;
    }
    //sd = min(cyl, unitSphere);
    return sd;
}

vec3 sdGradient(vec3 p, vec3 sel)
{
    vec3 s = vec3(GRAD_EPSILON, 0.0, 0.0);
    vec3 f = vec3(
        sdf(p+s.xyy, sel),
        sdf(p+s.yxy, sel),
        sdf(p+s.yyx, sel)
    );
    vec3 g = vec3(
        sdf(p-s.xyy, sel),
        sdf(p-s.yxy, sel),
        sdf(p-s.yyx, sel)
    );
    return (f-g)/(2.0*s.x);
}

void main() 
{
    // coordinate system with origin in the center and y-axis goes up
    // y-range is [-1.0, 1.0] and x-range is based on aspect ratio.
    vec2 p = (-resolution.xy + 2.0 * gl_FragCoord.xy) / resolution.y;
    vec2 m = (mouse * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);

    vec3 rayDir = normalize(p.x*vec3(1.0, 0.0, 0.0) + p.y*vec3(0.0, 1.0, 0.0) + radians(90.0)*vec3(0.0, 0.0, -1.0));
    vec3 rayOrigin = vec3(0.0, 0.0, 2.0);
    
    vec3 mouseRayDir = normalize(m.x*vec3(1.0, 0.0, 0.0) + m.y*vec3(0.0, 1.0, 0.0) + radians(90.0)*vec3(0.0, 0.0, -1.0));
    float t0, t1;
    vec3 selection = vec3(0.0);
    if (intersectUnitSphere(rayOrigin, mouseRayDir, t0, t1) == true)
    {
        selection = rayOrigin + t0*mouseRayDir;
    }
    
    vec3 cur = rayOrigin;
    vec3 intersection = vec3(0);
    int ic=0;
    for (int i=0; i<RAY_MAX_STEPS; i++)
    {
        ic++;
        float sd = sdf(cur, selection);
        if (sd < RAY_MAX_DIST)
        {
            intersection = cur;
            break;
        }
        cur += rayDir * sd;
    }
    
    vec3 color = vec3(0.0);
    if (length(intersection) > 0.0)
    {
        // shade
        vec3 grad = sdGradient(intersection, selection);
        color = sh_light(normalize(grad), beach);
    }
    
    float c = (color.r+color.g+color.g)/3.0;
    
    // sample iteraction counts (green channel) from backbuffer
    // for each tile
    
    #define TILESIZE 16
    
    vec2 tile = floor(gl_FragCoord.xy / float(TILESIZE));
    vec2 pixel = vec2(1.0)/resolution.xy;
    vec2 tbase = tile * float(TILESIZE) * pixel;
    
    float maxTileIter = 0.0;
    float sumTileIter = 0.0;
    float pic = 0.0;

    for (int y=0; y<TILESIZE; y++)
    {
        for (int x=0; x<TILESIZE; x++)
        {
            pic = texture2D(bb, tbase+vec2(x, y)*pixel).g;
            maxTileIter = max(maxTileIter, pic);
            sumTileIter += pic;
        }
    }

    float prevIter = texture2D(bb, gl_FragCoord.xy/resolution.xy).g;
    
    gl_FragColor = vec4(maxTileIter-prevIter, float(ic)/float(RAY_MAX_STEPS), c, 0.0);
}


