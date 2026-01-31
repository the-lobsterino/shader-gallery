#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = cos(position.y) / tan(position.x*1.5) * .2;
        color += sin(pow(position.x*position.y,-5.+sin(time)*.1));
	float b = length(position) + distance(position,vec2(.5));

        gl_FragColor = vec4(vec3(color,b/2.,tan(time/3.)),1.);
}