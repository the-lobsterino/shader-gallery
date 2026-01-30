#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/max(resolution.x,resolution.y);

	float d = length(uv);
	float a = time*-0.4+atan(uv.x,uv.y);
	uv.y *= 1.8+sin(d+time+uv.x*3.17)*1.15;
	uv.x *= 1.5-sin(d-time+uv.y*2.61)*1.05;
	
	
	gl_FragColor = vec4(.85+sin(d*22.0+a*6.+uv.y*2.4+d*11.0+uv.x*4.3+time*1.5+uv)*1.25, 0.8+sin(d*18.0+a*5.0+uv.x*4.3+uv.y*2.7+time*2.2+uv)*1.15);
	
	float v = length(gl_FragColor);
	gl_FragColor.xyz = vec3((v*v)*0.14);
	gl_FragColor.x*=0.9;
	gl_FragColor.y*=0.7;
	gl_FragColor.w = 1.0;
}