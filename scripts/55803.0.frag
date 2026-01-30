#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D bb;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
	vec2 p = gl_FragCoord.xy / resolution.x * .5;
	
	vec3 c1;
	float tt = time * 0.04;

        for(float i = 1.0; i < 20.0; i++){
		p.x += 0.1 / (i) * sin(i * 7.0 * p.y + tt + cos((tt / (20. * i)) * i));
     		p.y += 0.1 / (i)* cos(i * 10.0 * p.x + tt + sin((tt / (15. * i)) * i));
     	}
     	c1.r = abs(p.x + p.y);
	c1 = palette(c1.r, vec3(0.8, 0.5, 0.4), vec3(0.2, 0.4, 0.2), vec3(2.0, 1.0, 1.0), vec3(0.00, 0.25, 0.25));
	
	vec3 c2;
        for(float i = 1.0; i < 100.0; i++){
		p.x += 0.1 / (i) * sin(i * 7.0 * p.y + tt + cos((tt / (20. * i)) * i));
     		p.y += 0.1 / (i)* cos(i * 10.0 * p.x + tt + sin((tt / (15. * i)) * i));
     	}
     	c2.r = abs(p.x + p.y);
	c2 = palette(c2.r, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.00, 0.10, 0.20));
	
	
    	gl_FragColor = vec4(mix(c1, c2, 0.3), 1.0);
}