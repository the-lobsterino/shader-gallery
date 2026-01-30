#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hueShift(vec3 color, float hue) {
  const vec3 k = vec3(0.57735, 0.57735, 0.57735);
  float cosAngle = cos(hue);
  return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	vec3 col = vec3(1., 0, 0);
	if (pos.x < 0.5) {
	  col = vec3(1., 0., 0.);
	} else {
	  col = vec3(0, 1, 0);
	}
	
	col = hueShift(col, mouse.x*4.);
	
	gl_FragColor = vec4(col, 1.0 );

}