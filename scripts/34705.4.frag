#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float light (vec3 hnormal, vec3 direction) {
	vec3 hnx = normalize(hnormal);
	vec3 hdir = normalize(direction);
	vec3 hc = cross(hnx, hdir);
	float d = dot(hnx, hdir);
	return clamp(d, 0.0, 1.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = vec3(0.8, 0.8, 0.8);
	vec2 h = surfacePosition;
	float d = distance(h, vec2(0.0, 0.0))*2.0;
	if (d < 1.0) {
		float w = sqrt(1.0-d);
		float w2 = 1.0/fract(w);
		vec3 norm = vec3(h*w2, w);
		vec2 mh = (mouse.xy)*2.0-1.0;
		float d = distance(mh, vec2(0.0,0.0));
		float fr = 0.0;
		vec3 fln = vec3(mh.x, mh.y, 0.6);
		float hlight = light(norm, fln);
		color = vec3(hlight*0.9+0.1, hlight*0.5+0.1, hlight*0.3+0.1);
	}
	
	gl_FragColor = vec4( color, 1.0 );

}