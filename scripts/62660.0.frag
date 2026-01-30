/*
 * Original shader from: https://www.shadertoy.com/view/ldBXDt
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
// Got the idea from the xscreensaver Intermomentary.
//   http://www.youtube.com/watch?v=pH-ykepPopw

// Next step: make the 3rd-degree intersections look better?

// FBM code robbed shamelessly from IQ at https://www.shadertoy.com/view/lsl3RH

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 p ) {
	return sin(1.5*p.x)*sin(1.5*p.y);
}

float fbm4( vec2 p ) {
    float f = 0.0;
    f += 0.5000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.2500*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.1250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.0625*(0.5+0.5*noise( p ));
    return f/0.9375;
}


const float fuzz = 0.006; // width of intersection testing
const int numCirc = 130;

void applyCircle(vec2 uv, vec2 c, float r, inout float weight, inout int n)
{
    float d = abs(distance(uv, c) - r);
    if (d < fuzz) {
        weight += 1.0 - d / fuzz;
        n++;
    }
}

// Given the number and weight of intersections, determine the color.
vec3 mapcol(float w, int n) {
    // for n <= 1, do nothing or pale gray.
    // for n=2, do small golden sparkle.
    // for n=3, do blue flash
    w = w / float(n);
	if (n < 2) return vec3(0.0);
    // to see the circles:  if (n < 2) return vec3(0.16 * pow(w, 5.0));
	else if (n < 3) return vec3(0.9, 0.8, 0.5)*pow(w, 5.0);
    else if (n < 4) return vec3(0.9 * pow(w, 5.0), 0.9 * pow(w, 5.0), 1.3 * pow(w, 3.0));
    else return vec3(1.5, 0.4, 0.4)*pow(w, 5.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float minRes = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord.xy - iResolution.xy * 0.5) / minRes;
    float t = iTime * 0.02 + 307.0, weight = 0.0;
    int n = 0;
    
    for (int i=0; i < numCirc; i++) {
        float fi = float(i);
        float inv = 1.0/(float(i)+4.0);
        float fiv = fi + inv;
        vec2 c = vec2(fbm4(vec2(fi, t)) * 2.5 - 1.25,
                      fbm4(vec2(fi * 0.39 + 97.3, t*0.291 + 15.9)) * 2.0  - 1.0);
        float r = fbm4(vec2(fi, t*0.5)) * 0.15 - 0.025;
		applyCircle(uv, c, r, weight, n);
    }
    
	fragColor = vec4(mapcol(weight, n)*3.0, 1.0);
}



// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}