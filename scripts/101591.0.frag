/*
 * Original shader from: https://www.shadertoy.com/view/Ds33zX
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
// https://twitter.com/zozuar/status/1625639986111315969?s=20

mat2 Rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{     

    vec4 color, shade;
    vec2 n,N,q;
    float R,S=1., a, k, col;
    mat2 m;
    for(float j=0.;
        j<1e2;
	j++
    ) {
        k = .5 + sin(iTime*.0001),
        n *= m = Rotate(k*j),
        q = (gl_FragCoord.xy-.5*iResolution.xy)/iResolution.y*m,        
        q = vec2(( log( R = length(q))*S-iTime*.1)*3., atan(q.x,q.y) ),
        a += dot(cos(q += n*.6 + q.y)/S,iResolution.xy/iResolution.xy),
        n += q = sin(q),
        N += q/S;
	S/=.995;
    }

    shade = 2.+sin(vec4(1.1,3.5,4.5,4)+a*.2);
    col = (.2-a*.03)+.6/length(N);

    color = ((col)*sqrt(R) * shade);
    color.r += k*.7;
    color.g += k*q.x*.3;

    fragColor = color;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}