#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = vec2(gl_FragCoord.x - resolution.x / 2., gl_FragCoord.y - resolution.y / 2.);
	
	gl_FragColor = vec4(.3, .5, .6, 1.);
	
	
	
	if(pow(pos.x, 2.) + pow(pos.y, 2.) < pow(202.5, 2.) && pow(pos.x, 2.) + pow(pos.y, 2.) > pow(197.5, 2.))
		gl_FragColor = vec4(1., 1., 1., 1.);
	
	
	
	if(pow(pos.x - 200.*sin(8.*time), 2.) + pow(pos.y - 200.*cos(8.*time), 2.) < pow(25., 2.))
		gl_FragColor = vec4(0., 0., 1., 1.);
	
	if(abs(pos.x - 200.*sin(8.*time)) < 15. && abs(pos.y - 200.*cos(8.*time)) < 5.)
		gl_FragColor = vec4(0., 0., 0., 1.);
	
	
	
	if(pow(pos.x, 2.) + pow(pos.y, 2.) < pow(50., 2.))
		gl_FragColor = vec4(1., 0., 0., 1.);

	if(abs(pos.x) < 15. && abs(pos.y) < 5.)
		gl_FragColor = vec4(0., 0., 0., 1.);
	
	if(abs(pos.x) < 5. && abs(pos.y) < 15.)
		gl_FragColor = vec4(0., 0., 0., 1.);
	
	
	
}