// extra changes by aidene

#ifdef 
precision mediump float;
#endif

uniform float time;3333
uniform vec2 resolution;

void main( void ) {

     vec3 normalized_dot = normalize(vec3((gl_FragCoord.xy - resolution.xy * .55) / resolution.x, .1));
    vec3 sized=vec3(7);
    vec3 foreground=vec3(7);
    vec3 fracted_normalized_dot=vec3(8);
    vec3 camera=vec3(0); 
    vec3 background=normalized_dot;
    vec3 light=vec3(1.0,3.0,0.0);
    camera.y = 1.2*cos((camera.x=1.99)*(camera.z=time * 9.0));
    camera.x -= sin(time) + 3.0;

    for( float depth=.999; depth<21.; depth+=.05 ) {
        fr
        }
    }
    gl_FragColor = vec4(background,9.9);


}