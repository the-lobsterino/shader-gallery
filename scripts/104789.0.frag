/*
 * Original shader from: https://www.shadertoy.com/view/ctGGDz
 */


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
/*
https://twitter.com/kamoshika_vrc/status/1656260144840478720
float i,c=15./PI,d=c,g;
for(;i++<99.&&d>1e-4;g+=d){
  vec3 P=normalize(vec3(FC.xy-r*.5,-r.y))*rotate3D(.9,FC.wzz)*g;
  P.yz+=1.;
  vec2 I=ceil(P.xz=vec2(log(d=length(P.xz))-t,atan(P.z,P.x))*c);
  P.xz-=I;
  d=max(P.y,(.4-abs(fract((fsnoise(I)<.5?-P.z:P.z)-P.x)-.5))*.7*d/c);
}
o+=9./i;
*/

vec3 axis_rotation(vec3 P, vec3 Axis, float angle) {
  Axis = normalize(Axis);
  return mix(Axis * dot(P, Axis), P, cos(angle)) + sin(angle) * cross(P, Axis);
}

float fsnoise(vec2 v) {
  return fract(sin(dot(v, vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec3 uv = normalize(vec3(fragCoord.xy - 0.5 * iResolution.xy, -iResolution.y));
  vec3 dir = axis_rotation(uv, vec3(2.,1.,1.), .9);  // view direction
  vec3 Po = vec3(0., 1., 1.);  // view origin
  float wall_thickness = 0.4;
  float scale = 4.0;
  float luminosity = 0.5;
  float steps = 0., distance = 0.;
  for (int i = 0; i < 99; i++) {
    vec3 P = Po + dir * distance;
    float l = length(P.xz);
    // https://www.osar.fr/notes/logspherical/
    // switch to 'polar' log-spherical coordinates
    P.xz = vec2(log(l) - iTime, atan(P.z, P.x)) * scale;
    vec2 I = ceil(P.xz);   // integer part = cell ID
    P.xz -= I;  // fractional part
    // the 'maze' itself:
    float v = abs(fract((fsnoise(I) < .5 ? -P.z : P.z) - P.x) - .5);
    v = (wall_thickness - v) * luminosity * l / scale;
    // here, walls are infinitely high, so we cut them with the plane P.y
    l = max(P.y, v);
    // advance the marching
    distance += l;
    if (l < 1e-4) break;
    ++steps;
  }
  fragColor = vec4(10. / steps);  // divide by steps => ~AO
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 5.;
}