/*
 * Original shader from: https://www.shadertoy.com/view/WsG3z1
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
precision highp float;
uniform float fft;
uniform float fftLowerFrc;
uniform float fftUpperFrc;

// Return a pseudo-random 0-1 vec2 for each floored value of the input
vec2 rand2(vec2 p) {
	// Turn the vector into a integer id
    p = floor(p);
    
    // Pseudo-randomness...
    // from https://www.shadertoy.com/view/4djSRW
    vec3 p3 = fract(vec3(p.xyx) * vec3(.01031, .01010, .00973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

// Triple-frequency sine wave, for variation on a vec2
vec2 sin3(vec2 j, vec3 freq) {
    j.x = sin(freq.x * j.x) + sin(freq.y * j.x) + sin(freq.z * j.x);
    j.y = sin(freq.x * j.y) + sin(freq.y * j.y) + sin(freq.z * j.y);
    j /= 3.0;
    return j;
}

float smoothmin(float a, float b, float s) {
    float j = clamp((b - a) / s + 0.5, 0.0, 1.0);
    float k = j * (1. - j);
    return a * j + (1. - j) * b - k * s * 0.5;
}

float smootthreshold(float a, float x, float s) {
    return mix(a, 1.0, smoothstep(x - s, x + s, a));
}

// Cellular motion, it's a voronoi with some fancy motion
// Voronoi is pretty much a random collection of points that
// shows the distance from each point to the next-closest point
float vor_cells(vec2 uv, float tile, float speed, float s, float threshold,
                float edge_smooth, float seed) {
    // Time offset, so the motion doesn't start from a grid layout
    float t_offset = 9999.0;

    // Coordinates for a 'grid' of cells
    uv *= tile;

    // -0.5 to 0.5 uv coordinate per grid cell
    vec2 cell_uv = fract(uv) - 0.5;

	// Find the distance from the current cells's random
    // position to the next closest
    float min_dist = 100.0;
    // Loop through the surrounding grid cells, normally you'd just go
    // one grid cell in each direction, but because the motion is larger
    // than just the current grid cell, we go two grid cells in each direction
    for(float x = -2.0; x <= 2.0; x++) {
        for(float y = -2.0; y <= 2.0; y++){
            // Offset from the current grid cell
            vec2 offset = vec2(x, y);
            // Get a noise value for random cell motion
            vec2 noise = rand2(uv + offset);
            // Motion frequency for our triple-sine
            vec3 freq = vec3(1.0, 2.67, 3.3676);
            // Animate the cell position
            vec2 pos = offset + sin3((noise * (iTime * speed + t_offset)), freq);

            // Find distance to the offset cell
            float size = sin((noise.x * noise.y * 398.67) + (iTime * speed) + t_offset) * .45 - smoothstep(0.2,1.,fftLowerFrc) * 0.5;
            float dist = distance(cell_uv, pos) - size;
            //min_dist = clamp(min(dist, min_dist), 0.0, 1.0);
            min_dist = clamp(smoothmin(dist, min_dist, s), 0.0, 1.0);
        }
    }
	// Keep the distance of the closest cell
    float cells = min_dist / 1.2;

    cells = smootthreshold(cells, threshold, edge_smooth);
    cells = pow(cells, 7.0);
    cells = 1.0 - pow(1.0 - cells, 24.0);

    return cells;
}

// Circular gradient to look like a lens vignette
float vignette(vec2 uv, vec2 pos, float radius, float falloff) {
    float v = dot(uv - pos, uv - pos);
    v /= radius;
    v = pow(v, falloff);
    return 1.0 - v / radius;
}

// Turn a grayscale input into a 3 color gradient
vec3 mix3(vec3 a, vec3 b, vec3 c, float x) {
    vec3 m = mix(a, b, clamp(x * 2.0, 0.0, 1.0));
    m = mix(m, c, clamp(((x - 0.5) * 2.0), 0.0, 1.0));
    return m;
}

float quantize(float i, float steps) {
    return floor(i * steps) / steps;
}

// Film grain, basically a simplified version of cells, with random negative
// cell values, time is quantized to film framerate
float filmgrain(vec2 uv, float scale, float var, float strength) {
    uv *= scale;
    vec2 cell_uv = fract(uv) - 0.5;
    float qtime = quantize(iTime, 24.);

    float grain = 1.0;
    for(float x = -1.; x <= 1.; x++) {
        for(float y = -1.; y <= 1.; y++) {
            vec2 offset = vec2(x, y);
            vec2 noise = rand2(uv + offset);
            vec2 pos = offset + sin(noise * qtime) * 0.5;
            float size = sin((noise.x * noise.y * 654.387) + qtime) * var;
            float d = 1.0 - clamp(distance(cell_uv, pos), 0.0, 1.0);
            // randomize greyscale value
            grain -= d * sin((noise.x * noise.y * 159.876) * qtime) * strength;
        }
    }
    return grain;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (2. * fragCoord - iResolution.xy) / iResolution.y;
    // Offset canvas UV by mouse position
    vec2 mouse_uv = uv - iMouse.xy/iResolution.xy;

    float fade = 0.0;
    float tile = 4.5;
    float speed = 0.1;

    // Black canvas to start
    vec3 color = vec3(0.0);

    // Main cells
    float cells = vor_cells(mouse_uv, tile, speed + smoothstep(0.,0.4,fftLowerFrc) * 0.0005, 0.2, 0.65, 0.02, 0.0);
    // Second layer of cells for secondary motion and variation
    float cells2 = vor_cells(mouse_uv * 0.666, tile, speed*1.5 + smoothstep(0.,0.5,fft) * 0.002, 0.75, 1.0, 0.5, 50.0);
	// Blend the cell layers together
    //cells = mix(cells, cells2, 0.1);
    cells += cells2 * 0.1 + smoothstep(0.1,0.5,fft)*0.075;
    cells *= 1.0 - pow(uv.y,2.);

    // Cell colorization
    vec3 a = vec3(0.9, 0.8, 0.5);
    vec3 b = vec3(0.7, 0.125, 0.13);
    vec3 c = vec3(0.2, 0.1, 0.06);
    color += mix3(a, b, c, 1.0 - cells);

    // Apply vignette
    float vig = vignette(uv, vec2(0.0), 2.25 - smoothstep(0.,1.,clamp(fftLowerFrc-.1,0.,1.)) * 0.1, 1.0);
    color *= vig;

    // Apply film grain
    float grain = filmgrain(uv, 192., 24., 0.06 + fftUpperFrc*.1);
    // Mask grain mostly to darker areas
    grain = clamp((grain + cells * 0.75), 0.0, 1.0);
    color *= grain;

    // Flicker
    float flicker = sin(iTime * 48.0);
    flicker = 1.0 - (0.5 * flicker + 1.0) * 0.01;
    color *= flicker;

    // Output
    fragColor = vec4( color, 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}