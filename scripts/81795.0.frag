// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(){
    vec2 st = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y;
    vec3 color = vec3(4.0);

    vec2 pos = vec2(0.0)-st;

    float r = length(pos)*2.0;
    float a = (pos.y,pos.x) + (time / TWO_PI) * TWO_PI;

    float f = tan(a*5.);
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    color = vec3( 1.-step(f+0.01,r) * 6.-circle(pos, .0) );

    gl_FragColor = vec4(color, 4.0);
}
