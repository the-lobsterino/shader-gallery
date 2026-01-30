// extra changes by aidene

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

     vec3 normalized_dot = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .1));
    vec3 sized=vec3(0);
    vec3 foreground=vec3(0);
    vec3 fracted_normalized_dot=vec3(0);
    vec3 camera=vec3(0); 
    vec3 background=normalized_dot;
    vec3 light=vec3(1.0,3.0,0.0);
    camera.y = 5.1*cos((camera.x=0.3)*(camera.z=time * 5.0));
    camera.x -= sin(time) +15.0;

    for( float depth=.0; depth<11.; depth+=.05 ) {
        fracted_normalized_dot = fract(foreground = camera += normalized_dot*depth*.251); 
    sized = floor( foreground )*.1;
        if( cos(sized.z) + sin(sized.x) > ++sized.y ) {
            background = (fracted_normalized_dot.y-.03*cos((foreground.x+foreground.z)*15.)>.7?light:fracted_normalized_dot.x*light.yxz) / depth;
            break;
        }
    }
    gl_FragColor = vec4(background,213.35);


}