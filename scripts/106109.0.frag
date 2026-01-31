#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0);
	uv*=uv.y+2.*sin(uv.y*fract(.25));
	color = vec3(pow(1.5 - length(uv), 1.50));
        color = 1. - exp( -color);
	vec3 col=vec3(1.75,4.5,2.0*uv.y);
	gl_FragColor = vec4(col*color, 1.0);

}