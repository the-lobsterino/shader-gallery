#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float mr = 1.0;
	float mg = 1.0;
	float mb = 1.0;
	for(float i=0.0; i<5.0; i+=1.0)
	{
		float d = distance(position, vec2(sin(time*(0.042+i*0.048)), sin(time*(0.025+i*0.036))));
		mr*=sin(d*(60.0+sin(time*1.00)*0.2));
		mg*=sin(d*(60.0+sin(time*1.10)*0.2));
		mb*=sin(d*(60.0+sin(time*1.20)*0.2));
	}
	vec3 color;
	if(mr<0.0)
		color[0] = -mr;
	else
		color[0] = 1.0;
	if(mg<0.0)
		color[1] = -mg;
	else
		color[1] = 1.0;
	if(mb<0.0)
		color[2] = -mb;
	else
		color[2] = 1.0;
	gl_FragColor = vec4(color, 1.0);

}