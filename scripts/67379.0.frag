#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy  * 4. - 2.);// + mouse * 5. - 2.5;

	float color = 0.0;
	
	//(sin(time)/2.+.5)*9.+1.;
	vec2 z = uv;
	float r = mouse.y * 10.;
	//r=sqrt(r);
	
	float it = 0.;
	for (int i = 0; i < 128; i++)
	{
		it++;
		//z = r * z* (1. - z); 
		z = r * z - r * (vec2(z.x*z.x-z.y*z.y, z.x*z.y*2.));
		if (length(z)>2.)
			break;
	}
	it=mod(it,128.);
	if(it>1.)
		color = pow(1.-1./(it),4.);

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + 0. / 3.0 ) * 0.75 ), 1.0 );

}