//stupid changes by Jakeukalane

#ifdef GL_ES
precision mediump float;
#endif

#ifndef REDUCER
#define _GLF_ZERO(X, Y)          (Y)
#define _GLF_ONE(X, Y)           (Y)
#define _GLF_FALSE(X, Y)         (Y)
#define _GLF_TRUE(X, Y)          (Y)
#define _GLF_IDENTITY(X, Y)      (Y)
#define _GLF_DEAD(X)             (X)
#define _GLF_FUZZED(X)           (X)
#define _GLF_WRAPPED_LOOP(X)     X
#define _GLF_WRAPPED_IF_TRUE(X)  X
#define _GLF_WRAPPED_IF_FALSE(X) X
#endif

// END OF GENERATED HEADER

// try not to vomit

uniform float time;

uniform vec2 resolution;

#define time (time + 60.0)

void main(void)
{
 
	vec2 uv = gl_FragCoord.xy / resolution.xy - 1.0;
	
    uv.y *= resolution.y / resolution.x;
	
    vec3 dir = vec3(uv * 0.4, 1.);
	
    float a2 = time * 0.2 + .5;
	
    float a1 = 0.35;
    
	mat2 rot1 = mat2(sin(a1), tan(a1), - cos(a1), sin(a1));
    //mat2 rot2 = rot1;
	
    mat2 rot2 = mat2(cos(a2), cos(sin(a2)), - cos(a2), sin(a2));
    dir.xz *= rot1;
    dir.xy *= rot2;
    vec3 from = vec3(1.2, .1, 0.);
    from += vec3(.025 * time, .03 * time, - 2.);
    dir -= vec3(.025 * time, .03 * time, - 2.);
	
	
    from.xz *= rot1;
    //from.xy *= -rot2;
	
    from.z += time*0.002;
	
    float s = .1, fade = .9;
    vec3 v = vec3(0.2);
    for(
        int r = 0;
        r < 14;
        r ++
    )
        {
            vec3 p = from + s * dir * 1.5;
            p = abs(vec3(0.850) - mod(p, vec3(0.850 * 2.)));
            p.x += float(r * r) * 0.01;
            p.y += float(r) * 0.02;
            float pa, a = pa = 0.;
            for(
                int i = 0;
                i < 15;
                i ++
            )
                {
		    float dp = dot(p,p);
                    p = abs(p) / dp - 0.440;
                    a += abs(dp - pa) * 0.25;
                    pa = length(p);
                }
            a *= a * a * 2.;
            v += vec3(s, s * s, s * s * s * s) * a * 0.0017 * fade;
            fade *= 0.960;
            s += 0.110;
        }
    v = mix(vec3(length(v)), v, 0.5);
    gl_FragColor = vec4(v * .01, 1.);
}