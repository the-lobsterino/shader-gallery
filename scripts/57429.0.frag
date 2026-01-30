#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Spatial ambiance
void main() {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float pct = distance(position,vec2(mouse));
	//pct -= cos(time);
	pct *= sin(time);
	pct = smoothstep(pct,pct+1.0,0.1);
	gl_FragColor = vec4(pct,0.0,1.0,1.0);
}