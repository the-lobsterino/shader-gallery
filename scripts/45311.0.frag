#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


#define VIN_C vec3(.05, .0, .15)
#define SKY_C vec3(0.529, 0.808, 0.922)


/*
    Get UV where 0->1 in x and y describe a square in the center
*/
void get_square_uv(out vec2 uv, out vec2 square_uv) {
    vec2 adjusted_resolution = resolution.xy;
    // Adjust the bounds so we are dealing with square
    // resolution, dictated by whichever is smaller
    // width or height
    float x_aspect = resolution.y/resolution.x;
    if(x_aspect > 1.0) {

        // Reduce the height to match the width
        adjusted_resolution.y /= x_aspect;
    } else {

        // Reduce width to match the height
        adjusted_resolution.x *= x_aspect;
    }
    // uv offet required to center the uv coordinates
    // doing both at once to avoid branch logic
    vec2 uv_offset = (
        (adjusted_resolution.xy - resolution.xy) /
        resolution.xy
    );
    // Get real true uv
    // and the square, centered uv
    uv = gl_FragCoord.xy/resolution.xy;
    square_uv = gl_FragCoord.xy/adjusted_resolution.xy + uv_offset;
}



void vignette(in vec2 uv, inout vec3 colour) {
    colour = mix(
        colour,
        VIN_C,
        log2(
            pow(
                distance(uv, vec2(.5, .5)),
                1.5
            ) +
            1.0 
        )
    );
}


vec3 glow_sph(in vec2 origin, in vec2 uv, in vec3 glow_colour, in float r) {
    
    float dist = distance(uv, origin);
    return mix(
        glow_colour,
        vec3(.01, .0, .0),
        smoothstep(vec3(.0, .0, .0), vec3(r, r, r), vec3(dist, dist, dist))
    );
}


float random (in vec2 st) {
    return fract(sin(dot(
        st.xy, vec2(5152.214, -123.21453)
    ))*393212.18602);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st, in float frequency) {
    vec2 i = floor(st * frequency);
    vec2 f = fract(st * frequency);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 5.0;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st, frequency);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}



bool in_circle(vec2 center, vec2 uv, float radius) {
    return (
        distance(center, uv) <= radius
    );
}


void mountain(in vec2 uv, inout vec3 colour) {

    if(in_circle(vec2(0.5, -10.0) + fbm(uv)*.04, uv, 10.4)) {
        colour = mix(
            vec3(0.46, 0.8, 0.46) - fbm(vec2(0.1, uv.y))*.39,
            vec3(0.1, 0.8, 0.32) - fbm(vec2(0.0, uv.y))*.39,
            fbm(uv)
        );
    }
}


void main(void) {
    vec2 real_uv;
    vec2 uv;
    get_square_uv(real_uv, uv);


    vec3 colour = SKY_C;

    colour += glow_sph(vec2(.5, 1.0), uv, vec3(.5, .5, .0), 1.2);
    colour += glow_sph(vec2(.5, .8), uv, vec3(.75, .75, .0), .25);

    float cloud = fbm(uv + vec2(144.31, -214.902) + vec2(sin(time*.5)*.05, cos(time*.5)*.05));
    colour += mix(
        vec3(0.0, 0.0, 0.0),
        vec3(cloud, cloud, cloud),
        fbm(uv)*.7
    );

    colour *= .9;
    
    mountain(uv, colour);

    vignette(real_uv, colour);
    gl_FragColor = vec4(colour, 1.0);
}
