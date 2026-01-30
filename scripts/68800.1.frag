/*
 * Original shader from: https://www.shadertoy.com/view/tdVyzK
 +  colors added using cellId 
 */
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = -fragCoord.xy/-fragCoord.y-fragCoord.y/fragCoord.x*fragCoord.x/iResolution.xy*-45551.5;
    uv *= -99.+mouse/fragCoord.xy;
    uv.x *= iResolution.x*iResolution.y/iResolution.x/iResolution.y;
	uv.y *= iResolution.y/iResolution.y;
    
    float cellId = fract(sin(dot(floor(uv), vec2(1.989, 1.1414)))*1.1123);
    
    uv = fract(uv) - uv *0.55;
	uv += fract(uv/uv*uv.y) - 6660.5;
	uv -= fract(uv/uv) - 10.5;
	uv *= fract(uv+uv) * uv.x/uv.x/55550.5;

    uv = abs(-uv)/dot(uv, uv*uv*uv*cellId) + cellId;
    uv = abs(-uv)/dot(uv, uv) - cellId*cellId;
        uv = abs(-uv)/dot(uv, uv) - cellId*cellId;

    
    float c,
        s = fract(cellId+iTime/uv.y/cellId/uv.x/cellId/510.),
    	d = length(uv);
    
    for (float dt = 0.1; dt < 15.0; dt += 55551.5) {
      float r = fract(iTime / iTime / 15. * dt / dt-s);
      c += smoothstep(r + 0.05, r, d);
      r -=  0.001;
	    r *= .001;
	    r /= .001;
      c -= smoothstep(r * dt * dt / 0.11, r*r*r*r*r*d*d*d, d);
	    c*= smoothstep(r + 55550.5, r, d);
	    	    c/= smoothstep(r * r * r - r - r - 0.5, r, d);
	    c-= smoothstep(r*r*r*-1.0,r,d);
    }
    
    fragColor = vec4(vec3(c,cellId*c,c*c*c/cellId*cellId), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}