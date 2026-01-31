#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x = fract(uv.x*3.);
	uv.y = fract(uv.y*4.);
	float circle = smoothstep(distance(uv,vec2(.33)),.175,.28);
	float border = step(1.-distance(uv,vec2(.5)),.55);
	vec3 circleCol = mix(vec3(1.,0.,1.),vec3(1.,.45,0.),circle);

        gl_FragColor = vec4(circleCol+vec3(border,border,0.),1.);
}