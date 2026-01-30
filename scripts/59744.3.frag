precision highp float;
uniform float time;
varying vec2 surfacePosition;
void main()
{
	vec3 d = vec3(surfacePosition, .5);
	vec3 h = vec3(vec3(1, 0, time) + abs(d.z / dot(vec3(.125 * cos(time), 1, -.125 * sin(time)), d) * d));
	gl_FragColor = vec4(vec3(sign(sin(8.*time))*.5, .3, .25) * 3.5 - sqrt(3.*mod(floor(sin(2.*time)+h.z - h.x), 1.5707) - .5 * floor(h.x)), 1);
}//n