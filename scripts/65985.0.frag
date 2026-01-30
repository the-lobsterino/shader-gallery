#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
void rect(float x, float y, float sixe, vec3 color, vec2 st) {
       	vec2 res;
	float left = step(x,st.x);   // То же, что ( X больше 0.1 )
        float bottom = step(y,st.y);
	res = step(vec2(x),st);
	res = step(vec2(y),2.0-st);
}

void main(){
 vec2 st = gl_FragCoord.xy/resolution.xy;
    vec3 color = vec3(0.0);
float pct;
    // bottom-left
    vec2 bl = step(vec2(0.1),st);
    float pctl1 = bl.x * bl.y;
	
    vec2 blin = step(vec2(0.2),st);
    float pctl2 = blin.x * blin.y;
	
    // top-right
     vec2 tr = step(vec2(0.1),1.0-st);
     pctl1 *= tr.x * tr.y;
	pctl1 = pctl1;
	
    blin = step(vec2(0.2),1.0-st);
    pctl2 *= blin.x * blin.y;
	pct = pctl2- 1.0;
     pct = pctl1 - pctl2;
    color = vec3(pct);

    gl_FragColor = vec4(color,0.0);
}
