#ifdef GL_ES
precision mediump float;
#endif
#define n 80.0
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
	st.x += time*0.001;
	st.y += time*0.001;
    st.x *= resolution.x/resolution.y;
    st.x *= time*0.001;
    st.y *= time*0.001;
    vec2 z,c = (st-vec2(1.0,0.5))*2.0;
    float y=0.0;
    for(float i=0.0; i<n; i++) {
        z=c+z*mat2(z.x,-z.y,z.yx);
        if(dot(z,z) > 4.0) break;
        y++;
    }
     gl_FragColor =  vec4(vec3(y/n),1.0);
}




