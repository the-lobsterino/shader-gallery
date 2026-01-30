#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float time = 1800.*sqrt(time)/time;
float ray = sqrt(time)/pow(time, .89456);
	vec2 position = ( gl_FragCoord.xy / resolution.y );
	vec3 color ;
	vec2 p = vec2(0.5);
	p.x *= cos((time));
	p.y *= sin((time));
	if(p.y < 0.04)
		p.y = 0.45;
	if(p.x <0.42)
		p.x = 0.2;
	float distEucl =sqrt(pow(position.x - 1., 2.)+ pow(position.y - .5,2.)); 
	distEucl /= time*0.1;
	if(distEucl < ray)
	{
	 color = vec3(p.x*9.9,0.0*p.y/distEucl,(p.x*p.y)/distEucl);
}
	gl_FragColor = vec4(color , sin(cos(time)/distEucl) );

}