#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

float pro(float v)
{
	float p= sin(0.5321*time+v*0.53025 ) ;
	p= (p+cos(0.2321*time+v*0.43025 ))*0.5 ;
	for(int i = 1; i<5;i++)
	{
		p += ((p+cos(p*1.57+v*float(i)))*0.5);
		
	}
	return  1.-(1./((.1*p*sign(p))+1.));
}

void main( void ) {

	vec2 pos = surfacePosition*5.+vec2(time*2.,0.);
	pos.x+=floor(pos.y)*50.;
	vec3 v = vec3(pro(pos.x),pro(pos.x+4.),pro(pos.x+8.));
	vec3 col = (sin(4.2+pos.y*6.28)+1.)*((normalize(v)+v)*0.5);


	gl_FragColor = vec4( col, 1.0 );

}