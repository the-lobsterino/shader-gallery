#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//-----------------------------------------------------------
// SpinLight.glsl    2017-06-21 Shader by M.Tsai
// https://www.shadertoy.com/view/4dXfD2
//-----------------------------------------------------------

vec3 spinlight(vec2 p)
{
    float a = atan(p.y, p.x)+ sin(time*1.5)*3.0;
    float l = length(p)*0.08;
    float g = smoothstep(-.95, -.05, cos(a*6.0))*0.06;
    float lightshine = 1.0-smoothstep(g-0.02,g+0.03, l*1.1);
    return vec3(lightshine)*vec3(1.0,1.0,1.0);
}

void main( void ) 
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv = uv*5.6 - 2.0;
  uv.x = mod(uv.x * resolution.x / resolution.y -0.5, 2.)-1.;    
  vec3 bgcolor = vec3(0.1);
  bgcolor += spinlight(vec2(uv.x, uv.y));
  gl_FragColor = vec4(bgcolor,1.0);
}
