#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 u_mouse;
uniform float time;

float random (vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

float rand(float f)
{
    return random(vec2(f));
}

float noise(float x)
{
	float i = floor(x);  // integer
	float f = fract(x);  // fraction
	return mix(rand(i), rand(i + 1.0), smoothstep(0.,1.,f));    
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution;
    float skale = 10.0;
	st *= skale;
    st.x -= noise(time)*(skale-1.0);
    st.y -= noise(time*1.01+0.3)*(skale);
    vec3 color = vec3(step(0.4,length(st-vec2(0.5)))-step(0.5,length(st-vec2(0.5))));
    
    st = gl_FragCoord.xy/resolution.xy;
    st *= skale;
    st.x -= noise(time*1.11)*(skale-1.0);
    st.y -= noise(time*0.9+0.6)*(skale-1.0);
    color += vec3(step(0.4,length(st-vec2(0.5)))-step(0.5,length(st-vec2(0.5))));

    gl_FragColor = vec4(color,1.0);
}