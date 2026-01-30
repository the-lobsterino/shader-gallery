#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 resolution;
uniform float time;

//  Function from IÃ±igo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*8.0+vec3(0.0,6.0,2.0),
                             8.0)-3.0)-2.0,
                     0.0,
                     1.0);
    rgb = rgb;
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius

	color += hsb2rgb(vec3((angle * time),1.0,0.5));
	color += hsb2rgb(vec3((angle/TWO_PI * 0.5),1.0,0.5));
	
    gl_FragColor = vec4(color,1.0);
}
