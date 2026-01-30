/*
 * Original shader from: https://www.shadertoy.com/view/wsVGRz
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

// --------[ Original ShaderToy begins here ]---------- //
//
// This is my first attempt at a ray marching shader
// It is inspired of MC Escher's drawings of the Cordoba mosk.
//
// https://hotelviento10.es/en/art/77-the-drawings-of-cordoba-by-m-c-escher
//
// It was mostly developped during the 8 train hours of a week-end away from my workstation
// so one of my objectives was to keep a decent framerate on my laptop and, although
// the fan is screaming like hell I managed to maintain a 25fps preview which is not bad.
// I might push the rendering a bit with AA and motion blur later.
//
// I'm also quite confident there is an enormous room for optimization.
//
// I started writing this thing after watching the Youtube intro to ray marching by BigWing
// and studiying a few shaders by iq and Shane so kudos to these guys.
// 
// Although I've been doing 'regular" 3D code for quite some years now discovering the
// wonders of Signed distance Fields and their properties feels like. I would never have
// believed that I could achieve such an elaborate result (soft shadows, reflections,
// procedural marble, AO & all) in less than 600 lines of code before comments.
// This is truly opening new doors in my mind.
//
// I first implemented the shadows using a classic ray marching scheme an tried to soften
// them by Jittering the light position and averaging a bunch of sample, the result was
// super noisy and very slow. Thanks to iq's latest shader I figured out the concept of
// using 'penumbra' to get soft shadows in a single ray cast and implemented it for a
// huge improvement. At first I struggled a bit with it as my SDF turned non-eucydean when
// I tried to blend my arches into my pillars with mix.There were many artefacts, missed
// details and misplaced shadows. I took a bit of time to rework my SDF with a cone
// intersection which fixed everything for a very similar shape.
//

// EDIT 3/01/2020 : Replace the Silly 3D texture for Noise with procedural Perlin noise
//					It only ended up being used for the floor and the ceiling anyways


#define MAX_DST 40.0
#define FOG_DST 5.0
#define MIN_DST 0.001
#define S(a,b,c) smoothstep(a,b,c)
#define sat(a) clamp(a,0.0,1.0)


// Some hash function 2->1
float N2(vec2 p)
{	// Dave Hoskins - https://www.shadertoy.com/view/4djSRW
	vec3 p3  = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

// A 2d Noise texture I use for the marble
float Noise(vec2 uv)
{
    vec2 corner = floor(uv);
	float c00 = N2(corner + vec2(0.0, 0.0));
	float c01 = N2(corner + vec2(0.0, 1.0));
	float c11 = N2(corner + vec2(1.0, 1.0));
	float c10 = N2(corner + vec2(1.0, 0.0));
    
    vec2 diff = fract(uv);
    
    diff = diff * diff * (vec2(3) - vec2(2) * diff);
    
    return mix(mix(c00, c10, diff.x), mix(c01, c11, diff.x), diff.y);
}

float NoisePM(vec2 uv)
{
    return Noise(uv) * 2.0 - 1.0;
}


// A basic Perlin-style marble that I hacked quite a bit
float marble(vec3 pos)
{
    /*
    vec3 marbleAxis = vec3(0.5, 0.4, -0.1);
  
	vec3 mfp = (pos + dot(pos, marbleAxis) * marbleAxis * 2.0) * 0.02;*/
    
	float marble = 0.0;
    
    pos *= 1.0;
    
	marble += abs(NoisePM(pos.xz));
	marble += abs(NoisePM(pos.xz * 4.0)) * 0.5;
	marble += abs(NoisePM(pos.xz * 8.0)) * 0.3;
    //marble += abs(NoisePM(pos.xz * 16.0)) * 0.15;

    
	marble /= (1.0 + 0.5 + 0.3 /*+ 0.15*/);
	marble = pow(1.0 - marble, 3.0) * 1.5;
    
	return marble;
}

vec3 marble(vec3 pos, vec3 col1, vec3 col2)
{
	return mix( col1, col2, marble(pos) );
}

// box distance function (stolen from iq)
float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


// cylinder distance function (stolen from iq)
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


// cone distance function
float sdCone(vec3 p, vec2 c)
{
    float q = length(p.xz);
    return dot(c, vec2(q, p.y));
}

// boolean add with y as material id
vec2 combine(vec2 a, vec2 b)
{
    return (a.x < b.x ? a : b);   
}

// boolean subtract with y as material id
vec2 subtract(vec2 a, vec2 b)
{
    b.x = -b.x;
    return (a.x > b.x ? a : b);
}

float subtract(float a, float b)
{
    return max(a, -b);
}

// boolean intersect with y as material id
vec2 inter(vec2 a, vec2 b)
{
    return (a.x > b.x ? a : b);
}


// Material ids
//
//0.0 -> floor
//1.0 -> Ceiling
//2.0 -> Ceiling wall
//3.0 -> higer arch
//4.0 -> Pillar
//5.0 -> Lower arch

vec2 SDF(vec3 pos)
{
    vec2 floorVal = vec2(pos.y + 0.5, 0.0); // ground plane
    
    // Bend space to mirror-tile the arches on both x and z
    pos.x = abs(mod(pos.x, 2.0) - 1.0);
    pos.z = abs(mod(pos.z, 4.0) - 2.0);
    
    
    float ceilValue = 4.5 - pos.y;
    ceilValue = min(ceilValue, sdBox(pos - vec3(0.0, 4.3, 0.0), vec3(0.2, 0.2, 4.0)));
    vec2 ceilVal = vec2(ceilValue, 1.0); // Ceiling and beams with label 1.0
    
    
    vec2 dist = combine(floorVal, ceilVal);
    
    vec2 arch1 = vec2(sdCylinder(pos, vec3(1.0, 3.0, -0.3),vec3(1.0, 3.0, 0.3), 1.15), 3.0);
    arch1 = combine(arch1, vec2(sdBox(pos - vec3(0.0, 5.0, 0.0), vec3(2.0, 1.4, 0.23)), 3.5));
    vec2 arch1Neg = vec2(sdCylinder(pos, vec3(1.0, 3.0, -0.4),vec3(1.0, 3.0, 0.4), 0.78), 3.0);
    arch1 = subtract(subtract(arch1, arch1Neg), vec2(pos.y - 3.0, 3.0));

    
    float colDist = length(pos.xz) - 0.15;
    float pillarBox  = sdBox(pos - vec3(0.0, 1.85, 0.0), vec3(0.16, 1.2, 0.3));
    float pillarBox2 = sdBox(pos - vec3(0.0, 1.85, 0.0), vec3(0.22, 1.2, 0.2));
    float cone = sdCone(pos - vec3(0.0, 1.2, 0.0), normalize(vec2(2.0, -1.0)));
    
	pillarBox = min(pillarBox, pillarBox2);    
    pillarBox = max(pillarBox, cone);
    pillarBox = min(pillarBox, colDist);

    vec2 pillar = vec2(pillarBox, 4.0);


    
    arch1 = combine(pillar, arch1);
    
    
    float arch2 = sdCylinder(pos, vec3(1.0, 1.8, -0.15),vec3(1.0, 1.8, 0.15), 1.13);
    float arch2Neg = sdCylinder(pos, vec3(1.0, 1.8, -0.6),vec3(1.0, 1.8, 0.6), 0.8);
    
    arch2 = subtract(subtract(arch2, arch2Neg), pos.y - 2.0);
    
    vec2 arch2Value = vec2(arch2, 5.0);
    
    dist = combine(dist, arch1);
    dist = combine(dist, arch2Value);
    
    
     
    
	return dist;// + Noise(pos * 3.0) * 0.0003 // a bit of noise make refections an highlights richer
}


#define ZERO 0

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize( e.xyy*SDF( pos + e.xyy ).x + 
					  e.yyx*SDF( pos + e.yyx ).x + 
					  e.yxy*SDF( pos + e.yxy ).x + 
					  e.xxx*SDF( pos + e.xxx ).x );
}

vec2 castRay(vec3 pos, vec3 dir, float maxDst, float minDst)
{
    vec2 dst = SDF(pos);
    //return dst;
    
    float t = 0.0;
    
    for (int i=0; i<100; ++i)
    {
        if (dst.x <= minDst || t >= maxDst) break;
        t += dst.x;
        pos += dst.x * dir;
        dst = SDF(pos);
    }
    
    return vec2(t + dst.x, dst.y);
}

// A marble pattern with .a as Speculairty/Reflection
vec4 floorColor(vec3 pos)
{
    vec2 uvs = fract(pos.xz * vec2(0.5, 0.25));
    vec2 ids = floor(uvs);
    
    bool mask1 = uvs.x > uvs.y;
    bool mask2 = uvs.x > 1.0- uvs.y;

    float mask = mask2 ^^ mask1 ? 0.0 : 1.0;
    
    vec3 baseCol = mix(vec3(0.2, 0.6, 0.3),vec3(0.6, 0.2, 0.4), mask);
    
    float marble = marble(pos * 4.0);

    return  vec4(baseCol * (1.0 - marble * 0.2), 1.1 + marble);
}


// The stripes in polar space
float ArchPattern(vec3 pos, float height)
{
    pos.x = abs(mod(pos.x, 2.0) - 1.0);
    
    vec2 delta = pos.xy - vec2(1.0, height);
    float angle = atan(delta.y, delta.x);
    
    return S(0.26, 0.25, abs(fract(angle * 2.8) - 0.5));
}


vec3 archesColor(vec3 pos, float matId)
{
        float arch = 1.0;
        
        if (matId < 3.1)
        {
            arch = ArchPattern(pos, 3.0);
        }
        else if (matId > 4.9)
        {
            arch = ArchPattern(pos, 1.8);
        }
        
        //vec3 mainColor = mix(vec3(0.90, 0.70, 0.60) * 0.9, vec3(0.80, 0.5, 0.40) * 0.9, S(2.0, 1.5, pos.y));
        
        vec3 col = mix(vec3(0.7, 0.41, 0.40) * 0.8, vec3(1.0, 0.8, 0.70), arch); 
        //vec3 col2 = mix(vec3(0.8, 0.53, 0.52), mainColor, arch);
        
    	// The marble onthe colums didn't add that much to the look
        return col;//marble(pos + col, col2, col);
}


// Some pretty shitty procedural wood (but it's barely visible)
vec3 ceilingColor(vec3 pos)
{
    float p = pos.x * 5.0;
    
    p += Noise(pos.xy * vec2(0.5, 0.05) + pos.y * 0.1) * 3.0;
    
    float wood = fract(sin(p) * 2.0);
    
    return mix(vec3(0.69, 0.55, 0.4) * 0.8, vec3(0.5, 0.25, 0.15), wood);
}


vec4 MatColor(float matId, vec3 pos)
{
    if (matId < 0.1)
    {
        return floorColor(pos);
    }
    else if (matId < 1.1)
    {
        return vec4(ceilingColor(pos), 0.1);
    }
    else
    {
        return vec4(archesColor(pos, matId), 1.0);
    }
}

// inspired by
// http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
float shadow(vec3 pos, vec3 lPos)
{
    lPos.xyz += (vec3(N2(pos.xy), N2(pos.yz), N2(pos.zx)) - 0.5)* 0.03; //jitters the banding away
    
    vec3 dir = lPos - pos;  // Light direction & disantce
    
    float len = length(dir);
    dir /= len;				// It's normalized now
    
    pos += dir * MIN_DST * 10.0;  // Get out of the surface
    
    vec2 dst = SDF(pos); // Get the SDF
    
    // Start casting the ray
    float t = 0.0;
    float obscurance = 1.0;
    
    for (int i=0; i<100; ++i)
    {
        if (t >= len) break;
        if (dst.x < MIN_DST) return 0.0; 
        
        obscurance = min(obscurance, (20.0 * dst.x / t)); 
        
        t += dst.x;
        pos += dst.x * dir;
        dst = SDF(pos);
    }
    
    return obscurance;     
}


float shadow(vec3 p, vec3 n, vec3 lPos)
{
    return shadow(p + n * MIN_DST * 4.0, lPos);
}

// Computes the X of a pseudo-random path that will never 
// bump into pillar With agivent z and a seed value
float CamX(float camZ, float seed)
{
    float normalized = (camZ - 2.0) / 4.0; // nomalize Z on the column grid
    
    float ratio = fract(normalized);  // 0.0 -> between cells
    float cur = floor(normalized);    // current cell id
    float next = cur + 1.0;
    
    // Pick random arches (0.0, 1.0 ou 2.0) for the current and next cell
    cur = floor(N2(vec2(cur, seed)) * 2.9) * 4.0 - 2.0;
    next = floor(N2(vec2(next, seed)) * 2.9) * 4.0 - 2.0;

    // Cosine interpolate between the two
    ratio = (1.0 - cos(ratio * 3.14)) * 0.5;
    return mix(cur, next, ratio);
}

// Camera position from z
vec3 CamPos(float z)
{
    float x = CamX(z, 666.0);
    float y = 1.0 + sin(z * 0.14); // going up & down
    return vec3(x, y, z);
}

const vec3 fogColor = vec3(1.5, 1.0, 0.6); 
const vec3 lightCol =  vec3(2.0, 1.5, 1.0);

// A simpler rendering for reflections (diffuse only)
vec3 reflection(vec3 pos, vec3 ref, vec3 lightPos)
{
    pos += ref * MIN_DST * 4.0;
    
    vec2 d = castRay(pos, ref, MAX_DST, MIN_DST);
    
    vec3 nPos = pos + ref * d.x;

    float hAtten = sat((5.0 - nPos.y) / 3.0);
    
    if (d.x > MAX_DST)
    {
        return fogColor * hAtten; 
    }
    else   
    {
   
        vec3 col = MatColor(d.y, nPos).rgb;// * atten;
      	  
      	vec3 pointDir = lightPos - nPos;
        float len = length(pointDir);
        
                
        vec3 n = calcNormal(nPos);
        
        float atten = sat(1.0 - len / 20.0);
        
        atten *= shadow(nPos, n, lightPos);
        
        pointDir /= len;
        
        float diffuse = sat(dot(n, pointDir));
        
        col *= (diffuse * (atten * atten) * hAtten);
        
        return col;
    }
}

// Main rendering
vec3 render(vec2 uv, float time)
{
    float camZ = time * 0.6;
    
    // Compute camera position and 3-Axis base
    vec3 camPos = CamPos(camZ);
    vec3 nextPos = CamPos(camZ + 2.5);
    vec3 camDir = normalize(nextPos - camPos);
    vec3 camRight = normalize(vec3(-camDir.z, 0.0, camDir.x));
    vec3 camUp = cross(camRight, camDir);
    
    // Compute ray
    vec3 rayPos = camPos;
    vec3 rayDir = normalize(camDir * 1.8 + (camRight * uv.x)  +  (camUp * uv.y));
    
 	// Liighting & sading
    vec3 lightDir = normalize(vec3(1.0, -0.4, 1.0));
 
    float lightZ = camZ - 1.0;
    float lightX = CamX(lightZ, 576.0);
    
    vec3 lightPos = vec3(lightX, 1.5, lightZ);
    
    vec2 d = castRay(rayPos, rayDir, MAX_DST, MIN_DST);
    
    vec3 col;
    
    if (d.x > MAX_DST)
    {
        col = fogColor; 
    }
    else   
    {
        //float field = fract(d * 1.0);
	    col = vec3(d.y / 8.0);//
        vec3 pos = camPos + rayDir * d.x;
        
        vec4 mat = MatColor(d.y, pos);
        
        vec3 n = calcNormal(pos);
        

        vec3 pointDir = lightPos - pos;
        float len = length(pointDir);
        
        float atten = sat(1.0 - len / 20.0);
        
        pointDir /= len;
        
        //float ambient = (n.y + 0.5) * 0.1;// mix(vec3(0.1, 0.1, 0.1), vec3(0.5, 0.5, 0.0), n.y * 0.5 + 0.5);
        
        float lambertPoint = 0.0;
        
 		atten *= atten;
     
        float shadow = shadow(pos, n, lightPos); 
        
        lambertPoint = sat(dot(n, pointDir));
        
        lambertPoint *= shadow * atten; 
        
        vec3 ref = reflect(rayDir, n);
        float specular =  sat(dot(pointDir, ref));
        
        specular = specular * specular * shadow * atten;

        vec3 diffuseCol = lambertPoint * lightCol;
        
        vec3 specularCol = vec3(specular);
        
        col = (mat.rgb * diffuseCol) + mat.a * specularCol;
        
        float dst = 1.0 - sat(SDF(pos + n * 0.5).x * 1.0);

        col *= vec3((1.0 - dst * dst) * 0.7 + 0.3); // Fake AO
        
        if (mat.a > 1.05) // Reflections on the floor
        {
            float fresnel = abs(dot(n, rayDir));
            col += reflection(pos, ref, lightPos) * atten * fresnel;// * mat.a;
        }
        
        float fogDst = sat(d.x / MAX_DST);

        col = mix(col, fogColor, pow(fogDst, 1.5));
    }
    
    return col;
}
 


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    
    // an attempt a 4X Multisampling, quite slow, not neat
	/*
    vec4 offset = vec4(-0.25,0.25,-0.25,0.25) / iResolution.y;
    float noize = N2(uv) * 0.005;
  	vec3 col = render(uv + offset.zx, iTime);
    col += render(uv + offset.yw, iTime + 0.005 + noize);
    col += render(uv + offset.wx, iTime + 0.01 + noize);
    col += render(uv + offset.xz, iTime + 0.015 + noize);
    col /= 4.0;
	*/
    
    vec3 col = render(uv, iTime + 9.0); // +9 is for a nicer thumbnail
    
    // Gamma correction
    float gamma = 0.85;
    col = vec3(pow(col.r, gamma), pow(col.g, gamma), pow(col.b, gamma));

    // Output to screen
    fragColor = vec4(col.rgb,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}