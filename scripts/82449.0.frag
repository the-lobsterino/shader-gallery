#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 GetColor(vec2 point) {
	vec4 color = vec4(1.0);
	/*
	color.r = point.x < 0.25 ? 0. : (point.x > 0.75 ? 1. : 0.5);
	color.g = point.y < 0.25 ? 0. : (point.y > 0.75 ? 1. : 0.5);
	color.b = point.x < 0.25 ? 1. : (point.y > 0.75 ? 0. : 0.5);
	*/
	color.r = point.x;
	color.g = point.y;
	color.b = 1. - (point.y + point.x) * 0.5 ;
	/*
	float v1 = point.x < 0.25 ? point.x / 0.25 : (point.x > 0.75 ? (point.x - 0.75) / 0.25 : (point.x - 0.25) / 0.5);
	float v2 = point.y < 0.25 ? point.y / 0.25 : (point.y > 0.75 ? (point.y - 0.75) / 0.25 : (point.y - 0.25) / 0.5);
	color.rgb = vec3(v1 * v2);
	//color.g = point.y < 0.25 ? 0. : (point.y > 0.75 ? 1. : 0.5);
	//color.b = point.x < 0.25 ? 1. : (point.y > 0.75 ? 0. : 0.5);
	*/
	return color;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy*2.-resolution.xy)/resolution.y + 0.5;//( gl_FragCoord.xy / min(resolution.x, resolution.y));
	vec2 fBorderSize = vec2(16.) / min(resolution.x, resolution.y); //resolution.xy;
	
	vec2 changedTexcoord = position;
	
	if (position.x < 0.0 || position.y < 0.0 || position.x > 1.0 || position.y > 1.0) {
		position = vec2(-1.0);
	}
	else
	{
		if (position.x < fBorderSize.x)
		{
			changedTexcoord.x = (position.x / fBorderSize.x) * 0.25;
		}
		else
		{
			if (position.x > 1.0 - fBorderSize.x)
			{
				changedTexcoord.x = 0.75 + ((position.x - (1.0 - fBorderSize.x)) / fBorderSize.x) * 0.25;
			}
			else
			{
				changedTexcoord.x = 0.25 + ((position.x - fBorderSize.x) / (1.0 - fBorderSize.x *2.)) * 0.5;
			}
		}
		if (position.y < fBorderSize.y)
		{
			changedTexcoord.y = (position.y / fBorderSize.y) * 0.25;
		}
		else
		{
			if (position.y > 1.0 - fBorderSize.y)
			{
				changedTexcoord.y = 0.75 + ((position.y - (1.0 - fBorderSize.y)) / fBorderSize.y) * 0.25;
			}
			else
			{
				changedTexcoord.y = 0.25 + ((position.y - fBorderSize.y) / (1.0 - fBorderSize.y *2.)) * 0.5;
			}
		}
	}
	vec2 point = mouse.x > mouse.y ? changedTexcoord : position;
	vec4 color = GetColor(point);
	if (point.x < 0.0 || point.y < 0.0 || point.x > 1.0 || point.y > 1.0) color = vec4(0.0);
	
	gl_FragColor = color;

}