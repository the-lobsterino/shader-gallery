/*
 * Original shader from: https://www.shadertoy.com/view/wtsBzN
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
#ifdef GL_ES
precision mediump float;
#endif

vec2 squareImaginary(vec2 number){
	return vec2(
		pow(number.x,2.)-pow(number.y,2.),
		2.*number.x*number.y
	);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

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
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

vec3 gencolor() {
    float t1 = sin(iTime) / 2. + 1.;
    float a = t1*t1;
    float b = (t1 + t1) / 2.;
    float c = a * b;
    return vec3(a * .5, b * .5, c);
}

float distanceSquared(in vec2 x, in vec2 y) {
    return dot(x-y, x-y);
}

float iterate(vec2 c, vec2 trap)
{
    int maxIterations = 50;
    float dist = 1e20;
    vec2 z = vec2( 0.0 );
    for( int i=0; i< 50; i++ )
    {
        z = squareImaginary(squareImaginary(z)) + c;
        if( length(z) > 2.0 ) return 0.0;
        dist = min(dist, distanceSquared(z, trap));
    }
    
    return (sqrt(dist) * 2.);
}

vec2 rot2d(vec2 pt, float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r)) * pt;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 st = fragCoord.xy/iResolution.xy;
    st.x *= iResolution.x/iResolution.y;
    vec3 color = vec3(0.0);
    float d = 0.0;
    // Remap the space to -1. to 1.
    st = st *4.-1.;
    vec2 st2 = rot2d(st, cos(iTime * .05) * 5.);
    st = rot2d(st, sin(iTime * .05) * 5.);
    // Make the distance field
  	d = length( abs(st)-.3 + sin(iTime * .05) + 1. );
    float alpha = fbm(st * 3.0);
    d = mix(alpha, d, abs(sin(iTime / 5.)));
    vec2 itp = vec2(sin(iTime / 1.75));
    itp.y = abs(itp.y);
    itp.x = abs(cos(itp.y));
    itp = itp / 2.;
    vec3 c = gencolor();
    vec2 fbm_trap = vec2(.5, 2.)*(sin(1.5*iTime));
    float d_field = fract(d*6.0);
    float st2x = st2.x / 4.;
    float st2y = st2.y / 4.;
    st2 = vec2(st2x, st2y);
    float frac_d = iterate(st2, vec2(d));
    vec3 t_c = vec3((d_field * frac_d * c) + (1.-frac_d) * d_field * c * .75);
    fragColor = vec4(t_c, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}