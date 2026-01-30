#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform sampler2D bb;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
float v(in float x){
	return sin(x*1.0);
}
void main() {
	vec2 p = gl_FragCoord.xy / resolution.x * 0.9;
	vec3 col;
	float tt = time * 1.0;

        for(float i = 1.0; i < 50.0; i++){
		p.x += 0.1 / (i) * v(i * 7.0 * p.y + tt + v(tt / (19.27 * i) * i));
     		p.y += 0.1 / (i)* v(i * 5.0 * p.x + tt + v((tt / (6.89 * i)) * i));
     	}
     	col.r = abs(p.x + p.y);
    	//gl_FragColor = vec4(palette(col.r, vec3(0.8, 0.5, 0.4), vec3(0.2, 0.4, 0.2), vec3(2.0, 1.0, 1.0), vec3(0.00, 0.25, 0.25)), 1.0);
	gl_FragColor = vec4(palette(col.r, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 0.0), vec3(0.00, 0.20, 0.20)), 1.0);
}