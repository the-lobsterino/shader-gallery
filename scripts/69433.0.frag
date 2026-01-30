#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/resolution.y;

    float expand_speed = 5.;
    float expand_size = 10.;
    float rotation_radius = 2.5;
    float rotation_speed = 2.;
    
    
    float rotation_time = time*rotation_speed;
    vec2 d_point = vec2(cos(rotation_time), sin(rotation_time))*rotation_radius;
    float dist = distance(uv*expand_size, d_point) - (expand_size*time);
    float a = sin(time)+2.;
    vec3 col = vec3(sin(dist)/a+1./a);

    gl_FragColor = vec4( col, 1.0 );

}