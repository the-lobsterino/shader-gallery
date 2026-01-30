#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,20.)

void mainImage(out vec4 O, vec2 I)
{
    vec3 p=iResolution,d = -vec3(I+I-p.xy,p)/p.x,c = d-d, i=c;
    for(int x=0;x<25;++x) {
        p = c,
        p.z -= iTime+(i.x+=.04),
        p.xy *= mat2(sin((p.z*=.01)+vec4(0,11,33,0)));
        c += length(sin(p.yx)+cos(p.xz+iTime))*d;
    }
    O = vec4(15,0,1,1)/max(15., 4.*length(c));
}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 150.;
}