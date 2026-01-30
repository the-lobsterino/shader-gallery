#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 resolution;

float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}

void main(void) { 
	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;
	
	
	float inner_radius = 0.2;
	float outer_radius = 0.5;
	
	float t = time * 0.7;
	float f = 0.0;
	for(int i = 0; i < 4; i++){
	    float k = fract(float(i) * .1 + t);
	    float r = inner_radius + k * (2.0 - k) * (outer_radius - inner_radius);
	    float d = sdHexagon(p, r);
	    float h = smoothstep(-0.01, 0.0, d) - smoothstep(0.005, 0.01, d);
	    float a = 1.0 - (r - inner_radius) / (outer_radius - inner_radius);
	    f = max(f, h * a);
        }
	

	
	gl_FragColor = vec4(vec3(192., 85., 86.) / 255.0 * f, 1.0);
}