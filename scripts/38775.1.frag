#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iGlobalTime time
#define iMouse mouse.xy*resolution.xy
#define iResolution resolution.xy

// https://www.shadertoy.com/view/4tKXWt#

#define MAX 150
#define EPSILON 0.01
#define L -4.0
#define MAXWAVE 3.0
#define WATERN vec3(0, 1, 0)
#define WATERC vec4(0, 0.2, 0.3, 1)
#define MAX_MARCH_DIST 200.0
#define WATERI 1.3333
#define LIGHTDIR vec3(-1, -1, -1)
#define BALLDIFFUSE vec4(0.5, 0.2, 0.1, 1.0)
#define BALLSPECULAR 0.2
#define EXTRUDE_ITERATIONS 50
#define SKY_COL vec4(0.5, 0.8, 1.0, 1.0)
#define PI 3.14159

vec4 textureLod_(sampler2D s, vec2 lookup, float lod) {
return vec4(1.0);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453)/distance(co,co+0.5);
}

float hash(vec2 uv){
	return rand(uv+PI*0.25);
    uv.xy *= vec2(12.9898,78.233);
    vec2 lookup = vec2(sin(uv.x), sin(uv.y));
    return sin((-distance(lookup,uv/resolution.xy))); //(dot(lookup,lookup)*0.5678-dot(uv,uv)+PI*0.25)*2.0 - 1.0; //textureLod_(iChannel0, lookup, 0.0).x - 1.0;
}

float noise(vec2 uv, float oct){
    vec2 tl = floor(uv / oct) * oct;
    vec2 tr = tl + vec2(oct, 0.0);
    vec2 bl = tl + vec2(0.0, oct);
    vec2 br = tl + vec2(oct, oct);
    
    vec2 t = (uv - tl) / oct;
    t = t*t*(3.0 - 2.0 * t);
    
    return oct * mix(mix(hash(tl), hash(tr), t.x), mix(hash(bl), hash(br), t.x), t.y);
}

float height(vec2 uv, int octaves){
    float div = 0.0;
    float start = 4.0;
    float final = 0.0;
    
    vec2 direction[8];
    direction[0] = vec2(1.0, 1.0);
    direction[1] = vec2(-1.0, 1.0);
    direction[2] = vec2(1.0, 1.0);
    direction[3] = vec2(1.0, -1.0);
    direction[4] = vec2(1.0, 1.0);
    direction[5] = vec2(-1.0, 1.0);
    direction[6] = vec2(1.0, 1.0);
    direction[7] = vec2(1.0, -1.0);
    
    int dir_idx = 0;
    
    for(int i = 0; i < 8; ++i){
	if ( i > octaves ) break;
    	div += start;
        
        float offset_mul = (start + 2.0) / 2.0;
        
        float oct_val = noise(uv + (iGlobalTime * offset_mul * direction[i]), start);
        
        final += oct_val;
        
        start /= 2.0;
	if ( 4 <= dir_idx ) dir_idx = 0;
//        dir_idx = mod(dir_idx,4.0);
        
    }
    return final / div;
}

float terrain(vec3 p){
    vec2 center = vec2(0.0, 20.0);
    
    float oct = 16.0;
    float div = 0.0;
    float final = 0.0;
    
    
    for(int i = 0; i < 8; ++i){
    	div += oct;
        
        final += abs(noise(p.xz, oct));

        oct /= 2.0;
    }
    
    float mag = 10.0 / max(1.0, min(100.0, sqrt(length(p.xz - center)) ) );
    
    float h = (final / div) * mag;
    
    return p.y - (h - 7.0);
}

float circleSDF(vec3 p, vec3 c, float rad){
	return length(p - c) - rad;
}

float scene(vec3 p, out int object){
    object = -1;
    
    float d = terrain(p);
    if(d <= EPSILON){
    	object = 0;
    }
    return d;
}

vec3 normal(vec3 p, float d){
	vec3 px = vec3(p.x + EPSILON, p.yz);
    vec3 py = vec3(p.x, p.y + EPSILON, p.z);
    vec3 pz = vec3(p.xy, p.z + EPSILON);
    
    int holder;
    
    vec3 offset_d = vec3(scene(px, holder), scene(py, holder), scene(pz, holder));
    
    return normalize(offset_d - d);
}

bool march(vec3 dir, vec3 origin, out vec3 final_sample_pt, out float d, out int object){
	float rl = scene(dir + origin, object);
    
    for(int i = 0; i < MAX; ++i){
        final_sample_pt = dir * rl + origin;
        d = scene(final_sample_pt, object);
        
        if(d < EPSILON){
            return true;
        }

        rl += d;
        
        if(rl > MAX_MARCH_DIST){
            break;
        }
    }
    
    return false;
}

vec3 refractRay(vec3 ray, vec3 normal, float eta){
    float k = 1.0 - eta * eta * (1.0 - dot(normal, ray) * dot(normal, ray));
    if (k < 0.0)
        return vec3(0.0, 0.0, 0.0);
    else
        return normalize(eta * ray - (eta * dot(normal, ray) + sqrt(k)) * normal);
    return refract(normal, ray, eta);
}



void marchScene(vec3 dir, vec3 origin, out vec3 final_sample_pt, out float d, out vec4 c){
    int object;
    bool hit_scene = march(dir, origin, final_sample_pt, d, object);
        
    if(hit_scene)
    {
        vec3 n = normal(final_sample_pt, d);
        vec3 light_dir = normalize(LIGHTDIR);
        
		float dp = dot(normal(final_sample_pt, d), -light_dir);
        vec4 scene_diffuse = dp * BALLDIFFUSE;
        
        vec3 brdf = reflect(dir, n);
        float s = max(0.0, pow(dot(brdf, light_dir), 4.0));
        vec4 specular = BALLSPECULAR * vec4(s, s, s, 0.0);
        
        c = scene_diffuse + specular;
    }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float smaller = min(iResolution.x, iResolution.y);
    float x_half = iResolution.x / (smaller * 2.0);
    float y_half = iResolution.y / (smaller * 2.0);
    
    vec3 origin = vec3(0.0, 0.0, 0.0);
    
    vec3 ray = normalize(vec3(fragCoord.xy / smaller - vec2(x_half, y_half), 1.0));
    
    float sky_t = fragCoord.y / smaller - y_half;
    sky_t = sky_t * sky_t * (3.0 - 2.0 * sky_t);
    
    fragColor = sky_t * SKY_COL + (1.0 - sky_t) * vec4(1.0, 1.0, 1.0, 1.0);
    
    vec3 final;
    float d;

    marchScene(ray, origin, final, d, fragColor);
    
    float timer = iGlobalTime;
    
    if(final.y < L + MAXWAVE){
        float level = L + MAXWAVE;
        float ray_t = dot(vec3(0, level, 0), WATERN) / dot(ray, WATERN);
        vec3 intersect = ray_t * ray;
        
        vec2 sample_pos;
        float b;
        
        for(int i = 0; i < EXTRUDE_ITERATIONS; ++i){
            sample_pos = (intersect.xz / 2.0);
            b = height(sample_pos, 10) * MAXWAVE;
            
            float dif = (level - L) - b;
            
            vec3 new_ray = (ray_t + dif) * ray;
            
			level -= dif / 10.0;
            
            float new_ray_t = dot(vec3(0, level, 0), WATERN) / dot(ray, WATERN);
        	intersect = new_ray_t * ray;
            
        }
        
        
        if(length(intersect) > length(final) && length(intersect) < 100.0){
            return;
        }
        
        float offset = 0.1;
        float west = height(sample_pos + vec2(-offset, 0.0), 10);
        float east = height(sample_pos + vec2(offset, 0.0), 10);
        float north = height(sample_pos + vec2(0.0, offset), 10);
        float south = height(sample_pos + vec2(0.0, -offset), 10);
        
        vec3 n = normalize(vec3(east - west, 2.0 * offset, north - south));
        
        vec3 light_dir = normalize(LIGHTDIR);
        float acc_water = length(intersect - final);
        
        vec3 brdf = reflect(ray, n);
        
        //waterc
        float dp = dot(light_dir, brdf);
        float dp2 = dot(-light_dir, brdf);
        float specular = max(0.0, pow(dp, 5.0));
        fragColor = 0.1 * vec4(specular, specular, specular, 1.0) + 0.5 * WATERC * min(1.0, max(0.0, dp2) + 0.5);
        
        vec3 rp;
        float rd;
        vec4 reflect_c;
        
        marchScene(brdf, intersect, rp, rd, reflect_c);
        
        if(rp.y < intersect.y){
        	reflect_c = vec4(0, 0, 0, 1);
        }

        vec3 refp;
        float refd;
        vec3 refract_ray = refractRay(ray, n, 1.0 / WATERI);
        vec4 refract_c;
        
        marchScene(refract_ray, intersect, rp, rd, refract_c);
        refract_c *= 1.0 / (min(sqrt(max(1.0, acc_water)), 5.0) );
        
        float fresnel = (pow(clamp(dot(n, -ray), 0.0, 1.0), 2.0) + 0.5) / 1.5;
        
        fragColor += mix(reflect_c, refract_c, 1.0 - fresnel);
    }
    fragColor = clamp( fragColor * 2.5 ,0.0,1.0);
}

void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy );
	
}