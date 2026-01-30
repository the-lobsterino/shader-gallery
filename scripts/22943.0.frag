//MIIIIIIIIIIIIIIIIIIIIIIIILLE
#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265358979
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float tresLeCos(float x) {
	return cos(x)*.5+.5;
}
void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy*2.-1.;
	pos.x *= resolution.x / resolution.y;
	float d = dot(pos, pos);
	float b = floor(mod(abs(pos.x)*cos(time*8.)*10.+abs(pos.y)*sin(time*4.)*100.-time*10.+sin(abs(d*10.*pos.x) + time*100.), 10.))/10.;
	float t = time*4.;
	vec3 col = vec3(tresLeCos(t + b*PI*2. + abs(pos.x)*4. + time), tresLeCos(t + b*PI*2.*cos(time) + 2.*PI/3. + abs(pos.y)*4. + time), tresLeCos(t + b*PI*2.*sin(time) + 4.*PI/3. + 1./d));
	gl_FragColor = vec4(col, 1.);
}