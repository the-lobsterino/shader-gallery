#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
const float PI = 3.1415926535897932384626433832795;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float stroke(float xpos, float size, float width) {
    float d = step(size,xpos+width*.5) -
        	  step(size,xpos-width*.5);
    return(clamp(d, 0., 1.)); 
}

void main( void ) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    float slant = sin(time) * .2;
    float offset = cos(st.y*PI) * .09;

    
    vec3 color = vec3(0.);
    //color += step(.5 + cos((st.y) * PI) * .25, st.x);
	//color += step((st.x + st.y) * .5, .5);
    float scale = 30.;
    float x = asin(fract((st.x) * scale));
    float y = asin(fract((st.y) * scale));
    float s = .53 +(x - y)*.8;
    float t = (x + y)*.3;
    color += stroke(s, .5, .1);
    color += stroke(t, .1, .1);
    gl_FragColor = vec4(color,1.);

}