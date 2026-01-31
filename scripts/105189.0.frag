// is pattern, also not made in cambridge.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926;
const float L = .5;
//float n = 6.0;
//float m = 1.55;
const float epsilon = 0.1;

void main()
{


	float tt = fract(-time*0.4)*6.28;
vec2 F = resolution.xy; 
    vec2 R = resolution.xy;
    vec2 uv = gl_FragCoord.xy / R.x;
	
	uv *= 5.5;
	
	uv+=mouse;
    uv -= 0.5 * R / R.x;
	float d1 = length(uv*3.33);
	float n = 6.66;
	n += cos(d1+uv.y*3.0+time*0.2)*2.0;
	float m=sin(uv.x*5.0+time-(d1*0.34))*2.0;

    n += 1.00*sin(uv.y+time);
    m += .26*cos(time+uv.x*0.5);

    float node = abs(cos(n * PI * uv.x / L) * cos(m * PI * uv.y / L)
                   - cos(m * PI * uv.x / L) * cos(n * PI * uv.y / L));

	
	float v = smoothstep(0., epsilon, node*0.05);
	v=0.3/pow(v,.75);
	
	float xx = length(vec3(v*.55,v*0.45,v*0.85));
	xx = smoothstep(.05,2.0,xx);
	xx = pow(xx,32.0);
	

	gl_FragColor = vec4( vec3((0.5+sin(tt+length(uv*34.0)*0.25))*xx,xx*0.5,xx*1.2), 1. );
//	v=d1;
//	gl_FragColor = vec4( vec3(v*.55,v*0.45,v*0.85), 1. );
}
