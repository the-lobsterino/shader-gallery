#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

float random(float x){
    return fract(sin(x)*100000.0);
}

float smoothrandom(float x){
    float i = floor(x);  // integer
	float f = fract(x);  // fraction
    return mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
}

void main() {
	vec2 st = gl_FragCoord.xy/resolution;
	st.x *= resolution.x/resolution.y;

    float y = smoothrandom(st.x*3.+time*2.);
    y*=y*y;

    vec3 color = vec3(0.);

    // Plot a line
    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(1.-step(0.5,y),step(0.5,y),0.0);
    pct = plot(st,0.5);
    color = (1.0-pct)*color+pct*vec3(1,1,1);

	gl_FragColor = vec4(color,1.0);
}
