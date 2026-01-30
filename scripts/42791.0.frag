#ifdef GL_ES
precision highp float;
#endif

// Wave Interference by feliposz (2017-10-02)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 aspect = vec2(resolution.x/resolution.y, 1.0);
	vec2 pos = (gl_FragCoord.xy - 0.5*resolution)/resolution.y;
	vec2 mousePos = (mouse - 0.5)*aspect;
	vec2 invPos = (0.5 - mouse)*aspect;
	float centerDist = 1.0 - length(pos);
	float mouseDist = length(pos - mousePos);
	float hotSpot1 = 0.2/mouseDist;
	float invDist = length(pos-invPos);
	float hotSpot2 = 0.2/invDist;
	gl_FragColor = vec4(centerDist, hotSpot1 * hotSpot2, sin(invDist*55.0 + time) * sin(mouseDist*55.0 + time), 1.0);
}
