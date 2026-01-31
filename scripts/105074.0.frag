#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += position.x/position.y;
	color /= distance(position,vec2(.5,.5)) * distance(position,vec2(0.,1.) - 3.);
	color -= 5.;
	color += sin(position.x + time*2.) * 6.;
	color += distance(position*2.,(vec2(.1) / vec2(.7)));
	position.y -= 0.5;
	position.x -= 0.5;
	color += cos(position.x*20./position.y) * .5;

        gl_FragColor = vec4(vec3(color/.03,color/.9,sin(time)),1.);

}