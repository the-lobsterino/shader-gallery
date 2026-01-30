#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 smin( vec3 a, vec3 b, float k )
{
    vec3 h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 brickTile(vec2 _st){
    if (fract(_st.y * 0.5) > 0.5){
        _st.x += 0.5;
    }
    return fract(_st);
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
	_st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
	_st += 0.5;
    return _st;
}

vec2 mirrorTile(vec2 _st){
    if (fract(_st.y * 0.5) > 0.5){
        _st.x = _st.x+0.5;
        _st.y = 1.0-_st.y;
    }
    return fract(_st);
}

float rows = 3.;
float sides = 5.;
float points = 3.;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st = mirrorTile(st * rows);

	float angle = 0.;
	if (fract( (gl_FragCoord.y/u_resolution.y) * 0.5 * rows) > 0.5){
        angle *= -1.0;
    }

	st = rotate2D(st,angle);
    st = st * 2. - 1.;

    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI + 1.0*u_time;
    float r = TWO_PI/float(sides);

    // Shaping function that modulate the distance
    float d = cos(floor(.5+a/r)*r-a)*length(st);
    float k_shape = smoothstep(.0, .5, d) * (1. - smoothstep(.5, 1., d)) * length(st);
    float k_edge = smoothstep(.56, .57, d) * (1. - smoothstep(.57, .58, d));
    vec3 k_offset = vec3(-.3, 0., .3);
    vec3 k_angle = smoothstep(0.5, 1.0, sin(points*a - 6.*u_time + k_offset));
    vec3 k = smin(vec3(k_shape), k_angle, 2.0);

    vec3 color = smoothstep(0.2, 0.3, k);

    gl_FragColor = vec4(color,1.0);
}