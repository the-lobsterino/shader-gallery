#ifdef GL_ES
precision highp float;
#endif

// Wave Interference by feliposz (2017-10-02)

// Entanglement Mods by sphinx

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;


void main() 
{
	vec4 buffer = texture2D(renderbuffer,gl_FragCoord.xy/resolution);
	vec2 aspect = vec2(resolution.x/resolution.y, 1.0) * buffer.y * 2. + buffer.x - buffer.z;
	vec2 pos = (gl_FragCoord.xy - 0.5*resolution)/resolution.y;

	vec2 mousePos = (mouse - 0.5)*aspect;
	vec2 invPos = (0.5 - mouse)*aspect;

//	vec2 mousePos = (mouse - 0.5)*aspect * .25;
//	vec2 invPos =  vec2(-cos(time*23.), -sin(time*22.))*.5;//(0.5 - mouse)*aspect;
	
	
//	vec2 mousePos = vec2(cos(time*12.), sin(time*5.))*.00125;//(mouse - 0.5)*aspect;
//	vec2 invPos =  vec2(-cos(time*25.), -sin(time*32.))*.92;//(0.5 - mouse)*aspect;

	float centerDist = 1.0 - length(pos);
	float mouseDist = length(pos - mousePos);
	float hotSpot1 = 0.2/mouseDist;
	float invDist = length(pos-invPos);
	float hotSpot2 = 0.2/invDist;
	float f		= 30.;
	float t		= f * time - time * (buffer.w-buffer.z) * f;
	gl_FragColor = vec4(centerDist + buffer.z, (hotSpot1 * hotSpot2), sin(invDist*55.0 + t) * sin(mouseDist*55.0 + t + time * f), buffer.y);
	gl_FragColor = mix(gl_FragColor, buffer, .9);
}
