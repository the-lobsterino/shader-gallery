#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
//#define time

#define ROT_X(THETA) mat3(vec3(1, 0, 0), vec3(0, cos(THETA), sin(THETA)), vec3(0, -sin(THETA), cos(THETA)))

float random(float n) {
	return fract(abs(sin(n * 55.753) * 367.34));
}

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle),  sin(angle), cos(angle));
}

void main( void ) {
	vec2 uv = 1.1*(gl_FragCoord.xy * 2.0 -  resolution.xy) / min(resolution.x, resolution.y);
	
	if(max(abs(uv.y), abs(uv.x)) > 1.){ gl_FragColor = vec4(0);return; }
	
	if(abs(abs(uv.x)-0.3343) < 0.0125){ gl_FragColor = vec4(0);return; }
	if(abs(abs(uv.y)-0.3333) < 0.0125){ gl_FragColor = vec4(0);return; }
	
	float th = time*0.5+uv.x*1.5-fract(0.5+uv.x*1.5) + 2.*(uv.y*1.5-fract(0.5+uv.y*1.5));
	
	
	uv *= rotate2d(time * 0.2); //time * 0.5

	float direction = 1.0;
	float speed = time * direction * 1.6;
	float distanceFromCenter = length(uv);

	float meteorAngle = atan(uv.y, uv.x) * (180.0 / PI);

	float flooredAngle = floor(meteorAngle);
	float randomAngle = pow(random(flooredAngle), 0.2);
	float t = speed + randomAngle;

	float lightsCountOffset = 0.4;
	float adist = randomAngle / distanceFromCenter * lightsCountOffset;
	float dist = t + adist;
	float meteorDirection = (direction < 0.0) ? -1.0 : 0.0;
	dist = abs(fract(dist) + meteorDirection);

	float lightLength = 100.0;
	float meteor = (5.0 / dist) * cos(sin(speed)) / lightLength;
	meteor *= distanceFromCenter * 2.0;

	vec3 color = vec3(0.);
	color.gb += meteor;
	
	color = abs(color*ROT_X(th));
	color = abs(color.brg*ROT_X(th/2.));
	color = abs(color.bgr*ROT_X(th*4.));
	
	gl_FragColor = vec4(color, 1.0);
}