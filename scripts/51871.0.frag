#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float iTime;
vec3  iResolution;

const vec3 color = vec3(0.1, 0.5, 0.3);
const float pi = 3.14159265359;
const float triangleScale = 0.816497161855865; // ratio of edge length and height

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 getTriangleCoords(vec2 uv) {
    uv.y /= triangleScale;
    uv.x -= uv.y / 2.0;
    vec2 center = floor(uv);
    vec2 local = fract(uv);
    
    center.x += center.y / 2.0;
    center.y *= triangleScale;
    
    if (local.x + local.y > 1.0) {
    	local.x -= 1.0 - local.y;
        local.y = 1.0 - local.y;
        center.y += 0.586;
        center.x += 1.0; 
    } else {
        center.y += 0.287;
    	center.x += 0.5;
    }
    
    return vec4(center, local);
}

vec4 getLoader(vec4 triangle) {
    if (length(triangle.xy) > 1.6) {
        return vec4(0.0);
    }
    
    float angle = atan(triangle.x, triangle.y);
    float seed = rand(triangle.xy);
    float dst = min(triangle.z, min(triangle.w, 1.0 - triangle.z - triangle.w)) * 15.0;
    float glow = dst < pi ? pow(sin(dst), 1.5) : 0.0;
	
    return vec4(mix(color, vec3(1.0), glow * 0.07), pow(0.5 + 0.5 * sin(angle - iTime * 6.0 + seed), 2.0));
}

float getBackground(vec4 triangle) {
    float dst = min(triangle.z, min(triangle.w, 1.0 - triangle.z - triangle.w)) - 0.05;
	
    if (triangle.y > 1.9 || triangle.y < -2.4 || dst < 0.0) {
        return 0.0;
    }

    float value = pow(0.5 + 0.5 * cos(-abs(triangle.x) * 0.4 + rand(triangle.xy) * 2.0 + iTime * 4.0), 2.0) * 0.08;    
    return value * (dst > 0.05 ? 0.65 : 1.0);
}

vec3 getColor(vec2 uv) {
    uv *= 2.0 / iResolution.y;
    
    vec3 background = vec3(getBackground(getTriangleCoords(uv * 6.0 - vec2(0.5, 0.3))));
 	vec4 loader = getLoader(getTriangleCoords(uv * 11.0));
    
    vec3 color = mix(background, loader.rgb, loader.a);
    return color;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord ) {
    fragCoord = fragCoord - 0.5 * iResolution.xy;
	fragColor.rgb = 0.25 * (getColor(fragCoord)
                            + getColor(fragCoord + vec2(0.5, 0.0))
                            + getColor(fragCoord + vec2(0.5, 0.5))
                            + getColor(fragCoord + vec2(0.0, 0.5)));
}

void main() {
	iResolution = vec3(resolution.x, resolution.y, 0);
	iTime = time;	
	mainImage(gl_FragColor, gl_FragCoord.xy);
}