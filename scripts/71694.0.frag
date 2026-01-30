/*
 * Original shader from: https://www.shadertoy.com/view/WtGBWz
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

// Emulate some GLSL ES 3.x
int int_mod(int a, int b)
{
    return (a - (b * (a/b)));
}

// --------[ Original ShaderToy begins here ]---------- //
#define NUM_OCTAVES 3
#define SPEED_SCALE 0.2

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83 - one of the best gists to exist
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

// Rotation matrix
const mat2 rot_mat = mat2( 0.80,  0.60, -0.60,  0.80 );

void rotate_point(inout vec2 p) {
    // This line just generates a random value between 2.01 and 2.04
    float factor = 2.01 + float(int_mod(int(rand(p) * 100.0),4)) * 0.01;
    p *= (rot_mat * 2.04);
}
float calculate_iteration(inout float frequency, inout float amplitude, vec2 p, float addend) {
    float f = amplitude * noise(frequency * p + addend);
    amplitude *= 0.5;
    frequency *= 2.0;
    return f;
}
float fbm(vec2 p) {
    float amplitude = 0.5;
    float frequency = 0.5;
    float f = 0.0;
    
    for (int i = 0 ; i < NUM_OCTAVES; i++) {
        if (i == 0) {
            f += calculate_iteration(frequency, amplitude, p, iTime * SPEED_SCALE);
        } else {
            f += calculate_iteration(frequency, amplitude, p, sin(iTime * SPEED_SCALE + noise(p)));
        }
        rotate_point(p);
    }
    
    return f / 0.96975;
}

// A very simple warping
float warp(vec2 p, int depth) {
    float val = fbm(p);
    for (int i = 0; i < 2; i++) val = fbm(p + val);
    return val;
}

vec3 calculate_normal(vec2 p) {
    float d = warp(p, 2);
    vec2 e = vec2(0.01, 0);
    
    vec3 n = d - vec3(
        warp(p - e.xy, 2),
        2.0 * e.x,
        warp(p - e.yx, 2)
    );
    
    return normalize(n);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    float density = warp(uv, 2);
    
    vec3 col = vec3(0.0);
    // Apply Density based color-gradient from a lagoon blue
    col = mix(vec3(100.0, 100.0, 100.0) / 255.0, vec3(225.0, 245.0, 245.0) / 255.0, smoothstep(0.0, 0.15, density));
    col = mix(col, vec3(200.0, 200.0, 200.0) / 255.0, smoothstep(0.05, 0.3, density));
    col = mix(col, vec3(255.0, 215.0, 135.0) / 255.0, smoothstep(0.3, 0.5, density));
    col = mix(col, vec3(255.0, 255.0, 255.0) / 255.0, smoothstep(0.5, 0.7, density));
    
    col = 1.0 - col;
    
    // Lighting
    vec3 n = calculate_normal(uv);
    vec3 l = vec3(0.9, -0.02, -0.4);
    // vec3 lig = normalize(l - vec3(uv.xy, density));
    vec3 lig = l;
    
    float diffuse_intensity = 0.3;
    float diffuse = clamp(diffuse_intensity + (1.0 - diffuse_intensity) * dot(n, lig), 0.0, 1.0);

    vec3 i = vec3(0.85,0.90,0.95);
    vec3 bdrf = clamp(i * (n.y * 0.5 + 0.5) + (1.0 - i) * diffuse, 0.8, 1.0);
    
    col *= bdrf;
    col = vec3(1.0)-col;
    col = col*col;
    col *= vec3(1.2,1.2,1.2);
    col = clamp(col, 0.0, 1.0);
    
    fragColor = vec4(vec3(col), 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}