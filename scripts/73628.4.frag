#ifdef GL_ES
precision highp float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tw()
{
	return sin(time*4.5) * 0.5 + 0.5;
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v * tw();
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.x;
	uv = rotate(uv, time*3.);	


	//vec3 color;
	vec3 color2;
	float y = uv.x + time*0.1;
	uv = rotate(uv, 10.5+tw()-tw());
	for (int i = 0; i < 20; i++) {
		float d = uv.x - sin(y * float(1+i)/7.) * .9;
		color2[i/4] = .5 / (d * d);
	}
	
	uv.x = uv.x / uv.y;
	
	color2 -= sqrt(5.-15.5*length(uv*(.67+tw())));
	
	//gl_FragColor = vec4(color2,1.0);
	//gl_FragColor = vec4(color, 1.0);
	gl_FragColor = vec4(color2,1.0);
}


