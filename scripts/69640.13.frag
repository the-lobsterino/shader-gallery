#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution.xy;
	position.x = position.x*3.5-2.5;
	position.y = position.y*2.0-1.0;

	position *= pow(mouse.x, 4.);
	vec2 o = vec2(-0.743643887035763,0.13182590421259918);
	position += o;

	float x = 0.0;
	float y = 0.0;
	int i;
	const int max_iteration = 1000;
	for (int iteration = 0; iteration <= max_iteration; iteration++) {
		if (x*x + y*y > 4.0) {break;}
       		float xtemp = x*x - y*y + position.x;
        	y = 2.0*x*y + position.y;
        	x = xtemp;
        	i++;
	}
   	float f = float(i)/float(max_iteration);
   	//gl_FragColor = vec4(f,f,f,0);
	vec3 col = vec3(f,f,f);
	//vec3 col = vec3(time,time,time)-6099.0;
	gl_FragColor = vec4(col,1);
}