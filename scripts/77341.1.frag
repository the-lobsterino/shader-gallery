/*
 * Original shader from: https://www.shadertoy.com/view/ftV3D1
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Author @patriciogv - 2015 - FBM function
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.,78.)))*
        4.);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(8.0, 1.0));
    float c = random(i + vec2(8.0, 1.0));
    float d = random(i + vec2(8.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float box (in vec2 _size, in vec2 _uv){
    _size = vec2(.5) - _size*.5;
    vec2 st = smoothstep (_size, _size+vec2(0.24), _uv);
    st *= smoothstep (_size, _size+vec2(0.24),vec2(1.0)-_uv);
    float box = st.x * st.y;
	return box;
}


#define NUM_OCTAVES 10

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.55;
    vec2 shift = vec2(10.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.001 * iTime), tan(0.005),
                    -sin(0.005), cos(0.0001 * iTime));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    vec2 uva = vec2(fbm(uv));
    float grid = sin(uva.x * 100.) * sin(uva.y * 500.);
    grid = step(.995,grid);

    vec3 color = vec3(0.0);
    vec2 q = vec2(0.);
    q.x = fbm( uv + 0.110*(iTime+100.));
    q.y = fbm( uv + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( uv + 20.0*q + vec2(1.7,9.2)+ 0.15*(iTime+100.));
    r.y = fbm( uv + 10.0*q + vec2(8.3,2.8)+ 0.126*(iTime+100.));

    float f = fbm(uv+r*r);
    
    color = vec3(grid) * 0.25;

    color -= mix(vec3(0.801961 * abs(cos(iTime * .3)),0.619608 * abs(cos(iTime * .5)),0.666667),
                vec3(0.966667 * abs(sin(iTime * .4)),0.966667 * abs(cos(iTime * .2)),0.998039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.966667,1,1),
                clamp(length(r.x),0.0,1.0));
                
    color /= box(vec2(.2  * abs(sin(iTime * .3)) + .5,1.), uv - vec2(.395, 0.)) * vec3(.7,1.,1.) + 
             box(vec2(.2  * abs(sin(iTime * .2)) + .5,1.), uv + vec2(.2, 0.)) * vec3(1.,.8,.9) +
             box(vec2(.2 * abs(sin(iTime * .1)) + .5,1.), uv - vec2(.98, 0.))  * vec3(1.,1.,1.);

    // Output to screen
    fragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}