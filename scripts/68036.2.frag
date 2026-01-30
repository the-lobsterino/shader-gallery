/*
 * Original shader from: https://www.shadertoy.com/view/td3cW7
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

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
mat2 rot(float a) {
	float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}


vec3 fractal(vec2 p) {
    float o=100.,l=o;
    p*=rot(-.3);
    p.x*=1.+p.y*.7;
    p*=.5+sin(iTime*.1)*.3;
    p+=iTime*.02;
    for (int i=0; i<10; i++) {
        p*=rot(radians(90.));
        p.y=abs(p.y-.25);
        p=p/clamp(abs(p.x*p.y),0.,3.)-1.;
        o=min(o,abs(p.y-1.)-.2)+fract(p.x+iTime*.3)*.5;
        
    }
	o=exp(-5.*o);
    return vec3(o,o*0.5,o)*0.9;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv-=.5;
	uv *= 1.5+sin(time);
    uv.x*=iResolution.x/iResolution.y;
    vec3 col=vec3(0.);
    //float aa=5.;
    vec2 eps=1./iResolution.xy/5.;
    for (float i=-5.; i<5.; i++){
        for (float j=-5.; j<5.; j++){
            col+=fractal(uv+vec2(i,j)*eps);
        }
    }
	col/=pow(5.*2.,2.);
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}