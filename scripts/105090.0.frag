// iz twist etc.

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
#define R iResolution.xy
#define T iTime
#define rot(a) mat2 (cos(a), sin(a), -sin(a), cos(a))

float M(vec3 p) {
    p.z -= T;
    p.xy *= rot(T+p.z*0.3);
    
    vec3 p1 = mod(p, 2.) - 1.;
    vec3 p2 = fract(mod(p, .5) - .25);
    
    vec2 q = vec2(
        min(
            length(p1.xy), 
            min(
                length(p1.yz), 
                length(p1.xz)
            )
        ) - .5,
        
        min(p2.x, min(p2.y, p2.z))
    );

	
	float rr = 0.01;
	
	rr *= 1.0+sin(p.z*6.28);
	
    return length(q) - rr;
}


void mainImage(out vec4 O, vec2 u)
{
    vec2 uv = (u+u - R) / R.y;
    
	float s=0.0;
	float t=0.0;
    for (int i=1;i<200;i++)
    {
        s = M(t * vec3(uv, -1));
        t += s * .4;
        if(t > 100. || s < .02) break;
    }
    
    O = vec4(t * vec3(3, 5, 2) * .025, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}