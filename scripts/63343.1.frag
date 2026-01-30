//
// M o d d o t
// http://www.matteo-basei.it/moddot
//
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;



void main()
{	
	vec2 point = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	point.x *= resolution.x / resolution.y;
		
	point *= 120.0 + mod(float(int(time / 2.0)), 30.0);
	
	float value = mod(dot(point, point), 1.0);
	
	gl_FragColor = vec4(vec3(value), 1.0);
}
