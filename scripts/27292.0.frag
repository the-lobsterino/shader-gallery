#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592;

float dist( vec2 first, vec2 second ) {
	return sqrt(pow(second.x - first.x, 2.0) + pow(second.y - first.y, 2.0));
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 colorWheel(vec2 loc, vec2 res, vec2 mousePos, float timeVal) {
	vec2 center = res.xy / 2.0;
	float maxDist = dist(vec2(0, 0), center);
	float value = 1.0 - (dist(vec2(mousePos.x * res.x, mousePos.y * res.y), center) / maxDist) / 4.0;
	float sat = 1.0 - (dist(loc, center) / maxDist);
	float maxResVal = max(res.x, res.y) / 2.0;
	
	float yPos = (loc.y - center.y) / maxResVal;
	float xPos = (loc.x - center.x) / maxResVal;
	float hue = 0.0;
	
	if (xPos == 0.0 && yPos >= 0.0) { hue = PI * 0.5; }
	else if (xPos == 0.0 && yPos < 0.0) { hue = 1.5 * PI; }
	else { hue = (PI + atan(yPos, xPos)); }
	
	float offset = (2.0 * PI) * (mod(timeVal, 20.) / 20.0);
	hue += offset;
	hue = mod(hue, 2.0 * PI);
	hue = hue / (2.0 * PI);
	
	vec3 color = hsv2rgb(vec3(hue, sat, value));
	return color;
}

void main( void ) {
	
	vec2 loc = gl_FragCoord.xy;
	loc.y = loc.y * sin(loc.x / 50.0);
	
	vec3 cw = colorWheel(loc, resolution.xy, mouse.xy, time);
	
	gl_FragColor = vec4(cw.r, cw.g, cw.b, 1.0);
	
}