#extension GL_OES_standard_derivatives : enable

precision highp float;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

//#define time ((mod(time,2.0)-1.0)/2.0)
//#define time (PI/2.0)
#define time atan(mouse.y/mouse.x)

#define PI 3.141592653

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy - vec2(0.5) );

	pos.x *= resolution.x / resolution.y;
	
	pos += pos*surfacePosition;

	float mcolor = 0.0;

	for (float dx = -1.0; dx < 2.0; dx += 1.0) {
		for (float dy = -1.0; dy < 2.0; dy += 1.0) {
			vec2 e = vec2(dx, dy)*1e-8;
			vec2 ps = pos + e;// / resolution.xy / 3.0;
			float t = dot(ps,ps.yx) * (time);

			float l = length(ps);
			float a = atan(ps.y, ps.x) + 2.0 * PI * (t);

			// float color = 1. - l / (1. + l);
			// mcolor += fract((pos.x + pos.y) * 4.0);
			mcolor += log(1.0+abs(l*a));// * 12.0 + fract(t));
			//mcolor *= fract(a / (2.0 * PI / 12.0));
		}
	}
	float color = (mod(mcolor,2.0)-1.0)/2.0;// / 2.0; // / 9.0;

	gl_FragColor = vec4( fract(vec3( color,1.0-color,fract(color*color) )), 1.0 );
}