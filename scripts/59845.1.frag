#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

#define WAVE_SIZE 0.5
#define GRID_MIN_SIZE 1.5
#define GRID_MAX_SIZE 2.5
#define GRID_SPEED 0.75
#define RADIUS_SPEED 1.0
#define WAVE_SPEED 1.0
#define COLOR vec3(0.4, 0.0, 0.4)

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float plot(float sty, float pct){
  return  smoothstep( pct-WAVE_SIZE, pct, sty) -
          smoothstep( pct, pct+WAVE_SIZE, sty);
}

void main() {
	float constant = mix(GRID_MIN_SIZE, GRID_MAX_SIZE, 0.5 + sin(GRID_SPEED * time) / 2.0);
    vec2 st = gl_FragCoord.xy/resolution.xy * constant;
	
		float radius = sin(RADIUS_SPEED * time) / 2.0;
		float radius2 = cos(RADIUS_SPEED * time) / 2.0;
		float siny = (3.5  + sin(st.x  * 5.05* PI + time * WAVE_SPEED) * radius);
		float cosy = (3.0 + sin(st.x * 5.05* PI + time * WAVE_SPEED) * radius2);
		float pct = plot(st.y,siny);
		float pct2 = plot(st.y,cosy);
		siny = (0.5  + sin(st.x  * 5.05* PI + time * WAVE_SPEED) * radius);
		cosy = (0.0 + cos(st.x * 5.05* PI + time * WAVE_SPEED) * radius2);
		float pct3 = plot(st.y,siny);
		float pct4 = plot(st.y,cosy);
		siny = (1.5  + sin(st.x  * 5.05* PI + time * WAVE_SPEED) * radius);
		cosy = (1.0 + cos(st.x * 5.05* PI + time * WAVE_SPEED) * radius2);
		float pct5 = plot(st.y,siny);
		float pct6 = plot(st.y,cosy);
		siny = (2.5  + sin(st.x  * 5.05* PI + time * WAVE_SPEED) * radius);
		cosy = (2.0 + cos(st.x * 5.05* PI + time * WAVE_SPEED) * radius2);
		float pct7 = plot(st.y,siny);
		float pct8 = plot(st.y,cosy);
	
		//don't question this, this is genius

    //vec3 color = vec3(y);

    //color = pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4((pct2+pct + pct3 + pct4 + pct5 + pct6 + pct7 + pct8)*COLOR,1.0);
}

// i'm coming to get you nogard 