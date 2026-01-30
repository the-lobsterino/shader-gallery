#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// Honey Badger Radio mascot
//
// just a fan. Rotate.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 blkCol = vec4(0.0);
vec4 whtCol = vec4(1.0);
vec4 bgCol = vec4(0.1);
vec4 faceCol = vec4(0.75, 0.125, 0.18, 1.0);

vec2 pos;

float inCircle(vec2 center, float radius)
{
	if (distance(pos, center) < radius)
		return 1.0;
	else
		return 0.0;
}

vec4 addNose(vec4 col, vec2 center, float radius)
{
	float d = 1.0 + abs(pos.y) * -2.0;
	if (pos.y >= 0.0) d = 1.0 + sin(pos.y * 3.5 + 3.14) * 0.1;
	float r = distance(vec2(pos.x, pos.y * 0.3), center);

	if (r < radius * d)
	{
		if (pos.y < 0.0)
			return vec4(0.0);
		else
			return vec4(1.0);
	} else return col;
}

vec4 addTeeth(vec2 center, float radius)
{
	float py = pos.y * 0.375 - 0.1;
	float r = distance(vec2(pos.x * 1.1, py - sin(py*47.5) * 0.012), center);

	if (r < radius && py - center.y < 0.0)
		return vec4(1.0);
	else
		return vec4(0.0);
}

vec4 addSideTeeth(vec2 center, float radius, float side)
{
	float py = pos.y * 0.275 - 0.165;
	float r = distance(vec2(pos.x + py * side, py - sin(py*47.0) * 0.01), center);

	if (r < radius && py - center.y < 0.0)
		return vec4(1.0);
	else
		return vec4(0.0);
}

void main( void ) {

	vec2 posOrig = ((( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) * vec2(resolution.x / resolution.y, 1.0)) * 2.0;
	pos = posOrig;

	float a = time;
	pos.x = sin(a) * posOrig.x + cos(a) * posOrig.y;
	pos.y = cos(a) * posOrig.x - sin(a) * posOrig.y;


	float eyeLeftMask = 1.0 - inCircle(vec2(-0.6, 0.4), 0.136);
	float eyeRightMask = 1.0 - inCircle(vec2(0.6, 0.4), 0.136);
	float mask = inCircle(vec2(0), 1.0) * eyeLeftMask * eyeRightMask;

	vec4 col = faceCol * mask;
	col = mask * addNose(col, vec2(0,0), 0.4);
	for (int i=0; i<4; ++i)
		col += mask * addTeeth(vec2(float(i) * 0.21 - 0.31, -0.3), 0.1);
	
	col += addSideTeeth(vec2(- 0.81, -0.31), 0.1, 1.0);
	col += addSideTeeth(vec2(+ 0.82, -0.31), 0.1, -1.0);

	gl_FragColor = col;
}