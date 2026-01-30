#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const mat2 rot = mat2(.707, .707, -.707, .707);

// simple wave function
float wave(vec2 uv) {
	float t = sin(uv.x + cos(uv.y));
	return t * t;
}

float map(vec2 uv) {
    
    float t = 0.;
   		
    // layer waves -> rotate, translate and scale
    for (float i = 0.; i < 1.; i += .2) {
    	
        uv *= rot;
        uv.y += time * .2;
        t += wave(uv * i * 1.5);
        
        uv *= vec2(2., 1.25);
    
    }
    
    return abs(2. - t);

}


void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	uv *= 2.;
	float m = map(uv);
	
	vec2 o = vec2(.01, 0.);
	vec3 n = normalize(vec3(m - map(uv + o.xy),
				m - map(uv + o.yx), -o.x));
	
	vec3 l = normalize(vec3(cos(time * 1.2), 1. + sin(time * .5), -1.1));
	vec3 v = normalize(vec3(uv, 1.0));
	
	float diff = max(dot(n, l), 0.);
	float spec = pow(max(dot(n, normalize(l-v)), 0.), 8.);
	

	col += m * .3;
	col += vec3(.2, 0., .2) * diff * .5;
	col += vec3(0., 1., 1.) * spec * .5;
	

	gl_FragColor = vec4(col, 1.);
}