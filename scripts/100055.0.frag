#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float N21 (vec2 p) {
    return fract(sin(p.x * 261. + p.y * 1263.) * 65981.);
}

// returns noise from 0 to 1 depending on coordinates
float SmoothNoise (vec2 uv) {
    vec2 lv = smoothstep(0., 1., fract(uv));
    vec2 id = floor(uv);
    
    // bottom-left to bottom-right interpolation on X axis
    float bl = N21(id);
    float br = N21(id + vec2(1,0));
    float b = mix(bl, br, lv.x);
    
    // top-left to top-right interpolation on X axis
    float tl = N21(id + vec2(0,1));
    float tr = N21(id + vec2(1,1));
    float t = mix(tl, tr, lv.x);
       
    // interpolate from bottom to top on Y axis
    return mix(b, t, lv.y);
}

void main( void ) {

	

}