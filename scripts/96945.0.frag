#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scalef(float v, float omin, float omax, float nmin, float nmax) {
  float a = (nmax - nmin) / (omax - omin);
  float b = nmax - a * omax;
  return a * v + b;
}
vec3 scalevec(vec3 v, float omin, float omax, float nmin, float nmax) {
  float a = (nmax - nmin) / (omax - omin);
  float b = nmax - a * omax;
  return a * v + b;
}

void main( void ) {
    vec2 uv = gl_FragCoord.xy/resolution.xy * 2.0 - 1.0;
    float x = uv.x + time*0.5;
    float sx = sin(2.0*x)*0.95;
    float shx = sin(1.0*x - 0.2)*0.95 - 0.2;
    
    float eps = abs(uv.y - sx);
    float epssh = abs(uv.y - shx);
    if (eps < 0.15) {
      gl_FragColor = vec4(sin(x)*0.93 + 0.7, 0.0, cos(x)*0.3 + 0.7, 1.0);
    } else if (epssh < 0.15) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
      gl_FragColor = vec4(0.0,0.0,0.0,1.0);
    }

}