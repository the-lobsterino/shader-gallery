// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 voronoi(in vec2 st, float scale){
    vec3 color = vec3(0.);
    
    vec2 i_st = floor(st/scale);
    vec2 f_st = fract(st/scale);

    float m_dist = 1.000;// minimum distance
	vec2 m_point;//minimum point
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x),float(y));// Neighbor place in the grid
            vec2 point = random2(i_st + neighbor);// Random position from current + neighbor place in the grid
            point = 0.5 + 0.5*sin(time + 6.2831*point);// Animate the point
            vec2 diff = neighbor + point - f_st;// Vector between the pixel and the point
            float dist = length(diff);// Distance to the point
            
            if(dist<m_dist){
                m_dist = min(m_dist, dist);
                m_point = point;
            }
        }
    }

    // Assign a color using the closest point position
    color += dot(m_point, vec2(.3,.6));

    return color;
}

void main() {
    vec2 st = surfacePosition;//gl_FragCoord.xy/resolution.xy;
//    st.x *= resolution.x/resolution.y;
	st*=100.;
    vec3 color = vec3(0.);
    color = voronoi(st,1.);

    gl_FragColor = vec4(color,1.0);
}