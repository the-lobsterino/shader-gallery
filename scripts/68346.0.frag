/*
 * Original shader from: https://www.shadertoy.com/view/WdKczD
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
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 col;
    float t;
    
    for(int c=0;c<3;c++){
	    vec2 uv = (fragCoord*2.-iResolution.xy)/iResolution.y;
        t = iTime+float(c)/10.;
        for(int i=0;i<10;i++){
            uv=abs(uv);
            uv-=.5;
            uv=uv*rot(t/float(i+1));
        }
	    col[c]= step(.5,fract(uv.x*20.));
    }

    fragColor = vec4(vec3(col),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}