#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159265359;
const float inv180 = 1. / 180.;
const float invPI = 1. / PI;
const float rad2deg = invPI * 180.;
float mag (vec2 pos)
{
	return pos.x * pos.x + pos.y * pos.y;
}
void main (void)
{

	vec2 position = (gl_FragCoord.xy / resolution.xy) * 2. - 1.;
	float aspect = resolution.y / resolution.x;
	if (aspect > 1.) position.y *= aspect;
	else position.x /= aspect;
	float r = mag(position);
	float ang = atan(position.y,position.x) * rad2deg + 180.;
	bool blank = r > 0.875;
	bool smile = r < .625 && r > .5 && ang < 135. && ang > 45.;
	position += vec2(.375,0.125);
	r = mag(position);
	position.x -= .75;
	bool eyes = r < 0.1 || mag(position) < .1;
	vec3 color;
	float pulse = (sin(time * PI * .375) + 1.) * .5;
	if (blank) color = vec3((1. - pulse) * .25,0,0);
	else if (smile || eyes) color = vec3((1.-pulse) + pulse * .125,pulse * .125,pulse * .125);
	else color = vec3(1,.875,0);

	gl_FragColor = vec4(color,0);

}



