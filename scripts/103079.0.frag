/*
 * Original shader from: https://www.shadertoy.com/view/mtdGW4
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
vec4 hash42(vec2 p)
{
	vec4 p4 = fract(p.xyxy * vec4(1.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+30.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

void mainImage( out vec4 O, in vec2 F)
{
    // coord setup
    vec2 u = (F/iResolution.xy);
    u.x *= iResolution.x/iResolution.y;
    u.y+=12.5;
    u *= .5;
    
    vec2 c = floor(u); // square cell id (basically ~0,1 whole viewport)
    vec2 p = u-c; // 2D position in cell
    float l = length(p-.5); // length from center
    u /= 1.*max(0.0001,l/7.4); // warp uv based on length accounting for Z
    u += vec2(u.y,-u.x); // skew coords to correct prev op so we can manip z directly
    vec2 id = floor(u); // now find a new cell based on new coords.
    vec4 h = hash42(id.yy); // get random row value
    u.x += ((mod(id.y,2.)+1.))*iTime*sign(h.z-.5)*3.+(3.*(h.y-.5));// slide rows randomly
    u.x += iTime*13.; // move forward
    id = floor(u); // recalc cell after sliding
    h = hash42(id); // hash of this cell
    vec2 idp = u-id; // position in the new cell
    float d = .45-max(abs(idp.x-.5),abs(idp.y-.5)); // distance to edge
    d = step(h.a* (sin(3.*iTime*h.r)*.5+.5)*.5, d); // stylize squares
     
    O = h * d * l * 2.;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}