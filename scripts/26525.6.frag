#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 resolution;
uniform float time;

//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(1.0*atan(time)-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);

    float bwidth = 0.02000003;
    float left = step(bwidth, st.x);
    float bottom = step(bwidth, st.y);
    float top = step(bwidth, 1.0 - st.y);
    float right = step(bwidth, 1.0 - st.x);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5) - st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 4.0;
  
    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(left * bottom * top * right * vec3((sin(angle)/TWO_PI/2.) + 0.2 * sin(time) * 1.5, radius, 60.0));

    gl_FragColor = vec4(color,1.0);
}