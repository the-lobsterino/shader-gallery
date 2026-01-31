#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x += time*.1;
	uv.y -= time*.02;
	uv = fract(uv*3.);

	float pattern = mod(time/50.,uv.x+.05/uv.y+.2) - smoothstep(distance(vec2(.5),uv),.2,.4);
	
	float holes = smoothstep(distance(vec2(.5),uv),.2,.5)*6.;
	
	uv.x -= sin(time);

	gl_FragColor = vec4(vec3(pattern)+vec3(holes-uv.x+uv.y/2.,holes,0.),1.);

}