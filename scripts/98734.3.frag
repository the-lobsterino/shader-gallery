#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}



#define OCTAVES 7
float fbm(in vec2 st) {
    float value = 0.;
    float amplitude = 0.5;
    vec2 shift = vec2(1.);
    mat2 rot = mat2(cos(0.1), sin(0.1),
                -sin(0.1), cos(0.1));

    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        // st = rotate2d(1.)*st * 2. + shift;
        st = rot*st * 2.4 + shift;

        amplitude *= 0.520;
    }
    return value;
}


void main( void ) {

    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;
    st.x+=time*0.01;
	vec2 q = vec2(0.);
    q.x = fbm(st+sin(time * 0.01));
    q.y = fbm(st+cos(time * 0.01));
	vec3 color = vec3(0.0);
	color += vec3(q.x, q.y, 0.);


    vec2 r = vec2(0.);
    r.x = fbm(st+q.y+vec2(0.)+0.01);
    r.y = fbm(st+q.x+vec2(0.)+vec2(.04,0.7)+0.08);
  //  r.x = fbm(st+q+time*0.05);
  //  r.y = fbm(st+q+vec2(1.4,10.7)+time*0.08);	
 color += vec3(r.x, r.y, 0.);

  float f = fbm(st+r);
	color = vec3(0.);
    color += vec3(f,0.,0.);
  	
    color = mix(vec3(0.026, 0.0255, 0.4078),
                vec3(0.1255, 0.784, 0.9078),
                clamp((f*f)*1.0,0.09,1.));
color = mix(color,
                vec3(0.0157, 0.3294, 0.8667),
                clamp(length(q),0.0,1.0));	
    color = mix(color,
                vec3(0.9529, 0.9529, 0.9255),
                clamp(length(r.x),0.0,1.0));		
	
    gl_FragColor = vec4(color,1);


}