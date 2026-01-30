/*
 * Original shader from: https://www.shadertoy.com/view/3s3yzs
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
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    float t = iTime * 0.25;
    uv *= mat2(cos(t), -sin(t), sin(t), cos(t));
    vec3 ro = vec3(0, 0, -1);
    vec3 lookat = mix(vec3(0), vec3(-1, 0, -1), sin(t*1.56)*.5+.5);
    float zoom = 0.65;
    vec3 f = normalize(lookat-ro),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f, r),
        c = ro + f * zoom,
        i = c + uv.x * r + uv.y * u,
        rd = normalize(i-ro);
    float dS, dO = 0.;
    vec3 p;
    for(int i=0; i<30; i++) {
    	p = ro + rd * dO;
        dS = -(length(vec2(length(p.xz)-1., p.y)) - 0.5);
        if(dS<.001) break;
        dO += dS;
    }
    vec3 col = vec3(0, 0 , 0);
    if(dS<.001) {
    	float x = atan(p.x, p.z)+t*.5;			// -pi to pi
        float y = atan(length(p.xz)-1., p.y);
        float bands = sin(y*5.+x*15.0);
        //float ripples = sin((x*10.-y*15.)*3.)*.5+.5;
        //float waves = sin(x*4.-y*6.+t*4.0);
        float b1 = smoothstep(-.2, .2, bands);
        float b2 = smoothstep(-.2, .2, bands-.5);
        float m = b1*(1.-b2);
        //m = max(m, ripples*b2*max(0., waves));
        //m += max(0., waves*.3*b2);
        col += m;
    }
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}