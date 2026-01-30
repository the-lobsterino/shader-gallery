#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 polygon(vec2 st, int n){
    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(n);

    // Shaping function that modulate the distance
    float d = cos(floor(.5+a/r)*r-a)*length(st);
    return vec3(1.0-smoothstep(.38,.42,d));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

void draw_corner(out vec3 color, in vec2 st){
    float sc = .5;

    // center stuff
    st += .5;
    st = scale(vec2(2, 2)) * st;

    // put cross in down left corner
    st -= .5;
    color += cross(st, 1.);
    st += .5;

    // prep for polygon drawing
    st = scale(vec2(.5, .5)) * st;
    st = st*2.-1.;

    // scale, translate, rotate, draw square
    st = scale(vec2(2, 2)) * st;
    st -= vec2(.75, .0);
    st = rotate2d(-PI/4.) * st;
    color += polygon(st, 4);

    // prep and draw other square
    st = rotate2d(PI/4.) * st;
    st -= vec2(-.75, .75);
    st = rotate2d(-PI/4.) * st;
    color += polygon(st, 4);
}

vec3 switch_color(in vec3 original_color, in vec3 target_color, float threshold)
{
    // use distance to know how far current color is from target
    // smoothstep to make transition between the two colors
    // using threshold as arg for smoothstep
    // OR just use step to make an if like thing : if > threshold then = target
    return vec3(0.0);
}

void corners_pattern(in vec2 st, out vec3 color)
{
    draw_corner(color, st);

    st += vec2(0., -1);
    st = rotate2d(-PI/2.) * st;
    draw_corner(color, st);
    st = rotate2d(PI/2.) * st;

    st += vec2(-1, 0.);
    st = rotate2d(PI) * st;
    draw_corner(color, st);
    st = rotate2d(PI) * st;

    st += vec2(0., 1.);
    st = rotate2d(PI/2.) * st;
    draw_corner(color, st);
}

#define GRIDRES 5.

void main(){
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    vec3 color = vec3(0.0);

    // st = scale(vec2(2.)) * st;
    st *= GRIDRES;
    vec2 quadrant = vec2(floor(st));
    st.x += (step(1., mod(st.y,2.0)) *  0.5 * time) * step(1., mod(.5*time, 2.));
    st.x += (step(1., mod(st.y + 1.,2.0)) *  -.5 * time) * step(1., mod(.5*time, 2.));
    st.y += (step(1., mod(st.x,2.0)) *  0.5 * time) * step(1., mod(.5*time + 1., 2.));
    st.y += (step(1., mod(st.x + 1.,2.0)) *  -.5 * time) * step(1., mod(.5*time + 1., 2.));
    // st.y += step(1., mod(st.x + 1., 2.0)) * .5 * time;
    st = fract(st);
    color = vec3(1./GRIDRES * quadrant, .0);

    corners_pattern(st, color);

    color += cross(st, .5);

    // color += cross(st, .1) * vec3(1., -1., -1.);
    // color += vec3((st), 0);

    gl_FragColor = vec4(color,1.0);
}