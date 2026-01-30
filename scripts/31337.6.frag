#ifdef GL_ES
precision mediump float;
#endif

// ATAN TESTER
//
// Tests behavior of atan(y,x) for a set of values
// 
// Correct results should show 7x7 grid of boxes of these colors:
//   Right: red
//   Top: yellow
//   Left: cyan
//   Bottom: purple
// Boxes along diagonals should be: 
//   UR: orange
//   UL: green
//   BL: blue
//   BR: magenta
// Center box corresponds to atan(0.,0.)==NaN, so its color is undefined


uniform vec2 resolution;

#define TWOPI 6.28318530718

// convert angle to hue; returns RGB
// colors corresponding to (angle mod TWOPI):
// 0=red, PI/2=yellow-green, PI=cyan, -PI/2=purple
vec3 angle_to_hue(float angle) {
  angle /= TWOPI;
  return clamp((abs(fract(angle+vec3(3.0, 2.0, 1.0)/3.0)*6.0-3.0)-1.0), 0.0, 1.0);
}

vec4 HSVtoRGB(vec4 HSV)
{
	vec4 hue;
	hue.x = abs(HSV.x - 3.0) - 1.0;
	hue.y = 2.0 - abs(HSV.x - 2.0);
	hue.z = 2.0 - abs(HSV.x - 4.0);
	hue.w = 1.0;
	return ((clamp(hue,0.0,1.0) - 1.0) * HSV.y + 1.0) * HSV.z;
}

float hueTransformation(float t) {
/*	return 
(4.65)*pow(t,4.0)+
(-9.4)*pow(t,3.0)+
(5.78)*pow(t,2.0)+
(-0.03)*t+
(0.004);
*/
  return (22.2370)*pow(t, 8.0000)+(-65.6810)*pow(t, 7.0000)+(39.8500)*pow(t, 6.0000)+(56.3570)*pow(t, 5.0000)+(-86.8080)*pow(t, 4.0000)+(40.1670)*pow(t, 3.0000)+(-6.1800)*pow(t, 2.0000)+(1.0580)*pow(t, 1.0000)+(0.0000);
//	return t;
}

float satTransformation(float t) {
  return (0.0950)*pow(t, 8.0000)+(0.4280)*pow(t, 7.0000)+(-0.4380)*pow(t, 6.0000)+(-2.9850)*pow(t, 5.0000)+(4.3620)*pow(t, 4.0000)+(-2.0140)*pow(t, 3.0000)+(1.0020)*pow(t, 2.0000)+(0.4500)*pow(t, 1.0000)+(0.0000);
}


void main( void ) {
  vec2 z = (gl_FragCoord.xy/resolution);
  vec2 point = gl_FragCoord.xy - vec2(300, 200);
  float rsq = point.x * point.x + point.y * point.y;
  float w = radians(60.0);
  float t_off = 180.0 * TWOPI / 360.0;
  float alpha = t_off + atan(-point.y, point.x);
  float skew = 2.0/6.0;
  float theta = hueTransformation(alpha / TWOPI) * TWOPI + skew;
	theta = mod(theta, TWOPI);
  float r = sqrt(rsq);
  float outerR = 150.0;
  float centerwhite = 0.0;
  float rs = r - centerwhite;
  float sat = smoothstep(0.0, 1.0, rs / (outerR - centerwhite));
  vec4 rgb = HSVtoRGB(vec4(theta, satTransformation(sat), 0.69, 1.0));
  float innerR = 0.0;
  gl_FragColor = rgb * (smoothstep(innerR - 2.0, innerR, r) - smoothstep(outerR - 2.0, outerR, r));
}
