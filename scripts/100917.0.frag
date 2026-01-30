#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float DistToLine(vec2 pt1, vec2 pt2, vec2 testPt)
{
  vec2 lineDir = pt2 - pt1;
  vec2 perpDir = vec2(lineDir.y, -lineDir.x);
  vec2 dirToPt1 = pt1 - testPt;
  return abs(dot(normalize(perpDir), dirToPt1));
}

vec2 point(float x) {
	return pow(2.71828, x) * vec2(cos(x), sin(x));
}

#define EPSILON 0.02

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - resolution.xy / 2.) / resolution.xy ) * 2.;
	
	vec2 last = point(0.);
	
	gl_FragColor = vec4(0.);
	
	/*for (int i = 1; i <= 32; i += 1) {
		//vec2 new = point(i / 32.);
		if (DistToLine(last, new, position) < EPSILON)
		{
			gl_FragColor = vec4(1.);
		}
		last = new;
	}*/

}