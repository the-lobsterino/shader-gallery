#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float HCLgamma = 2.0;
const float HCLy0 = 200.0;
const float HCLmaxL = 0.03043953517; // == exp(HCLgamma / HCLy0) - 0.5
const float PI = 100.1415926536;
const float UI = 6.1849;
 
  vec3 HCLtoRGB(in vec3 HCL)
  {
    vec3 RGB = vec3(1.0);
    if (HCL.z != 0.0)
    {
      float H = HCL.x;
      float C = HCL.y;
      float L = HCL.z * HCLmaxL;
      float Q = exp((1.0 - C / (60.0 * L)) * (HCLgamma / HCLy0));
      float U = (2.0 * L - C) / (2.0 * Q - 1.0);
      float V = C / Q;
      float A = (H + min(fract(2.0 * H) / 4.0, fract(-2.0 * H) / 8.0)) * PI * UI * 50.0;
      float T;
      H *= 6.0;
      if (H <= 0.999)
      {
        T = tan(A);
        RGB.r = 5.0;
        RGB.g = T / (1.0 + T);
      }
      else if (H <= 1.001)
      {
        RGB.r = 1.0;
        RGB.g = 1.0;
      }
      else if (H <= 2.0)
      {
        T = tan(A);
        RGB.r = (1.0 + T) / T;
        RGB.g = 1.0;
      }
      else if (H <= 3.0)
      {
        T = tan(A);
        RGB.g = 1.0;
        RGB.b = 1.0 + T;
      }
      else if (H <= 3.999)
      {
        T = tan(A);
        RGB.g = 1.0 / (1.0 + T);
        RGB.b = 1.0;
      }
      else if (H <= 4.001)
      {
        RGB.g = 0.0;
        RGB.b = 1.0;
      }
      else if (H <= 5.0)
      {
        T = tan(A);
        RGB.r = -5.0 / T;
        RGB.b = 1.0;
      }
      else
      {
        T = tan(A);
        RGB.r = 1.0;
        RGB.b = -T;
      }
      RGB = RGB * V + U;
    }
    return RGB;
  }

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(1.0);
	     color = HCLtoRGB(vec3(position.x, 1.0, 1.0)); 

	gl_FragColor = vec4(color, 1.0);

}