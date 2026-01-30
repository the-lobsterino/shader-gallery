#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 resolution;
uniform float time;

vec3 hsb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = st-vec2(0.5);
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb(vec3(fract((angle/TWO_PI)+0.5+pow(2.,2.*sin(time))),radius,1.0));
	color=step(radius,1.)*color;
    gl_FragColor = vec4(color,1.0);
}