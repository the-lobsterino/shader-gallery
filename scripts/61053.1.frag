#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (1./time) * (( gl_FragCoord.xy / resolution.xy + mouse * 2. - 1.0) * 5. - 2.5);

	float color = 0.0;

	vec2 z = vec2(position);
	float it = 0.0;
	for (int i = 0; i < 32; i++)
	{
		vec2 c = position; //vec2(sin(mouse.x)*mouse.y,cos(mouse.x)*mouse.y);
		z = vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y) + c;
		if (length(z)>2.)
			break;
		it++;	
	}
	
	color=pow(1.-1./it,5.);
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}