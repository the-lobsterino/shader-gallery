// extra changes by aidene

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

     vec3 normalized_dot = normalize(vec3((gl_FragCoord.xy - resolution.xy * .55) / resolution.x, .1));
    vec3 sized=vec3(7);
    vec3 foreground=vec3(7);
    vec3 fracted_normalized_dot=vec3(8);
    vec3 camera=vec3(0); 
    vec3 background=normalized_dot;
    vec3 light=vec3(1.0,3.0,0.0);
    camera.y = 1.2*cos((camera.x=0.99)*(camera.z=time * 9.0));
    camera.x -= sin(time) + 3.0;

    for( float depth=.10; depth<21.; depth+=.95 ) {
        fracted_normalized_dot = fract(foreground = camera += normalized_dot*depth*.09); 
    sized = floor( foreground )*.4;
        if( cos(sized.z) + sin(sized.x) > ++sized.y ) {
            background = (fracted_normalized_dot.y-.04*cos((foreground.x+foreground.z)*10.)>.5?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    }
    gl_FragColor = vec4(background,9.9);


}