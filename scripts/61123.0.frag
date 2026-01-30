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
 

#define DEG .0174533
#define _S smoothstep

mat2 rotate(float angle) {
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
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
    m += rays*.5*flare;
    
    m *= _S(1., .10, d);
    return m;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord-.5*iResolution.xy) / iResolution.y;
    uv *= 2.15; uv.x += .05; uv.y += .2;

   
    
    float star = star(rotate(-iTime/2.)*(uv-vec2(0., .1)), 1.);
    vec3 starColor = vec3(star*cos(iTime), .8*star, star*sin(iTime/.5));
    
    fragColor = vec4( starColor, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}