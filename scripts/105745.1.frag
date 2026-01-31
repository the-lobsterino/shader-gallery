#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	vec4 color;
	
        color.a = cos(time) / 10.0;
	color.r = 1.0;
	color.g = tan(time);
	color.b = 1.0 / tan(time);
	
	for(float i = 0.0; i < 2000.0; i++) {
		float yoffset = tan(i + time) * time;
		vec2 tpos = vec2(+i * 1.0, 100.0 + yoffset);
		float dist = distance(position, tpos);
		
		dist += cos(time * dist * cos(time)) * sin(time) - (time * 10.0);
		
		if(dist < 14.0) {
		  	color.a = 3.0 - dist;
			color.r = 1.0;
			color.g = tan(time);
			color.b = tpos.y / tan(time);
		}
	}


	gl_FragColor = color;

}