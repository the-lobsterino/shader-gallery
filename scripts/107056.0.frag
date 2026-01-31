#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.2831853

uniform vec2 resolution;
uniform float time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 centre){
    vec3 rgb = clamp(
    abs(mod(centre.x*6.0+vec3(0.0, 4.0, 2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return centre.z * mix(vec3(1.0), rgb, centre.y);
}

void main(){

    vec2 st = gl_FragCoord.xy/resolution;

    // relative coords of pos from le centre
    vec2 toCenter = vec2(0.5,6)-st;

    // angle from le centre
    float angle = atan(toCenter.y, toCenter.x);

    // distance from le centre
    float radius = length(toCenter);

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    vec3 color = hsb2rgb(vec3((angle/TWO_PI)+0.5, 1.0, 1.0));

    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);

    float selected = mod(time * .5, 1.0);
    float ang = abs(angle - ((0.5 - selected) * TWO_PI));
	
    if (ang < 0.033){
        gl_FragColor = vec4(color = (color.xyz - (1.0 - vec3(ang * 1.0 / 0.033))),1.0);
    }
    if (ang < 0.01){
        gl_FragColor = vec4(color = vec3(1.0),1.0);
    }

    float dist = toCenter.x * toCenter.x + toCenter.y * toCenter.y;

    if (dist > .25) {
        gl_FragColor = vec4(color, 1.0 - ((dist - .25) / .01));
    }

    if (dist < (1.0 - (1.0/3.0)) * .25) {
	float inner = (1.0 - (1.0/3.0)) * .25;
        gl_FragColor = vec4(color, 1.0 - (inner - dist) / .01);
	
    }


}
