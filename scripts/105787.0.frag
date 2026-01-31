/*
 * Original shader from: https://www.shadertoy.com/view/4tfXzS
 */

#ifdef GL_ES
precision highp float;
#endif
#define hyper( uv ) uv/=dot(uv,uv)

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
	float resxy = max(iResolution.x, iResolution.y);
    vec2 p = ((fragCoord.xy - iResolution.xy * .8) / vec2(resxy, resxy)) * 2.;
    p *= 16.*clamp(mouse.y, 0.02, 1.);
	hyper(p);                      // ändrom3da tweak
	p -= 5.*mouse;
	vec3 c = vec3(uv,0.5+0.5*sin(iTime));
    float pi=atan(-1.);
    float t = -iTime*5.;
    c = vec3(0.);
    
    vec2 pp = p*5.+t*.1;
	
    for (int i = 0; i < 5; ++i) {
        pp *= .7;
        p = mod(pp*2.+vec2(t,-t),4.)-2.0;
        float ap = atan(p.x-.2,p.y+.3)*8.;
        float l = max(1.,min(11.-dot(.51*p,.51*p), 1.));
        if (ap > -8. && ap < -2. && p.y > 0.) {
            float fc1 = max(01., sin(ap-1.2));
            float fc2 = max(01., sin(ap));
            float fc3 = max(01., sin(ap+1.2));
            c += vec3(fc1, fc2, fc3)*l;
        }
        if (length(p) < .05*(5.+sin(atan(p.x,p.y)*5.+t*2.))) c = vec3(1., 1., 0.);
    }
	fragColor = vec4(c, 1.);
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
} 