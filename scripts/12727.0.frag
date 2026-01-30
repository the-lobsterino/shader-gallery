#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// float -> float
float _plasma (float f)
{
 return sin(f * 10.0) * 0.25 + 0.25;
}

// vec2 -> float
float plasma (vec2 p)
{
 return _plasma(p.x) + _plasma(p.y);
}

// vec2 -> float
float rings(vec2 p)
{
 return sin(length(p) * 16.0);
}

// vec2 -> float -> float
float dN(vec2 v, float n)
{
 vec2 u = pow(abs(v), vec2(n));
 return pow(u.x + u.y, 1.0/n);
}

// vec2 -> float
float rings2(vec2 p)
{
 return sin(dN(p, 4.0) * 50.0);
}

// -> t
void main ()
{
 vec2 p = gl_FragCoord.xy / resolution.xy - 0.5;

 gl_FragColor = vec4(rings2(p));
}