#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	vec3 data0 = vec3(-5.515433, -8.626703,-10.000000);
	vec3 data1 = vec3(8.626703, 5.515433,-10.000000);
	vec3 data2 = vec3(-5.515433, -8.626703,10.000000);
	vec3 data3 = vec3(8.626703, 5.515433,10.000000);
	vec3 data = mix(mix(data0, data2, pos.y), mix(data1, data3, pos.y), pos.x);

	gl_FragColor = vec4( data, 1.0 );

}