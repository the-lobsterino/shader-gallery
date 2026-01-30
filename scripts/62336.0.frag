// "soft-min" test
// thanks to: http://media.lolrus.mediamolecule.com/AlexEvans_SIGGRAPH-2015-sml.pdf

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float soft_min(float a, float b, float r)
{
    float e = max(r - abs(a - b), 0.0);
    return min(a, b) - e*e*0.25 / r;
}
void main(){
	vec2 p = ( 2.0 * (gl_FragCoord.xy-vec2(mod(10.8*120.*8./2.,resolution.x*1.5)-resolution.x/2.,resolution.y/2.))) / min(resolution.x, resolution.y);
  	gl_FragColor = vec4(p, 0.1, 1.0);
}