#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define MAX_ITER 5

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( ) {
	float letime = time * .1+23.0;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    

        vec2 p = mod(uv*TAU, TAU)-250.0;

	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .005;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = letime * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 8.0));
	vec3 rgbColour = vec3(0.3, 0.5, 0.8);
        colour = clamp(colour + rgbColour, 0.0, 1.0);
	
	
	if((colour.r >= colour.g && colour.g >= colour.b) || (colour.r >= colour.b && colour.g >= colour.b)){
		gl_FragColor = vec4(colour, vec3(max(colour.r*0.1, max(colour.g*0.1, colour.b))));
	}else if(colour.r >= colour.g && colour.b >= colour.g || (colour.r >= colour.b && colour.b >= colour.g)){
		gl_FragColor = vec4(colour, vec3(max(colour.r*0.1, max(colour.b*0.1, colour.g))));
	}else if((colour.g >= colour.r && colour.r >= colour.b) || (colour.g >= colour.b && colour.r >= colour.b)){
		gl_FragColor = vec4(colour, vec3(max(colour.g*0.1, max(colour.r*0.1, colour.b))));
	}else if((colour.g >= colour.r && colour.b >= colour.r) || (colour.g >= colour.b && colour.b >= colour.r)){
		gl_FragColor = vec4(colour, vec3(max(colour.g*0.1, max(colour.b*0.1, colour.r))));
	}else if((colour.b >= colour.g && colour.g >= colour.r) || (colour.b >= colour.r && colour.g >= colour.r)){
		gl_FragColor = vec4(colour, vec3(max(colour.b*0.1, max(colour.g*0.1, colour.r))));
	}else if((colour.b >= colour.g && colour.r >= colour.g) || (colour.b >= colour.r && colour.r >= colour.g)){
		gl_FragColor = vec4(colour, vec3(max(colour.b*0.1, max(colour.r*0.1, colour.g))));
	}
}