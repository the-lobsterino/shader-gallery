/*
 * Original shader from: https://www.shadertoy.com/view/3tKGWm
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
#define PI 3.1415

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy)/iResolution.y;

    vec3 col = vec3(0);

    vec2 st = rotate(uv, PI * 8. * (-iTime / 8. + length(uv)));

    float line1 = smoothstep(-0.25, 0.25, st.x);
    float line2 = 1. - line1;
	
    float h = 1.4 * smoothstep(-1., 1., sin(st.x * PI / 2. + 0.75 * PI));
    h -= 1.4 * smoothstep(-1., 1., sin(st.x * PI / 2. + 0.25 * PI));
    
    vec3 c1 = vec3(0.8, 0.2, 0.3);
    vec3 c2 = vec3(0.9, 0.92, 0.96);
    
    // how to create normal normal?
    vec3 normal = normalize(vec3( uv.x, h, uv.y));
    vec3 light = normalize(vec3(0.2 * sin(iTime/2.), 2.0, 1. * cos(iTime/2.)));
    float shading = dot(normal, light) * 0.5;
    shading += (1. - length(light.xz - uv) * 2.) * 0.4; 
	float spec = smoothstep(0.46, 1., shading);
    
    col = 1.2 * max(0.2, shading) * (c1 * line1 + c2 * line2);
    col += 2. * smoothstep(0.46, 1., shading);
    col += 0.2 * smoothstep(0.4, 1., shading);
    col += 0.1 * smoothstep(0.3, 1., shading);

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}