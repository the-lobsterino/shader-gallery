#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.14159265359;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	position -= 0.5;
	position.y *= resolution.y / resolution.x;

	float points = 5.0 + 2.0 * sin(time * 0.2);
	//points = 6.0;
	float lum = 0.0;
	position.y = abs(position.y);
	for (int i=1; i<6; i++) {
		float ang = abs(mod((atan(position.y, position.x)) / pi / 2.0 * points + time*0.1, 1.0) - 0.5);
		float dist = length(position);
		float pointiness = 0.5 + pow(2.0 * ang, 2.5);
		pointiness = min(1.0, max(0.0, float(20/i)*pointiness - dist * float(100/i)));
		//lum = abs(lum - pointiness);
		lum = max(lum, pointiness);
		
		ang *= 2.0 * pi / points;
		dist *= 2.7;
		position = dist * vec2(-cos(ang), sin(ang));
		position.x += 0.7;
	}


	gl_FragColor = vec4( vec3(0.1, 0.5, 0.7) + vec3( lum ), 1.0 );

}