// 110720N	Mandel Bubbels

#define t u_time

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float u_time;


vec2 setupSpace(in vec2 f, in vec2 res)
{
    return
    (f.xy / res.xy - 0.5) *
    vec2(res.x / res.y, 1.0) * 2.0; 
}

void main()
{
    float t = time;

    vec2 uv = setupSpace(gl_FragCoord.xy, resolution) / 1.;
	
    float r = -t*0.1;
    uv *= mat2(cos(r), -sin(r), sin(r), cos(r));
    float a = atan(uv.x, uv.y);
    uv.x += 0.3352;
    uv.y += 0.4006;
    
    vec2 p = uv;
    vec2 c = p;
    
    vec3 color = vec3(0.0, 0.0, 0.0);
    for(float i = 0.; i < 300.00; i ++ ) {
        
	 p = vec2(p.x * p.x - p.y * p.y, 2. * p.x * p.y) + c;
	    p /= dot(p*.1,p*2.);
	    
	    
        if (dot(p, p) > 10. + abs(sin(t*1.)*0.5)) {
            // float colorRegulator = float(i); // float(i - 1.) - log(((log(dot(p, p))) )) / log(2.0);
            // color = vec3(colorRegulator, 1.47,  (1.0 + sin(uv.y+t*5. + 0.50 * colorRegulator)));
		// color = vec3(float(i), 1.47, sin(uv.y+t*1.) - log(((log(dot(p, p))) )) / log(2.0)); 
		color = vec3(1. , 1.4, sin(uv.y) - log(((log(dot(p, p))) )) / log(2.0)); 
            break;
        }
    }
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 m = abs(fract(color.xxx + K.xyz) * 6.0 - K.www);
    gl_FragColor.rgb = color.z * mix(K.xxx, clamp(m - K.xxx, 0.0, 1.0), color.y);
    
    gl_FragColor.a = 1.0;
}