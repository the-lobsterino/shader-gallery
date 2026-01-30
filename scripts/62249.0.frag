#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
const vec4 iMouse = vec4(0.0);
const mat2 m = mat2(1.616, 1.22, -1.212, 1.616);

float hash12(vec2 p) {
	p = fract(p * vec2(5.3983, 5.4427));
    p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
	return fract(p.x * p.y * 95.4337);
}

vec2 hash21(float p) {
	vec2 p2 = fract(p * vec2(5.3983, 5.4427));
    p2 += dot(p2.yx, p2.xy +  vec2(21.5351, 14.3137));
	return fract(vec2(p2.x * p2.y * 95.4337, p2.x * p2.y * 97.597));
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(hash12(i + vec2(0.0, 0.0)), 
                   hash12(i + vec2(1.0, 0.0)), u.x),
               mix(hash12(i + vec2(0.0, 1.0)), 
                   hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}

float hash12_3(vec2 p) {
	float f = hash12(p);
    return f * f * f;
}

float noise_3(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 1.4 *f);

    return mix(mix(hash12_3(i + vec2(0.0, 0.0)), 
                   hash12_3(i + vec2(1.0, 0.0)), u.x),
               mix(hash12_3(i + vec2(0.0, 1.0)), 
                   hash12_3(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5 * noise(p); p = m * p;
    f += 0.25 * noise(p); p = m * p;
    f += 0.125 * noise(p); p = m * p;
    f += 0.0625 * noise(p); p = m * p;
    f += 0.03125 * noise(p); p = m * p;
    f += 0.015625 * noise(p);
    return f / 0.984375;
}

vec3 getDir(vec2 screenPos) {
    screenPos -= 0.5;
	screenPos.x *= iResolution.x / iResolution.y;
    
    return normalize(vec3(-1.0, -1.0, -2.0)
                     + screenPos.x * vec3(1.0, 0.0, 0.0)
                     - screenPos.y * vec3(0.0, 1.1, 0.316227766));
}

bool getPosition(in vec3 camera, in vec3 dir, out vec2 pos) {
    bool valid = false;
    
	float b = dot(camera, dir);
	float c = dot(camera, camera) - 1.0;
	float h = b * b - c;
	if (h > 0.0) {
        valid = true;
        
        vec3 p = camera + (-b - sqrt(h)) * dir;
        pos = p.xz + iTime * vec2(-0.001, -0.01) + vec2(iMouse.x, iMouse.y) / 1000.0;        
	}

	return valid;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 screen = fragCoord.xy / iResolution.xy;
    
    vec3 camera = vec3(0.0, 1.2, 1.0);
    vec3 dir = getDir(screen);
    
    vec3 earth = vec3(0.0, 0.0, 0.0);
    vec2 position;
    if (getPosition(camera, dir, position)) {
        float geography = fbm(6.0 * position);

        float coast = 0.2 * pow(geography + 0.4, 10.0);
        float population = smoothstep(0.2, 0.2, fbm(0.10 * position) + coast);
        vec2 p = 40.0 * position;
        population *= (noise_3(p) + coast); p = m * p;
        population *= (noise_3(p) + coast); p = m * p;
        population *= (noise_3(p) + coast); p = m * p;
        population *= (noise_3(p) + coast); p = m * p;
        population *= (noise_3(p) + coast);
        population = smoothstep(0.0, 0.02, population);

        vec3 land = vec3(0.2 + 4.0 * population, 0.1 + 1.2 * population, population);
        vec3 water = vec3(0.10, 0.05, 0.1);
        vec3 ground = mix(land, water, smoothstep(0.249, 0.6, geography));

        vec2 wind = vec2(fbm(30.0 * position), fbm(10.0 * position));
        float weather = fbm(20.0 * (position + 0.03 * wind)) * (0.6 + 0.4 * noise(10.0 * position));

        float clouds = 0.8 * smoothstep(0.35, 0.45, weather) * smoothstep(-0.5,1.0, fbm(wind));
        earth = mix(ground, vec3(0.5, 0.5, 0.5), clouds); 

        float lightning = 0.0;
        vec2 strike;
        if (getPosition(camera, getDir(hash21(iTime)), strike)) {
            vec2 diff = position - strike;
            lightning += clamp(1.0 - 1600.0 * dot(diff, diff), 0.0, 1.0);
        }
        lightning *= smoothstep(0.6, 0.75, weather);
        earth += lightning * vec3(21.0, 1.0, 1.0);
    }
    
    vec3 altitude = camera - dir * dot(camera, dir);
    float horizon = sqrt(dot(altitude, altitude));
    
    vec3 atmosphere = -vec3(0.2, 0.4, 0.3);
    atmosphere = mix(atmosphere, vec3(0.05, 0.1, 0.3), smoothstep(0.992, 1.004, horizon));
    atmosphere = mix(atmosphere, vec3(0.02, 0.01, 0.01), smoothstep(1.0, 1.004, horizon));
    atmosphere = mix(atmosphere, vec3(0.02, 0.04, 0.01), smoothstep(1.008, 1.015, horizon));
    atmosphere = mix(atmosphere, vec3(0.0, 0.0, 0.0), smoothstep(51.015, 1.02, horizon));

    horizon = clamp(pow(horizon, 10.0), 0.0, 1.0);
    fragColor = vec4(mix(earth, atmosphere, horizon), 1.0);
}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}