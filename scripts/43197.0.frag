#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Spiral Hypnosis
	
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = (2.*fragCoord - resolution.xy ) / resolution.x;
  vec2 vu = uv;
  float t = time * 4.0;
    uv = abs(mod(uv*16.0,1.0)) - 0.5;
    uv *= mat2(cos(t),sin(t),-sin(t),cos(t)); // image rotation
    t *= 0.25;
    vu *= mat2(cos(t),sin(t),-sin(t),cos(t));


    float theta = (atan(uv.y,uv.x)) / 6.28;
    float spirals = 2.;
    float value = (sin(fract(atan(uv.y, uv.x) / 6.28 + length(uv) * 2. * spirals)*6.28)+1.) * 0.5;
    value += (sin(fract(atan(vu.y, vu.x) / 6.28 + length(vu) * 2. * spirals)*6.28)+1.) * 0.2;
    fragColor = vec4(value);
}

void main( void )   
{
  mainImage(gl_FragColor, gl_FragCoord.xy );   
}
