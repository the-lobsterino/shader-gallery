/* this is for template
 * Original shader from: https://darkeclipz.github.io/fractals/paper/Fractals%20&%20Rendering%20Techniques.html
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
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)//https://www.shadertoy.com/view/sdVGRd
// --------[ Original ShaderToy begins here ]---------- //
#define N 64.
#define B 4.

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    vec2 R = iResolution.xy;
    vec2 uv = (2. * fragCoord - R - 1.) / R.y;
    vec2 z = vec2(0), c = uv;
    float col=0.;

    for(int j=0; j < int(N); j++) {
	col++;    
        z = mat2(z, -z.y, z.x) * (z) +c;
        if(dot(z, z) > B*B) break;
    }

    if(col==N) { col = 0.; } // mark interior black
    fragColor = vec4(H(log(col/N)), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}