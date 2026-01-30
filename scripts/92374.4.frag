#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D texture;

float getDistance(vec2 v1, vec2 v2) {
	return distance(v1, v2);
}

vec2 getCurrentPosition() {
	return gl_FragCoord.xy;
}

vec4 getCurrentColor() {
	return texture2D(texture, gl_FragCoord.xy / resolution.xy);
}

vec2 getMousePosition() {
	return mouse * resolution;
}

vec4 getPixel(float x, float y) {
	return texture2D(texture, vec2(x, y) / resolution.xy);
}

void drawCircle(vec2 pos, int diameter) {
	float dist = getDistance(getCurrentPosition(), pos);
	float color = 1.0 - step(float(diameter), dist);
	gl_FragColor = vec4(vec3(max(color, gl_FragColor.r)), 1.0);
}

void main() {
	gl_FragColor = getCurrentColor();
	
	vec2 pos = getCurrentPosition();
	float value = getCurrentColor().r;

	drawCircle(getMousePosition(), 5);

	if (value == 0.0) {
		float topValue = getPixel(pos.x, pos.y + 1.0).r;
		
		if (topValue == 1.0)
			gl_FragColor = vec4(1.0);
		
		return;
	}
	
	if (value == 1.0) {
		if (pos.y < 1.0) return;
		
		float bottomValue = getPixel(pos.x, pos.y - 1.0).r;	
		
		if (bottomValue == 0.0) 
			gl_FragColor = vec4(0.0);
			
		return;
	}
}