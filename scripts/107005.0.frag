
/*
 * Original shader from: https://www.shadertoy.com/view/Wsfczn
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
#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 st = fragCoord;
  vec3 color = vec3(0.);
  st = vec2(iResolution.x/2.,iResolution.y/2.) - st;
  st = rotate2d((-1.)*PI*mod(iTime,2.0))*st;
  float dist = sqrt(dot(st,st))/5.;
  float theta = (PI+atan(st.y,st.x))/(2.*PI);
  vec3 ringA = vec3(smoothstep(3.,4., dist));
  vec3 ringB = vec3(smoothstep(6.,5., dist));
  vec3 temp  = ringA*ringB*theta;

  color = temp;

  fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}