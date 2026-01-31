// HAIRY CUNT HOLE
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float map(vec3 p)
{
    vec3 q = fract(p) * 2.0 - 1.0;
    //return length(q) - 0.1;
    return sdBox(q, vec3(0.25));
}

float trace(vec3 o, vec3 r)
{
    float t = 0.0;
    for (int i = 0; i < 32; ++i)
    {
        vec3 p = o + r * t;
        float d = map(p);
        t += d * 0.5;
    }
    return t;
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    uv = uv * 2.0 - 1.0;
    
    uv.x *= resolution.x / resolution.y;
    
    float depth = 2.0;
    vec3 r = normalize(vec3(uv, depth));
    float the = time * 0.25;  // Parameter for rotation
	
    r.xz *= mat2(cos(the), -sin(the), sin(the), cos(the));  // Rotation matrix for 3d space
    vec3 o = vec3(0.0, 0.25 * time, -0.5 * time);  // Movement in 3d space

    float st = (sin(time) + 1.5) * 0.4; // blur in and out

    float t = trace(o, r * st);
    
    float fog = 1.0 / (1.0 + t * t * 0.1);
    
    vec3 fc = vec3(fog * 2.0);  // glow intensity

	
    vec3 tint = vec3(st * 0.5,st,st + 0.0); // glow color 
    gl_FragColor = vec4(fc * tint, 1.0);
}