/*
 * Original shader from: https://www.shadertoy.com/view/WttSzN
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
// NASA "The Worm" classic logo

#define W .09
#define B .005

#define DEG .0174533
#define _S smoothstep

mat2 rotate(float angle) {
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float line(vec2 uv, float len) {
    float col = 0.;
    if (abs(uv.y) <= len) {
    	col += _S(-W, -W+B, uv.x);
        col -= _S(W-B, W, uv.x);
    }
    return col;
}

float arc(vec2 uv, float r, float angle) {
    float col = 0.;
    if (atan(uv.x/uv.y) < angle && uv.y >= 0.) {
    	col += _S(r+W, r+W-B, length(uv));
        col -= _S(r-W+B, r-W, length(uv));
    }
	return col;
}

float N(vec2 uv) {
    float col = 0.;
    col = max(col, line((vec2(-.0345, .1)-uv*sign(uv.y))*rotate(DEG*-19.), .15));
    col = max(col, arc((vec2(-.221, .194)-uv*sign(uv.y))*rotate(DEG*-180.), .146, DEG*71.));
    col = max(col, line((vec2(.367, .106)-uv*sign(uv.x+uv.y)), .3));
    return col;
}

float A(vec2 uv) {
    uv.x = abs(uv.x); // Y-axis symmetry
    
    float col = 0.;
    if (uv.y > -.29) {
    	col = max(col, line((vec2(.28, .0)-uv)*rotate(DEG*-21.), .4));
    	col = max(col, arc((vec2(0., .321)-uv)*rotate(DEG*-90.), .146, DEG*-20.));
    }
    return col;
}

float S(vec2 uv) {
    uv *= rotate(DEG * 90.);
    uv.x = -uv.x; // X-axis flip
    
    float col = 0.;
    col = max(col, line((vec2(.0, .07)-uv*sign(uv.y)), .07));
    col = max(col, arc((vec2(-.166, .14)-uv*sign(uv.y))*rotate(DEG*-180.), .166, DEG*90.));
    col = max(col, line((vec2(.332, .105)-uv*sign(uv.x+uv.y)), .245));
    return col;
}

// Star copied from BigWIngs Starfield shader
// https://www.shadertoy.com/view/tlyGW3
float star(vec2 uv, float flare) {
	float d = length(uv);
    float m = .05/d;
    
    float rays = max(0., 1.-abs(uv.x*uv.y*1000.));
    m += rays*flare;
    uv *= rotate(DEG*45.);
    rays = max(0., 1.-abs(uv.x*uv.y*1000.));
    m += rays*.3*flare;
    
    m *= _S(1., .2, d);
    return m;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord-.5*iResolution.xy) / iResolution.y;
    uv *= 2.15; uv.x += .05; uv.y += .2;

    float logo = 0.;
    logo = max(logo, N(uv-vec2(-1.19, .13)));
    logo = max(logo, A(uv-vec2(-.31, 0.)));
    logo = max(logo, S(uv-vec2(.45, .128)));
    logo = max(logo, A(uv-vec2(1.26, 0.)));
    vec3 logoColor = vec3(logo, .0, .15*logo); 
    
    float star = star(rotate(-iTime/8.)*(uv-vec2(1., .7)), 1.);
    vec3 starColor = vec3(star*cos(iTime), .6*star, star*sin(iTime/.7));
    
    fragColor = vec4(logoColor + starColor, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}