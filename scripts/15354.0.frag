#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.x );
	float col;
	vec3 light;
	light = vec3(0.0);
	const int num = 6;
	for(int i = 0;i < num;++i)
	{
		col = pow(1.0-length(pos-vec2(cos(time+float(i))*0.125+0.5,sin(time+float(i))*0.125+0.25)),20.0);
		light += vec3(sign(abs(mod(float(i),3.0)-2.0))*col,sign(abs(mod(float(i),3.0)-1.0))*col,sign(abs(mod(float(i),3.0)))*col);
	}

	gl_FragColor = vec4( light, 1.0 );

}