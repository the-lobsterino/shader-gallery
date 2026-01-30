#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}
float circle(vec2 s, float rad) {
    // This calculation will make an oval at full screen size,
    // so I'm cheating and making the canvas a perfect square.
    vec2 dist = s - vec2(0.5);
    return 1.0 - smoothstep(rad - (rad * 0.01), rad + (rad * 0.01), dot(dist, dist) * 8.0);
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
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,1.0,1.0));

    // Create the inner and outer circles.
    vec3 outerCircle = vec3(circle(st, 2.0));
    vec3 innerCircle = vec3(circle(st, 1.5));
	
    color = outerCircle * color - innerCircle;
	
    gl_FragColor = vec4(color,1.0);
}