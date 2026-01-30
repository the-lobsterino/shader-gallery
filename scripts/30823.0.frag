#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st = st *2.-1.;
	
    st.x *= resolution.x/resolution.y;
    st *= mouse.x;
    st *= fract(distance(st, vec2(cos(time), sin(time)))*distance(st, vec2(sin(time), cos(time))));
    
   gl_FragColor = vec4( vec3(cos(st.x*100.), cos(st.y*100.), 0.), 1.0 );
}