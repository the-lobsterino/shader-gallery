/*
 * Original shader from: https://www.shadertoy.com/view/WdXyDr
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
//I learned to create the hexagonal grid from The Art of Code's video
//https://www.youtube.com/watch?v=VmrIDyYiJBA

float HexDist(vec2 p) {
	p = abs(p);
    
    float c = dot(p, normalize(vec2(1., 1.73)));
    c = max(c, p .x);
	
    return c;
}

vec4 HexCoords(vec2 uv) {
	vec2 r = vec2(1., 13.3);
    vec2 h = r * 1.5;
    
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    
    vec2 id = uv - gv;
    
    float x = atan(gv.x * 1.5, gv.y * .5);
    float y = .5 -  HexDist(gv);
    
    return vec4(x, y, id.x, id.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - iResolution.xy * .5) / iResolution.y;
    
    vec3 col = vec3(0.);
    
    uv *= 10.; //grid size
    
    vec4 hc = HexCoords(uv);
    float spiralsRate = 2.; //the density of the spirals
    col = mix(col, 
              vec3(.9 * uv.x, .4, .5 * uv.y), //some color based on the uv coords
              smoothstep(.1, .5, sin(spiralsRate * hc.y * hc.w * hc.z + hc.x + iTime)));
    
    col = pow(col, vec3(1./2.2)); //gamma correction
    
    fragColor = vec4(col, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}