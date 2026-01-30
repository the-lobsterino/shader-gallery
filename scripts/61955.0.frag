// 10032020 - Necip's portation
// Original https://www.shadertoy.com/view/tdK3zD


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define iResolution resolution
#define iTime time


float circle(vec2 uv, float rad, float speed, float tOff, float dim, float clockwise){
    vec2 pos = vec2(cos((iTime+tOff)*speed)*rad,
               sin((iTime+tOff)*speed)*rad);
    if (clockwise > 0.) {
    	pos = vec2(sin((iTime+tOff)*speed)*rad,
                   cos((iTime+tOff)*speed)*rad);
    }
    return 1.0-smoothstep(distance(pos, uv)*dim,0.0, 0.095);
}

float circles(vec2 uv){
    float a = circle(uv, 0.2, 4.5, 0.1, 12.2, 0.0);
    float b = circle(uv, 0.4, 3.5, 0.732, 9.2, 1.0);
    float c = circle(uv, 0.6, 2.5, 0.437, 5.2, 0.0);
    float d = circle(uv, 0.9, 1.5, 0.333, 3.2, 1.0);

    return a+b+c+d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 st = fragCoord.xy / iResolution.xy;
	float mag_time = iTime * 0.4;
	float rx = st.x *= (0.99 + (sin(mag_time) * 0.02));
	float ry = st.y *= (0.99 + (cos(mag_time+0.3) * 0.02));
    
	vec4 old = texture2D(backbuffer, vec2(rx,ry));    
	old*= 0.96;

    	vec2 uv =  (2. * fragCoord.xy - iResolution.xy ) / iResolution.y;
    	vec4 new = vec4(vec3(circles(uv)), 1.0);
 
	fragColor = new+old;   
}



void main( void ) {
	mainImage( gl_FragColor, gl_FragCoord.xy );
}
