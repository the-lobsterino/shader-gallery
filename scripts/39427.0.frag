#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI_F 3.14159265359

float atan2(in float y, in float x)
{
    bool s = (abs(x) > abs(y));
    return mix(PI_F/2.0 - atan(x,y), atan(y,x), s == false ? 1.0 : 0.0);
}

void main( void ) {

	float aspectRatio = resolution.x / resolution.y;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x *= aspectRatio;
	vec2 midpt = vec2(aspectRatio, 1.0) * 0.5;
	vec2 midptToPosn = position - midpt;
	float distRaw = distance(midpt, position);
	float angle = atan2(midptToPosn.y, midptToPosn.x);
	if(midptToPosn.x == 0.0)
	{
		angle = 0.0;	
	}
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	angle += time;

	float modifiedDist = (distRaw + cos(angle * 1.0) * 0.5) * 48.0;
	if(modifiedDist > 0.3)
	{
		float x = cos(modifiedDist);
		x = x * 100.0;
		color = vec3(x, x, x);
		color = vec3(cos(modifiedDist), cos(modifiedDist * 2.0), cos(modifiedDist * 4.0));
	}

	//color = vec3(modifiedDist, 0.0, 0.0);

	gl_FragColor = vec4( color, 1.0 );

}