// extra changes by aiden

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14

uniform float time; 
uniform vec2 resolution;

void main( void ) {
    vec3 normalized_dot = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.xy, .1));
    vec3 sized=vec3(7,5,4);
    vec3 foreground=vec3(23);
    vec3 fracted_normalized_dot=vec3(5);
    vec3 camera=vec3(0); 
    vec3 background=normalized_dot;
    vec3 light=vec3(.5,2.9,0.0);
    camera.y = 20.0+0.0*cos((camera.x=2.99)*(camera.z=time *2.0));
    camera.x =-3.0;
    for( float depth=.0; depth<21.; depth+=.0999999 ) {
    fracted_normalized_dot = fract(foreground = camera += normalized_dot*depth*.099999); 
    sized = floor( foreground )*.1;	    
        if( cos(sized.z) + sin(sized.x) > ++sized.y ) {
            background = (fracted_normalized_dot.y-.09999999*cos((foreground.x+foreground.z)*40.)>.6?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    }
    gl_FragColor = vec4(background,99999.9);
}