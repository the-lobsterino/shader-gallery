#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy-0.5*resolution.xy ) / resolution.y;
	uv = fract(uv*10.)-0.5;
	float s = abs(sin(fract(time*0.5)-smoothstep(1.0,.5,uv.x))*0.2);
	vec4 col = vec4(smoothstep(0.0, length(uv), s/1.5));
	float g = clamp(s*0.1,0.02,.3);
	//col += step(abs(uv.x), g) + step(abs(uv.y), g);
	
	gl_FragColor = col;

}