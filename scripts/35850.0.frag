#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ellipseEdge(float f, float edge, float radius)
{
	return smoothstep(f, f + edge, radius);	
}

vec4 ellipse(vec2 position, float radius, float a, float b, float edge, float eggness, float edgeness)
{
	float t =
		exp(eggness * position.x);
	float f =
		pow(position.x, edgeness) / a + pow(position.y, edgeness) / (b * t);

	float background =
		1.0 - ellipseEdge(f, edge, radius);
	float circleColor =
		ellipseEdge(f, edge, radius) + background;
	vec4 fragmentColor =
		vec4(circleColor, vec2(background), 1.0);
	
	return fragmentColor;
}

void main()
{
	vec2 position =
		(gl_FragCoord.xy / resolution) - 0.5;
	position.x *=
		resolution.x / resolution.y;

	float radius =
		0.2;
	float a =
		0.6;
	float b =
		0.2;
	float edge =
		0.0;
	float eggness =
		3.0;
	float edgeness =
		2.2;
	
	gl_FragColor =
		ellipse(position, radius, a, b, edge, eggness, edgeness);
}
