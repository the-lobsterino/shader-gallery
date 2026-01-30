#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592653589793;
const vec2 leftAxis = vec2(0.5, 0.);

float modulo(float a, float b) {
	return a - (b * floor(a/b));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 Hex2Rgb(int c) {
	float fc= float(c);
	float n = 256.;
	float r = modulo((fc / n / n), n);
	float g = modulo((fc / n     ), n);
	float b = modulo((fc            ), n);
	return vec3(r / n, g / n, b / n);
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                 _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float Sphere(vec2 p, float r, vec2 c) {
	return smoothstep(r+(r*0.01),r-(r*0.01), distance(p, c));
}

float Band(float p, float start, float end) {
	return step(start,p) - step(end,p);
}

float Line(in vec2 p, vec2 c, vec2 scale, vec2 rot, vec3 color) {
	vec2 dir = normalize(c);
	float angle = atan(dir.x, dir.y);
	
	// Move point to center
	p -= c;
	// Rotate
	p *= rotate2d(angle);
	// Move pivot to bottom of the rect
	p.y -= scale.y;
	// Put it back in place
 	p += c;
	p *= rotate2d(angle + sin(time) * 0.1);
	c *= rotate2d(angle + sin(time) * 0.15);
	
	float x = Band(p.x, c.x - scale.x, c.x + scale.x);
	float y = Band(p.y, c.y - scale.y, c.y + scale.y);
    	return sin(x * y)+sin(time) * 0.01;
	
}



void main( void ) {

	vec2 uv = ( gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	//vec2 uv = gl_FragCoord.xy/resolution.xy;

	float r = 0.1;
	vec3 color = vec3(0.);
	float sphere = Sphere(uv, r, vec2(0.));
	color += sphere;

	for (float x=0.0; x<acos( -1. ) * 1.95 ; x += acos(-1.)/14.) {
		color += Line(uv, 
			      vec2(
				      (r + 0.01) * cos(x), 
				      (r + 0.01) * sin(x)
			      ), 
			      vec2(
				      0.003,
				      0.015 * abs(sin(time))
			      ),
			      vec2(cos(x), sin(x)),
			color);;
	}
	
	color *= vec3(0.8, 0.5, 0.0);
	
	 
	gl_FragColor = vec4( color, 1.0 );

}