// Necip's modifications of the imaginary part
// More functions on: http://www.shaderific.com/glsl-functions


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float mandelBrot(vec2 p) {
	p.x = p.x * 3.5 - 2.5;
	p.y = p.y * 2.0 - 1.0;
	
	vec2 xy = vec2(0.);
	int itter = 0;
	const int maxItter = 128;
	
	for(int i = 0; i < maxItter; i++) {
		if (dot(xy, xy) > 4.) {
			break;	
		}
		
		float xtemp = dot(vec2(xy.x, -xy.y), xy) + p.x;
		xy.y = 2. * sin(time*0.1) * xy.x * xy.y + p.y;
		xy.x = xtemp;
		
		
		xy += reflect(xy, p);
		
		itter++;
	}
	
	return float(itter) / float(maxItter);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	vec2 tuv = uv - .5;    	
	vec3 color = vec3(0.0);
	     color += mandelBrot(tuv * 2. + .5);

	
	gl_FragColor = vec4(pow(color, vec3(1.0 / 3.0 )), 1.0 );

}