//Copyright (c) 2019-06-23 - 2019-07-04 by Angelo Logahd
//Portfolio: https://angelologahd.wixsite.com/portfolio

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI	 	= 3.1415;
float EPSILON_NRM	= 0.001;

const vec3 up = vec3(0.0, 1.0, 0.0);

#define true  			1
#define false 			0

#define saturate(x)		clamp(x, 0.0, 1.0)
#define mul3x(x) 		x * x * x
#define dot2(x)			dot(x, x)

#define SIMULATE 		0
#define SIMULATE2x		1
#define SIMULATE3x		2
#define SIMULATE4x		3
#define SIMULATE5x		4
#define PAUSED			5
#define SLOW_MOTION		6

#define WAVES_WATER		0
#define CALM_WATER		1

#define SIMULATE_MODE		SIMULATE
#define WATER_TYPE		CALM_WATER
#define RAINBOW_WATER		false
#define FANTASY_WATER_PATH	false
#define FLIP_WATER_AND_SKY	false
#define DAY_AND_NIGHT		false
#define SUN_LIGHT		true
#define HDR			true

//...........................................................
//			Weathers
//...........................................................
#define	RAIN			true
#define RAINBOW			false
#define STAR_SKY		true
#define MOON			false

#if RAIN
const vec3 RAIN_BASE_COLOR		= vec3(1.0, 1.0, 1.0);
const float RAIN_COLOR_INTENSITY 	= 1.5;
#endif

#if RAINBOW
#define RAINBOW_START_Y			0.0

const float RAINBOW_BRIGHTNESS  	= 1.0;
const float RAINBOW_INTENSITY   	= 0.30;
const vec3  RAINBOW_COLOR_RANGE 	= vec3(50.0, 53.0, 56.0);  // The angle for red, green and blue
vec3 RAINBOW_POS			= vec3(4.5, 0.0, 0.5);
vec3 RAINBOW_DIR 			= vec3(-0.2, -0.1, 0.0);
	
vec3 rainbow_pos;
vec3 rainbow_camera_dir;
vec3 rainbow_up; 
vec3 rainbow_vertical;
vec3 rainbow_w;
#endif

#if STAR_SKY
const float STAR_THRESHOLD		= 0.98;
#endif

#if MOON
const vec2  MOON_F 			= vec2(0.8);
const vec3  MOON_BASE_COLOR 		= vec3(1.0, 1.0, 1.0);
const vec3  MOON_COLOR_GRADING 		= vec3(0.0, 0.0, 0.3);
const float MOON_FOG_LIGHT_STRENGTH	= 0.01;
const float MOON_LIGHT_STRENGTH		= 0.01;
const float MOON_SCALE 			= 5.0;
#endif
//...........................................................

//...........................................................
//			Post Processing
//...........................................................
#define APPLY_LUMINANCE			true
#if HDR
#define APPLY_TONEMAP			true
#endif
#define APPLY_GAMMA_CORRECTION		true

const float INTENSITY			= 1.0;
const float CONTRAST			= 1.2;

#if HDR
#if APPLY_TONEMAP

#define LINEAR_TONEMAP			0
#define EXPONENTIAL_TONEMAP		1
#define REINHARD_TONEMAP		2
#define FILMIC_TONEMAP			3

#define TONEMAP_TYPE			FILMIC_TONEMAP		
 
#if TONEMAP_TYPE == LINEAR_TONEMAP
const float TONEMAP_EXPOSURE		= 0.5;
#endif
#if TONEMAP_TYPE == EXPONENTIAL_TONEMAP
const float TONEMAP_EXPOSURE		= 0.5;
#endif
#if TONEMAP_TYPE == REINHARD_TONEMAP
const float TONEMAP_EXPOSURE		= 0.5;
#endif
#if TONEMAP_TYPE == FILMIC_TONEMAP
//https://www.slideshare.net/ozlael/hable-john-uncharted2-hdr-lighting
//http://filmicworlds.com/blog/filmic-tonemapping-operators/

//Uncharted2Tonemap:
//Orginal Values:
//A = 0.22
//B = 0.30
//C = 0.10
//D = 0.20
//E = 0.02
//F = 0.30
//W = 11.2

float A = 0.22;
float B = 0.50;
float C = 0.10;
float D = 0.20;
float E = 0.02;
float F = 0.30;
float W = 11.2;

const float TONEMAP_EXPOSURE		= 0.1;
const float TONEMAP_EXPOSURE_BIAS 	= 2.0;
#endif
#endif

#endif

//...........................................................
//			Filters
//...........................................................
#define VIGNETTE_FILTER			false
#define SEPIA_FILTER			false
#define COLOR_GRADING_FILTER		true

#if VIGNETTE_FILTER
const vec3  VIGNETTE_COLOR 		= vec3(1.0, 1.0, 1.0);
const float VIGNETTE_ZOOM  		= 2.5; //2.5 -> full image 
const float VIGNETTE_EXPOSURE 		= 2.0;
#endif

#if SEPIA_FILTER
const vec3  SEPIA_COLOR 		= vec3(1.9, 0.8, 0.6);
const float SEPIA_INTENSITY 		= 1.0;
#endif

//Based on Sobel filter
//You can read more about Sobel here: http://clockworkchilli.com/forum/thread?id=Dynamic_scene_lightning___10351&page=1
#if COLOR_GRADING_FILTER

#define ADD				0
#define SUBTRACT			1
#define MULTIPLY			2
#define DIVIDE				3

#define COLOR_GRADING_BLEND_MODE	MULTIPLY
const float COLOR_GRADING_REAL_WEIGHT 	= 1.0;
const float COLOR_GRADING_WEIGHT 	= 1.0;
const float COLOR_GRADING_G 		= 3.0;
const vec3  COLOR_GRADING_COLOR 	= vec3(1.0, 0.1, 0.0);

#endif
//...........................................................	

#if APPLY_GAMMA_CORRECTION
const float GAMMA			= 2.2;
#endif
//...........................................................

//Day and night properties
#if DAY_AND_NIGHT
#define DAY_AND_NIGHT_TIME			0.1
#define DAY_AND_NIGHT_MIN_BRIGHTNESS		0.2
#define DAY_AND_NIGHT_MAX_BRIGHTNESS		1.0
#endif

//Sun light properties
#if SUN_LIGHT
vec3  SEA_SUN_DIRECTION		        = vec3(0.0, -1.0, -0.5);
vec3  SEA_SUN_COLOR     		= vec3(1.0, 1.0, 1.0);    //vec3(1.0, 1.0, 0.0) to use a yellow reflection color
float SEA_SUN_DIFFUSE  			= 0.65; 
vec3  SEA_SUN_SPECULAR      		= vec3(0.65);
#endif

//Geometry / Fragment properties
const int SEA_GEOMETRY_ITERATIONS   	= 8;
const int SEA_FRAGMENT_ITERATIONS   	= 10;

// sea base properties
const vec3  SEA_BASE_COLOR 		= vec3(0.15, 0.2, 0.25);
const vec3  SEA_WATER_COLOR 		= vec3(0.15, 0.15, 0.15);
const vec3  SEA_ORI			= vec3(0.0, 2.5, 0.0);		
const float SEA_HEIGHT    		= 1.25;
const float SEA_SPEED     		= 3.0;
const float SEA_FREQ      		= 0.1;
const float SEA_GEOMETRY_FREQ_MUL	= 1.9;
const float SEA_GEOMETRY_AMPLITUDE_MUL 	= 0.22;
const float SEA_FREQ_MUL  		= 2.0;
const float SEA_AMPLITUDE_MUL 		= 0.22;
const float SEA_REFRACTION_MUL_VALUE	= 0.12;
const float SEA_ATTENUATION             = 0.001;
const float SEA_ATTENUATION_MUL_FACTOR  = 0.18;
const float SEA_CHOPPY    		= 10.0;
const float SEA_CHOPPY_MIX_VALUE	= 1.0;
const float SEA_CHOPPY_MIX_FACTOR	= 0.4;

// sea heightmap
const int HEIGHTMAP_NUM_STEPS     	= 20;

// sea direction
const float SEA_DIR_Z_SCALE 		= 0.1;

//.................................................
// 		PBR properties
//.................................................
#define FRESNEL_DEFAULT_FORMULA		0
#define FRESNEL_SCHLICK_FORMULA		1

#define FRESNEL_FORMULA			FRESNEL_DEFAULT_FORMULA

const float SEA_SPECULAR_FACTOR		= 60.0;
const float FRESNEL_POW_FACTOR		= 3.0;
const float DIFFUSE_POW_FACTOR		= 60.0;

//.................................................
//			Materials
//.................................................

struct Material
{
    float fR0;
    float fSmoothFactor;
};

//.................................................
//		       Sea Material
#if FRESNEL_FORMULA == FRESNEL_SCHLICK_FORMULA
const float SEA_R0		 	= 0.01;
const float SEA_SMOOTH_FACTOR 		= 0.1;
#elif FRESNEL_FORMULA == FRESNEL_DEFAULT_FORMULA
const float SEA_SMOOTH_FACTOR 		= 0.65;
#endif
//.................................................

//.................................................

//.................................................

const float SEA_PAUSED_SPEED		= 0.0;
const float SEA_SLOWMOTION_SPEED        = 0.5;

#if RAINBOW_WATER
const float RAINBOW_WATER_SATURATION	= 0.35;
const float RAINBOW_WATER_LIGHTNESS	= 0.1; //0.2
const float RAINBOW_WATER_SPEED 	= 0.1;
#endif

#if FANTASY_WATER_PATH
const float UV_START_X			= -5.0;
const float UV_END_X			=  5.0;
#endif

mat2 octave_matrix 			= mat2(1.6, 1.2, -1.2, 1.6);

float SEA_CURRENT_TIME			= 0.0;

//Color mixing
const float SMOOTH_MIX_Y		= -0.5; 
const float MIX_SEA_AND_SKY_FACTOR	= 0.11;
const vec3  COLOR_GRADING		= vec3(0.0, 0.0, 0.0); //vec3(0.15, 0.0, 0.0)

//..................................................................
//				Fog
//..................................................................
#define ALWAYS_FOG			0
#define NEVER_FOG			1
//#define CAN_BE_FOGGY

#define FOG_MODE			NEVER_FOG
const vec3  FOG_COLOR  			= vec3(0.15, 0.15, 0.15);
const float FOG_START 			= 0.04;
const float FOG_END 			= 500.0;
const float FOG_DENSITY 		= 0.2;
//..................................................................


vec3 hsv(float hue, float saturation, float value)
{
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(hue) + t.xyz) * 6.0 - vec3(t.w));
    return value * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), saturation);
}

float rand(float n)
{
    return fract(sin(n) * 43758.5453123);
}

float hash(vec2 p)
{	
    return rand(dot(p, vec2(12.9898, 78.233)));
}

vec2 smoothstep(in vec2 p)
{
    vec2 f = fract(p);
    return f * f * (3.0 - 2.0 * f);
}

vec3 smoothstep(in vec3 p)
{
     return p * p * 3.0 - 2.0 * mul3x(p);
}

float noise(in vec2 p) 
{
    vec2 i = floor(p);	
    vec2 sp = smoothstep(p);
    return -1.0 + 2.0 * mix(mix(hash(i + vec2(0.0, 0.0)), 
                                hash(i + vec2(1.0, 0.0)), sp.x),
                            mix(hash(i + vec2(0.0, 1.0)), 
                                hash(i + vec2(1.0, 1.0)), sp.x), sp.y);
}

float GetFragLuminance(vec3 fragColor)
{
    return dot(fragColor, vec3(0.3, 0.59, 0.11));
}

float d2y(float d)
{
    return 1.0 / (0.01 + d);
}
	
float circle(vec2 p, float r, float zoom)
{
    float d = distance(r, 0.45 * zoom);
    return d2y(1000.0 * d);
}

bool line(vec2 uv, vec2 from, vec2 to)
{
    return uv.x >= from.x && uv.x <= to.x && 
	   uv.y >= from.y && uv.y <= to.y;
}

float grid(vec2 p, float y, const float e)
{
    float a = 0.5;
    float res = 14.98;
    vec2 f = fract(p * res);
    f = step(e, f);	
    return a * y * f.x * f.y;
}

vec3 sky(vec3 e) 
{
    e.y = max(e.y, 0.0);
    vec3 ret;
    ret.x = pow(1.0 - e.y, 3.3) * 0.6; // * 2.5;
    ret.y = 1.0 - e.y - 0.3;
    ret.z = 1.8; //0.8
    return ret;
}

float sea_octave(vec2 uv, float choppy) 
{	
    #if WATER_TYPE == WAVES_WATER 
    uv += noise(uv);
    vec2 wv = 1.0 - abs(sin(uv));   
    wv = mix(wv, abs(cos(uv)), wv);
    return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
    #elif WATER_TYPE == CALM_WATER
    //Author: Angelo Logahd 
    //2019-06-29
    float noise = noise(uv);
    float x = cos(noise);
    float y = sin(noise);
    return pow(pow(abs(x * y), 0.65), choppy);
    #endif
}

float sea_geometry_map(vec3 p) 
{
    #if WATER_TYPE == WAVES_WATER
    vec2 uv = p.xz * vec2(0.85, 1.0);
	
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    
    float d = 0.0;
    float h = 0.0;    
    for (int i = 0; i < SEA_GEOMETRY_ITERATIONS; ++i) 
    {   
	#if FANTASY_WATER_PATH
	   if (uv.x > UV_START_X && uv.x < UV_END_X)
	   {
		continue;
	   }
	#endif

    	d =  sea_octave((uv + SEA_CURRENT_TIME) * freq, choppy);
    	d += sea_octave((uv - SEA_CURRENT_TIME) * freq, choppy);
        h += d * amp; 
	    
	freq *= SEA_GEOMETRY_FREQ_MUL; 
	amp  *= SEA_GEOMETRY_AMPLITUDE_MUL;
	    
        choppy = mix(choppy, SEA_CHOPPY_MIX_VALUE, SEA_CHOPPY_MIX_FACTOR);
	    
	uv *= octave_matrix; 
    }
    return p.y - h;
    #else
    return p.y;
    #endif
}

float sea_fragment_map(vec3 p) 
{
    vec2 uv = p.xz * vec2(0.85, 1.0); 
    
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;  
    float choppy = SEA_CHOPPY;
	
    float d = 0.0;
    float h = 0.0;    
    for(int i = 0; i < SEA_FRAGMENT_ITERATIONS; ++i) 
    {	    
    	d =  sea_octave((uv + SEA_CURRENT_TIME) * freq, choppy);
	d += sea_octave((uv - SEA_CURRENT_TIME) * freq, choppy); 
	h += d * amp;
	
	freq *= SEA_FREQ_MUL; 
	amp  *= SEA_AMPLITUDE_MUL;
	
	choppy = mix(choppy, SEA_CHOPPY_MIX_VALUE, SEA_CHOPPY_MIX_FACTOR);
	
	uv *= octave_matrix;
    }
    return p.y - h;
}

vec3 diffuse(vec3 normal, vec3 light, float powFactor) 
{
    float diffuse = pow(dot(normal, light) * 0.4 + 0.6, powFactor);
    return vec3(diffuse);
}

vec3 normal(vec3 p, vec3 dist) 
{
    float eps = dot2(dist) * EPSILON_NRM;
    vec3 n;
    n.y = sea_fragment_map(p); 
    n = vec3(sea_fragment_map(vec3(p.x + eps, p.y, p.z)) - n.y,
	     sea_fragment_map(vec3(p.x, p.y, p.z + eps)) - n.y,
	     eps);
    return normalize(n);
}

vec3 specular(vec3 eye, vec3 normal, vec3 light) 
{    
    float nrm = (SEA_SPECULAR_FACTOR + 8.0) / (PI * 8.0);
    float specular = pow(max(dot(reflect(eye, normal), light), 0.0), SEA_SPECULAR_FACTOR) * nrm;
    return vec3(specular);
}

float Schlick(const in vec3 vHalf, const in vec3 eye, const in Material mat)
{
    float fDot = dot(vHalf, -eye);
    fDot = clamp((1.0 - fDot), 0.0, 1.0);
    float fDotPow = pow(fDot, FRESNEL_POW_FACTOR);
    return mat.fR0 + (1.0 - mat.fR0) * fDotPow * mat.fSmoothFactor;
}

float fresnel(const in vec3 normal, const in vec3 eye, const in vec3 diffuse, const in vec3 specular, const in Material mat)
{
    vec3 vReflect = reflect(eye, normal);
    vec3 vHalf = normalize(vReflect + -eye);
    float fFresnel = Schlick(vHalf, eye, mat);
    return mix(diffuse, specular, fFresnel).x;
}

float fresnel(const in vec3 normal, const in vec3 eye, const in Material mat) 
{  
    float fresnel = 1.0 - max(dot(normal, -eye), 0.0);
    fresnel = pow(fresnel, FRESNEL_POW_FACTOR) * mat.fSmoothFactor;
    return fresnel;
}

vec3 sea(const in vec3 p, const in vec3 lightDir, const in vec3 eye, Material mat) 
{
    vec3 dist = p - SEA_ORI;  
    vec3 normal = normal(p, dist);
    vec3 diffuse = diffuse(normal, lightDir, DIFFUSE_POW_FACTOR);
    vec3 specular = specular(normal, lightDir, -eye);
	
    #if FRESNEL_FORMULA == FRESNEL_DEFAULT_FORMULA
    float fresnel = fresnel(normal, eye, mat);
    #elif FRESNEL_FORMULA == FRESNEL_SCHLICK_FORMULA
    float fresnel = fresnel(normal, eye, diffuse, specular, mat);
    #endif
    
    vec3 reflected = sky(reflect(eye, normal));    
    vec3 refracted = SEA_BASE_COLOR + diffuse * SEA_WATER_COLOR * SEA_REFRACTION_MUL_VALUE; // * -fresnel; 
    
    vec3 color = mix(refracted, reflected, fresnel);
    
    float atten = max(0.0, 1.0 - dot2(dist) * SEA_ATTENUATION) * SEA_ATTENUATION_MUL_FACTOR;
    color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * atten;
    
    color += specular;
    
    #if SUN_LIGHT
    vec3 sunDiffuseColor = max(dot(SEA_SUN_DIRECTION, normal), 0.0) * SEA_SUN_COLOR * SEA_SUN_DIFFUSE;
    vec3 reflection = normalize(reflect(-SEA_SUN_DIRECTION, normal));
    float direction = max(0.0, dot(eye, reflection));
    vec3 sunSpecular = direction * SEA_SUN_COLOR * SEA_SUN_SPECULAR;
    color = color + sunDiffuseColor + sunSpecular;
    #endif
    
    #if RAINBOW_WATER
    color += hsv((p.z * 0.3) - time * RAINBOW_WATER_SPEED, RAINBOW_WATER_SATURATION, RAINBOW_WATER_LIGHTNESS);
    #endif
	
    return color;
}

vec3 seaHeightMap(vec3 dir) 
{
    vec3 p = vec3(0.0);
    float x = 1000.0;
	
    if (sea_geometry_map(SEA_ORI + dir * x) > 0.0)
    {
	return p;
    }
    
    float mid = 0.0;
    float m = 0.0;
    float heightMiddle = 0.0;
    for(int i = 0; i < HEIGHTMAP_NUM_STEPS; ++i) 
    {
	mid = mix(m, x, 0.5); 
        p = SEA_ORI + dir * mid;                   
    	heightMiddle = sea_geometry_map(p);
	if (heightMiddle < 0.0) 
	{
            x = mid;
        } 
	else 
	{
            m = mid;
        }
    }
	
    return p;
}

vec3 fog(vec3 sceneColor, float dist)
{
    vec3 fragRGB = sceneColor;
    const float FogEnd   = FOG_END;
    const float FogStart = FOG_START;
    float distanceF = (FogEnd - dist) / (FogEnd - FogStart);
    float fogAmount = saturate(1.0 - exp(-distanceF * FOG_DENSITY));
    return mix(fragRGB, FOG_COLOR, fogAmount);
}

float rainHash(float p)
{
    vec2 p2 = fract(vec2(p) * vec2(0.16632, 0.17369));
    p2 += dot(p2.xy, p2.yx + 19.19);
    return fract(p2.x * p2.y);
}

float rainNoise(in vec2 x)
{
    vec2 p = floor(x);
    vec2 f = smoothstep(x);
    float n = p.x + p.y * 57.0;
    return mix(mix(rainHash(n +  0.0), rainHash(n +  1.0), f.x),
               mix(rainHash(n + 57.0), rainHash(n + 58.0), f.x), f.y);
}

float rain(vec2 uv, vec2 xy)
{	
    float travelTime = (time * 0.7) + 0.1;
	
    float x1 = (0.5 + xy.x + 1.0) * 0.3;
    float y1 = 0.01;
    float x2 = travelTime * 0.5 + xy.x * 0.2;
    float y2 = travelTime * 0.2;
	
    vec2 st = uv * vec2(x1, y1) + vec2(x2, y2);
    
    float rain = 0.1;
    float f = rainNoise(st * 200.5) * rainNoise(st * 125.5);  
    f = clamp(pow(abs(f), 20.0) * 1.5 * (rain * rain * 125.0), 0.0, 0.1);
    return f;
}

#if RAINBOW
vec3 rainbowColor(in vec3 ray_dir) 
{ 
    RAINBOW_DIR = normalize(RAINBOW_DIR);   
		
    float theta = degrees(acos(dot(RAINBOW_DIR, ray_dir)));
    vec3 nd = clamp(1.0 - abs((RAINBOW_COLOR_RANGE - theta) * 0.2), 0.0, 1.0);
    vec3 color = smoothstep(nd) * RAINBOW_INTENSITY;
    
    return color * max((RAINBOW_BRIGHTNESS - 0.75) * 1.5, 0.0);
}

void rainbowSetup()
{
    rainbow_pos =  RAINBOW_POS;
    rainbow_w   = -normalize(-rainbow_pos);
    rainbow_up  =  normalize(cross(rainbow_w, up));
    rainbow_vertical = normalize(cross(rainbow_up, rainbow_w));
}

vec3 rainbow()
{
     vec2 uv = gl_FragCoord.xy / resolution.xy;
     vec2 p = (-1.0 + 2.0 * uv) * vec2(resolution.x / resolution.y, 1.0);

     vec3 color = vec3(0.0);
     if (p.y >= RAINBOW_START_Y)
     {
	 vec2 uv = gl_FragCoord.xy / resolution.xy;
	
    	 rainbowSetup();

     	 vec3 dir = normalize(vec3(p, 0.0) - vec3(0.0, 0.0, -1.5));
     	 vec3 wdDir = normalize(dir.x * rainbow_up + dir.y * rainbow_vertical - dir.z * rainbow_w);
	     
	 color += rainbowColor(wdDir);
     }	
     return clamp(color, 0.0, 1.0);  
}
#endif

//.......................................................................................
//					Night weathers
//.......................................................................................
#if STAR_SKY
float starHash(float n) 
{
    return fract((1.0 + cos(n)) * 15.92653) * 1.8;
}

vec3 star(in vec2 uv) 
{
    vec2 p = uv * 0.02; //To avoid flickering
    if (p.y > 0.001)
    {
	float starValue = fract(starHash(p.x * 37.0) + starHash(p.y * 80.0));
	if (starValue > STAR_THRESHOLD) 
	{
	    vec3 starColor = vec3(pow((starValue - STAR_THRESHOLD) / 0.02, 25.0));
	    return starColor * 0.3; // * (1.0 - brightness);
	}  
    }
    return vec3(0.0);
}
#endif
//.......................................................................................

#if MOON
vec3 moon()
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    uv.x *= -1.0; //mirror where the moon is placed in x
    float moonlight = MOON_FOG_LIGHT_STRENGTH + (MOON_LIGHT_STRENGTH / distance(uv, MOON_F)) * MOON_SCALE;
    vec3 color = (MOON_BASE_COLOR + MOON_COLOR_GRADING) * moonlight;
    return color;
}
#endif

vec3 sun()
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    uv.x *= -1.0;
    float sunlight = 0.04 + (0.01 / distance(uv, vec2(0.0, 0.0))) * 5.0;
    vec3 color = (vec3(1.0, 1.0, 1.0)) * sunlight;
    return color;
}

#if HDR
#if TONEMAP_TYPE == FILMIC_TONEMAP
vec3 Uncharted2Tonemap(vec3 x)
{
   return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}
#endif

vec3 Tonemap(vec3 color)
{
    #if TONEMAP_TYPE == LINEAR_TONEMAP
    color *= vec3(TONEMAP_EXPOSURE);
    #endif
    #if TONEMAP_TYPE == EXPONENTIAL_TONEMAP
    color = 1.0 - exp2(-color * TONEMAP_EXPOSURE);
    #endif
    #if TONEMAP_TYPE == REINHARD_TONEMAP
    color *= TONEMAP_EXPOSURE;
    color = color / (1.0 + color);
    #endif
    #if TONEMAP_TYPE == FILMIC_TONEMAP    
    color *= TONEMAP_EXPOSURE;
    vec3 tonemapedColor = Uncharted2Tonemap(TONEMAP_EXPOSURE_BIAS * color);
    vec3 whiteScale = 1.0 / Uncharted2Tonemap(vec3(W));
    color = tonemapedColor * whiteScale;
    #endif
   
    return color;
}
#endif

void main(void) 
{
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
	
    vec2 xy = gl_FragCoord.xy / resolution.xy;
	
    float intensity = INTENSITY;
    #if DAY_AND_NIGHT
    	intensity *= clamp(sin(time * DAY_AND_NIGHT_TIME) + DAY_AND_NIGHT_MIN_BRIGHTNESS, 
			   DAY_AND_NIGHT_MIN_BRIGHTNESS, 
			   DAY_AND_NIGHT_MAX_BRIGHTNESS);
    #endif
	
    EPSILON_NRM = 0.5 / resolution.x;
	
    #if SIMULATE_MODE == SIMULATE
	SEA_CURRENT_TIME = time * SEA_SPEED;
    #elif SIMULATE_MODE == SIMULATE2x
	SEA_CURRENT_TIME = time * SEA_SPEED * 2.0;
    #elif SIMULATE_MODE == SIMULATE3x
	SEA_CURRENT_TIME = time * SEA_SPEED * 3.0;
    #elif SIMULATE_MODE == SIMULATE4x
	SEA_CURRENT_TIME = time * SEA_SPEED * 4.0;
    #elif SIMULATE_MODE == SIMULATE5x
	SEA_CURRENT_TIME = time * SEA_SPEED * 4.0;
    #elif SIMULATE_MODE == PAUSED
	SEA_CURRENT_TIME = 0.0;
    #elif SIMULATE_MODE == SLOW_MOTION
	SEA_CURRENT_TIME = time * SEA_SLOWMOTION_SPEED;
    #endif
 
    #if FLIP_WATER_AND_SKY
    vec3 dir = normalize(vec3(-uv.xy, -1.0));
    #else
    vec3 dir = normalize(vec3(uv.xy, -1.0));
    #endif
    dir.z += length(uv) * SEA_DIR_Z_SCALE;
    dir = normalize(dir);
    	
    //Will not be here
    Material mat;
    #if FRESNEL_FORMULA == FRESNEL_SCHLICK_FORMULA
    mat.fR0 = SEA_R0;
    #endif
    mat.fSmoothFactor = SEA_SMOOTH_FACTOR;
	
    vec3 p = seaHeightMap(dir);
    vec3 lightDir = vec3(0.0);
    
    float smothMixFactor = pow(smoothstep(0.0, SMOOTH_MIX_Y, dir.y), MIX_SEA_AND_SKY_FACTOR);
    
    vec3 sky = sky(dir);
    vec3 sea = sea(p, lightDir, dir, mat);
	
    vec3 color = mix(sky, sea, smothMixFactor); 
    
    #if FOG_MODE != NEVER_FOG
    color = fog(color, dir.z);
    #endif
    
    #if RAIN
    vec3 rainColor = RAIN_BASE_COLOR * RAIN_COLOR_INTENSITY;
    float rainFactor = rain(uv, xy);
    color = mix(color, rainColor, rainFactor);
    #endif
    
    color = color * intensity + COLOR_GRADING;

    #if STAR_SKY
    color += star(uv);
    #endif
    
    #if RAINBOW
    color += rainbow();
    #endif

    #if MOON
    color += moon();
    #endif
	
    color += sun();
	
    color = color * CONTRAST + 0.5 - CONTRAST * 0.5;
	
    #if COLOR_GRADING_FILTER
    vec4 filteredFinal = COLOR_GRADING_G * COLOR_GRADING_WEIGHT * vec4(COLOR_GRADING_COLOR, 1.0);
    vec4 realFinal = vec4(color, 1.0) * COLOR_GRADING_REAL_WEIGHT;
    
    #if   COLOR_GRADING_BLEND_MODE == ADD
    color = vec3(realFinal) + vec3(filteredFinal);
    #elif COLOR_GRADING_BLEND_MODE == SUBTRACT
    color = vec3(realFinal) - vec3(filteredFinal);
    #elif COLOR_GRADING_BLEND_MODE == MULTIPLY
    color = vec3(realFinal) * vec3(filteredFinal);
    #elif COLOR_GRADING_BLEND_MODE == DIVIDE
    color = vec3(realFinal) / vec3(filteredFinal);
    #endif
	
    #endif

    #if !HDR
    color = saturate(color);
    #endif
	
    #if APPLY_LUMINANCE
    float luminance = GetFragLuminance(color);
    luminance = saturate(luminance);
    vec3 resLuminance = vec3(length(color.r * luminance), 
			     length(color.g * luminance), 
			     length(color.b * luminance));

    color.rgb = resLuminance;
    #endif
	
    #if SEPIA_FILTER
    float greyScale = GetFragLuminance(color);
    color = greyScale * SEPIA_COLOR * SEPIA_INTENSITY;
    #endif
	
    #if VIGNETTE_FILTER
    color *= vec3(VIGNETTE_COLOR) * saturate(1.0 - length(uv / VIGNETTE_ZOOM)) * VIGNETTE_EXPOSURE;
    #endif

    #if HDR && APPLY_TONEMAP
    color = Tonemap(color);
    #endif
	
    #if APPLY_GAMMA_CORRECTION
    color = pow(color, vec3(1.0 / GAMMA));
    #endif
	
    gl_FragColor = vec4(color, 1.0);
}