#extension GL_OES_standard_derivatives : enable

precision highp float;


// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
const vec4 iMouse = vec4(0.);

//#define E 0.0
//#define U 0.0
//#define MAX 1000.
//#define STEPS 10



int test(vec2 x,float K)
{
	float E = 0.0;
	float U = 0.0;
    int i;
    float yN=0.0;
    for (int kk=0;kk < 10;kk++) 
    {
        yN = x.y + E * x.y + K * x.x * (x.x - 1.) + U * x.x * x.y;
        x = vec2(x.x + yN, yN);
        
        if (length(x) > 1000.0) break;
        i++;
    }
    return i;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = 12. * (fragCoord / resolution.xy) - vec2(6., 6.);
float K;
    K = 1.5 * abs(sin(time/10.));
    
    int i = test(uv,K);
    float t = float(i)/float(10);
    
    vec3 col = vec3(sqrt(t), t * t * t, max(0., sin(6.28317 * t)));
    fragColor = vec4(col, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}