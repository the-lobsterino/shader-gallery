#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define R length(surfacePosition)
#define TH atan(surfacePosition.x, surfacePosition.y)
#define time time*0.1 + R*sin(TH*33.)*0.5 + pow(R, sin(1.+time*0.1+R*R*R))
const float PI = 3.14159265359;
const float RADIANS = 2. * PI;
const float second = 1.;
const float minute = 60. * second;
const float hour  = 60. * minute;
const float day   = hour * 24.;
vec2 rotate(vec2 a, float angle){
	return vec2(a.x * cos(angle) - a.y * sin(angle), a.x * sin(angle) + a.y * cos(angle));
}
vec2 center = resolution.xy/2.;

void main( void ) {

	
	
	float s = mod(time, (second * 29.)) / (second * 29.);
	float m = mod(time, (second * 7.)) / (second * 7.);
	float h = mod(time, (second * 11.)) / (second * 11.);
	float d = mod(time, (second * 19.)) / (second * 19.);
	vec4 null = vec4(0,0,0,0);
	vec4 rim;
	
	float radius = 500.0; 		
	vec2 sCenter = resolution.xy/2.0 + sin(m * RADIANS) * (radius)/10. + rotate(vec2(radius,0), -s * RADIANS );
	vec2 mCenter = resolution.xy/2.0 + sin(m * RADIANS) * (radius)/10. + rotate(vec2(-radius,0), -m * RADIANS );
	vec2 hCenter = resolution.xy/2.0 + sin(m * RADIANS) * (radius)/10. + rotate(vec2(0,radius), -h * RADIANS );
	vec2 dCenter = resolution.xy/2.0 + sin(m * RADIANS) * (radius)/10. + rotate(vec2(0,-radius), -d * RADIANS );
	
	float sDistance = length(sCenter - gl_FragCoord.xy);
	float mDistance = length(mCenter - gl_FragCoord.xy);
	float hDistance = length(hCenter - gl_FragCoord.xy);	
	float dDistance = length(dCenter - gl_FragCoord.xy);	
	vec4 sV = vec4(
		(sin(time + 2./3. * RADIANS)),
		(sin(time + 3./3. * RADIANS)),
		(sin(time + 1./3. * RADIANS)),
		0) / sDistance * 128.;
	vec4 mV = vec4(
		(sin(time + 3./3. * RADIANS)),
		(sin(time + 1./3. * RADIANS)),
		(sin(time + 2./3. * RADIANS)),
		1) / mDistance * 128.;
	vec4 hV = vec4(
		(sin(time + 1./3. * RADIANS)),
		(sin(time + 2./3. * RADIANS)),
		(sin(time + 3./3. * RADIANS)),  
		0) / hDistance * 128.;
	
	vec4 dV = vec4(
		1,
		1,
		1,
		1
	) / dDistance * 128.;
	
	
	float within = length(center - gl_FragCoord.xy) - radius;
	rim = vec4(2,2,2,2) * within;
	
	vec4 _sV = sV/within * 3.;
	vec4 _mV = mV/within * 7.;
	vec4 _hV = hV/within * 5.;
	vec4 _dV = dV/within * 11.;

	
	float distanceToCenter = length(gl_FragCoord.xy - center) / length(center);
	
	gl_FragColor = 1. - ((((_mV+_hV+_dV+_sV)) * .5 + normalize(sV+mV+hV+dV) * 2.));
	
}