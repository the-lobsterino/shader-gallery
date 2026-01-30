#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float sphere = 100.0;

float getAngle(vec2 pos) {
	vec2 center = resolution.xy / 2.0;
	float diffX = pos.x - center.x;
	float diffY = pos.y - center.y;
	
	return atan(0.0, 0.0) - atan(pos.y - center.y, pos.x - center.x);
}

float getRadiansFromTime() {
	return PI - mod(time * 5.0, PI * 2.0);
}

float circle(float angleK) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float distanceFromCenter = distance(gl_FragCoord.xy, resolution.xy / 2.0);

	float color = 0.0;
	
	float startAngle = getRadiansFromTime();
	float currentAngle = getAngle(gl_FragCoord.xy) + mod(angleK, PI * 2.);
	float angleDiff = startAngle - currentAngle;
	
	color = 1.0 - mod((currentAngle / PI / 2.0) - (startAngle / PI / 2.0), 1.0);
		
	color = color * (1.0 - abs((distanceFromCenter) - sphere) / 5.0);
	
	return color;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float distanceFromCenter = distance(gl_FragCoord.xy, resolution.xy / 2.0);
	

	float color = 0.0;
	float r = circle(0.0);
	float g = circle(1.7);
	float b = circle(3.5);
	

	gl_FragColor = vec4( r, g, b, 1.0 );

}