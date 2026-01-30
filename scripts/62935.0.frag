/*
 * Original shader from: https://www.shadertoy.com/view/tdXcWB
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
#define P_SUBDIV .2+.2*sin(iTime)
//#define P_SUBDIV .2

float rnd(vec3 v) { return fract(4e4*sin(dot(v,vec3(13.46,41.74,-73.36))+17.34)); }
    
void mainImage( out vec4 fragColor, vec2 uv )
{
    vec2 u, R=iResolution.xy, m=vec2(sin(0.2), cos(0.2));
    if (m.x+m.y<1e-2*R.x) m = R*(.5+.5*sin(.1*iTime+vec2(0,1.6)));
    uv.x -= 8.*(m.x-R.x/2.);
    uv /= (1.-m.y/R.y)*4.;
    
	float z = R.y;
    for (int i=0; i<128; i++) {
        u = floor(uv/z)+.5;
        if (rnd(vec3(z*u, z)) < P_SUBDIV) break;
        z /= 2.;
    }
    uv = z/2.-abs(uv-z*u);
    fragColor = min(uv.x,uv.y)<1. ? vec4(0) :
    			// vec4(1); // vec4(z/R.y);
				.6+.4*cos(6.28*rnd(vec3(z*u+1.,z))+vec4(0,2.1,-2.1,0));
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}