#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	uv *= 5.;
	uv /= smoothstep(1., -3., uv.y+1.);
	
	vec3 color = vec3(0);
	
	vec2 gv = fract(uv)-.5;
	
	if (gv.x >= .44 || abs(sin(gv.y*20.-time*3.)) >= .99) {
		color.r = 1.-smoothstep(0., -10., uv.y);
	}
	
	
	vec3 sunColor = vec3(1, 194./255., 21./255.);
	float d = distance(uv, vec2(0, 0));
	vec3 skyColor = vec3(1., 113./255., 206./255.) * (1.-smoothstep(-1., 1.5, uv.y));
	vec2 av = uv;
	av.y -= (0.8+sin((uv.y*50.)-(time*2.)));
	if (d < 0.1) {
		color.rgb = mix(sunColor, skyColor, smoothstep(0., 0.3, av.y));
	}
	color.bg += fract(1.-smoothstep(0., 1., distance(uv, vec2(0.))))/5.;

	gl_FragColor = vec4(color, 1);

}