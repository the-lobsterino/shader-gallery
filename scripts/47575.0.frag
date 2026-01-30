#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif




uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

float map(float value, float minFrom, float maxFrom, float minTo, float maxTo){
	return (value - minFrom) / (maxFrom - minFrom) * (maxTo - minTo) + minTo;	
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float drawCircle(vec2 xy, vec2 centerXY, float innerR, float r, float minValue, float maxValue){
	float curDist = distance(xy, centerXY);
	
	if(curDist < innerR)
		return maxValue;
	else if(curDist > r)
		return 0.0;
	else
	{
		float v = smoothstep(innerR, r, curDist);
		v = v*v;
		v = map(v, 0., 1., 1. -maxValue, 1. - minValue);
		return 1. - v;
	}	
}

float planet(vec2 xy, vec2 centerXY, float r, float minValue, float maxValue){
	float v = drawCircle(xy, centerXY, 0.0, r, minValue, maxValue); //sphere
	v *= drawCircle(xy, centerXY, r - 4.0, r, 0.0, 1.0);            //edge antialiasing
	
	return v;
}

void main( void ) {
	vec2 uv = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y);
	
	vec2 sunCenter = resolution / 2.;
	float sunValue = planet(gl_FragCoord.xy, sunCenter, 70., 0.05, 1.1);
	vec3 sunRGB = hsv2rgb(vec3(.16, 1., sunValue));
	
	vec2 earthCenter = vec2(sunCenter.x + cos(time) * 200., sunCenter.y - sin(time)* 200.);
	float earthValue = planet(gl_FragCoord.xy, earthCenter, 50., 0.05, 0.9);
	vec3 earthRGB = hsv2rgb(vec3(.4, 1., earthValue));	
	
	vec2 moonCenter = vec2(earthCenter.x + cos(time) * 100., earthCenter.y - sin(time)* 100.);
	float moonValue = planet(gl_FragCoord.xy, moonCenter, 25., 0.05, 0.7);
	vec3 moonRGB = hsv2rgb(vec3(.3, .2, moonValue));	
	
	vec3 rgb = sunRGB + earthRGB + moonRGB;
	
	gl_FragColor = vec4( rgb, 1.);
}

