#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float co) { return fract(sin(co*(91.6458)) * 44423.5453+fract(time*.2452)); }
float slice(float x, float at) { if (x > at) { return (x-at)/(1.-at); } else { return x/at; }}
void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	float thickness = 10.0;
	vec2 a = uv;
	float b = 0.;
	for (float i = 0.; i < 100.; i++) {
		float c = rand(i+b+.24);
		if (rand(i+1.42)>.5) {
			a = vec2(a.x,slice(a.y,c));
			b += float(uv.x>c||uv.y>c);
		} else {
			a = vec2(slice(a.x,c),a.y);
			b += float(uv.x>c||uv.y>c);
		}
	}
	gl_FragColor = vec4(vec3(a.x>.825,a.x<.25,a.x>.6), 1.0 );
}