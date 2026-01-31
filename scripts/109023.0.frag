#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

  	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
       	float fire = uv.y-abs(uv.x-uv.y)+min(uv.x-.5,.6);
	vec3 color = mix(vec3(1.,0.,0.),vec3(1.,1.,0.),fire);

	gl_FragColor = vec4( vec3( color ), 1.0 );

}