#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159;
const float HALF_PI = PI * .5;

float circle (vec2 point, vec2 center, float radius){
  float distanceToCenter = distance(point, center);
  return smoothstep(distanceToCenter - 2., distanceToCenter, radius);
}

float modAngle(float angle){
  return mod(angle, 360.);
}

bool isAngleBetween(float angle, float angle1, float angle2){
  float startAngle = min(angle1, angle2);
  float endAngle = max(angle1, angle2);

  if (endAngle - startAngle < 0.1){
    return false;
  }

  angle = modAngle(angle);
  startAngle = modAngle(startAngle);
  endAngle = modAngle(endAngle);

  if (startAngle == endAngle) endAngle +=360.;

  if (startAngle > endAngle) return angle < startAngle || angle < endAngle;

  return angle > startAngle && angle < endAngle;
}

float sector(vec2 point, vec2 center, float startAngle, float endAngle){
  vec2 shiftOfCenter = point - center;
  float angle = degrees(atan(shiftOfCenter.y, shiftOfCenter.x));

  if (isAngleBetween(angle, startAngle, endAngle)) {
    return 1.;
  } else {
    return 0.;
  }
}

float arc (vec2 point, vec2 center, float radius1, float arcWidth, float startAngle, float endAngle){
  float radius2 = radius1 - arcWidth;

  return (circle(point, center, radius1) - circle(point, center, radius2)) * sector(point, center, startAngle, endAngle);
}

// float circle (vec2 point, float radius, vec2 center){
// bool p = pow(point.x - center.x, 2.) + pow(point.y - center.y, 2.) <= pow(radius, 2.);
// return p ? 0. : 1.;
// }

void main( void ) {
  vec2 point = vec2(gl_FragCoord);

  vec2 center = resolution * .5;
  float radius = min(resolution.x, resolution.y) / 3.;

  vec3 color = vec3(0., .1, .0);
  float angle = sin(time) * 360.;

	
  gl_FragColor = vec4(arc(point, center, radius - 30., 1., 0., angle), 0., 0., 1.);

}