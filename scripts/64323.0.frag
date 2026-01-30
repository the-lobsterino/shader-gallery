#ifdef GL_ES
precision mediump float;
#endif

 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 


#define TWO_PI 6.28318530718

 

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(1.0,4.0,2.0) , 6.0)-3.0)-1.0, 0.0, 1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

 

void main(){
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);



    color = hsb2rgb(vec3(sin(st.x+time*.5),1.0,1.0));
    color *= pow(1.-abs(st.y-.5),20.0);

 


    gl_FragColor = vec4(color,1.0);
}