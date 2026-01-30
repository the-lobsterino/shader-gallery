#ifdef GL_ES
precision mediump float;
#endif

// tessellation
// modify if you'd like

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec3 col = vec3(.4, .5, .6);

	for(float j = 0.; j < 10.; j++)
	{
		for(float i = -5.; i < 4.; i++)
		{
			col += vec3(i/((gl_FragCoord.x) - 100.*j  - sin(time)*10.));
		}
		for(float i = -5.; i < 4.; i++)
		{
			col += vec3(i/((gl_FragCoord.y) - 100.*j  - sin(time)*10.));
		}
	}
	gl_FragColor = vec4(col, 1.0);
}