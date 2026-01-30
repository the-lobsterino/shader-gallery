#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
        p.y -= time*-.1;
	float base = fract(step(p.x*45.,.9)*3.);
	float cyl = sin(p.y*40.);
	gl_FragColor = vec4(vec3(base*8.,cyl,0),1);

}