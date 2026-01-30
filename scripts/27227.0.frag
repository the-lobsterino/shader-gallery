// Adapted from ShaderFrog.com
// "What? Spiral"

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 p = ( gl_FragCoord.xy - 0.5 * resolution ) * 0.05;
	float a = atan(p.x, p.y);
	float r = length(p + 0.5 * atan(time));
	float cc = r + a * 0.5 -time;
	cc = abs(sin(float(1.0)*1.*cc));
	
	float a1 = atan(p.x-4., p.y+5.);
	float r1 = length(vec2(p.x-4.,p.y+5.) + 0.5 * atan(time));
	float cc1 = r1 + a1 * 0.5 -time;
	cc1 = abs(sin(float(1.0)*1.*cc1));
	
	gl_FragColor = vec4( vec3(1.0) * (cc*cc1), 2.0 );
}