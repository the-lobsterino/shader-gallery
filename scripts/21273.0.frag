#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

const vec2 center = vec2(0.5, 0.5);

vec3 sc1(vec2 p, float ph1, float ph2, float ph3) {

  float ar = smoothstep(-0.5, 1.0, cos(time / 190. + ph2 * .2 + ph3 * 11.)) * 1.50;
  float ag = smoothstep(-0.5, 1.0, cos(time / 200. + ph2 * .2 + ph3 * 13.)) * 1.50;
  float ab = smoothstep(-0.5, 1.0, cos(time / 210. + ph2 * .2 + ph3 * 17.)) * 1.50;

  float r1 = abs(cos(p.x * 5. + time / 570. + ph1) / 4. + cos(ph3 * 103.) * 0.1 - p.y + center.y );
  float g1 = abs(cos(p.x * 5. + time / 550. + ph1) / 4. + cos(ph3 * 105.) * 0.1 - p.y + center.y );
  float b1 = abs(cos(p.x * 5. + time / 530. + ph1) / 4. + cos(ph3 * 107.) * 0.1 - p.y + center.y );

  float r = smoothstep(0.0001 + ar, 0., r1);
  float g = smoothstep(0.0001 + ag, 0., g1);
  float b = smoothstep(0.0001 + ab, 0., b1);

  return vec3(r, g, b);
}

vec3 mix3(vec3 a, vec3 b) {
	return vec3(
		max(a.x, b.x),
		max(a.y, b.y),
		max(a.z, b.z)
	);
}

#define MAX_ITER 10
void main( void ) {
	vec2 sp = surfacePosition;//vec2(.4, .7);
	vec2 p = sp*6.0 - vec2(125.0);
	vec2 i = p;
	float c = 1.;

	  float ph1 = cos(time / 12.) * 3.;
	  float ph2 = cos(time / 150.) * 10.;
	  float ph3 = sp.x / 3. - time * 0.1;

	
	
	float inten = 0.01;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time/3.0* (1.0 - (3.0 / float(n+1)));
		i = p + vec2(cos(t - i.x * 1.) + sin(t + i.y * 1.), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.5-sqrt(c);
	//gl_FragColor = vec4(vec3(c*c*c*c) + sc1(sp * 5., ph1, ph2 * 1.5, ph3 + c), 999.0);
	gl_FragColor = vec4(sc1(sp * 5., ph1, ph2 * 1.5, ph3 + c * 2.), 999.0);

}