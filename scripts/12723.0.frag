#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// float -> float
float _plasma (float f)
{
 return sin(f * 40.0) * 0.25 + 0.25;
}

// vec2 -> float
float plasma (vec2 p)
{
 return _plasma(p.x) + _plasma(p.y);
}

// -> t
void main () {
 vec2 p = (gl_FragCoord.xy / resolution.xy);

 gl_FragColor = vec4(plasma(p));
 // gl_FragColor = vec4(p, 0.0, 1.0);
}