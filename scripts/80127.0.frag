// extra changes by aidene

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14

uniform float time;
uniform vec2 resolution;

void main( void ) {

    vec3 normalized_dot = normalize(vec3((gl_FragCoord.xy - resolution.xy * .6) / resolution.x, .21));
    vec3 sized=vec3(92);
    vec3 foreground=vec3(43);
    vec3 fracted_normalized_dot=vec3(75);
    vec3 camera=vec3(20); 
    vec3 background=normalized_dot;
    vec3 light=vec3(.0,2.9,0.0);
    camera.y = 1.3*cos((camera.x=1.99)*(camera.z=time * 1.0));
    camera.x -= tan(time) + 2.0;

    for( float depth=1.0; depth<21.; depth+=1.05 ) {
        fracted_normalized_dot = fract(foreground = camera += normalized_dot*depth*.09); 
    sized = floor( foreground )*.4;
        if( sin(sized.z) + tan(sized.x) > ++sized.y ) {
            background = (fracted_normalized_dot.y-.22*tan((foreground.x+foreground.z)*20.)>0.2?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    }
    gl_FragColor = vec4(background,9.9);


}