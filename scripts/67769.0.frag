
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution;

    float y = pow(st.x,2.2);

    vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
	
	float y2 = pow(st.x,1. / 2.2);
	float pct2 = plot(st,y2);
    	vec3 color2 = (1.0-pct2)*color+pct2*vec3(0.0,1.0,0.0);
	
	
	float mixf = 0.5 + 0.5 * sin(time);
    vec3 finalColor = mix(color, color2, mixf);

    gl_FragColor = vec4(finalColor,1.0);
}