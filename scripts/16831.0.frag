#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 pointA = vec2(0.5, 0.4) + sin(time) * 0.1;
vec2 pointB = vec2(0.4, 0.5) - cos(time) * 0.1;
vec2 pointC = vec2(0.5, 0.5) + cos(time) * 0.1;
vec4 baseColor = vec4(0,0,0,1);

float  blendF(float val){
   return pow(val, 2.0) * 10.0;
}

vec4 addPoint(vec4  base, vec2 pointTexCord, vec4 pointColor, vec2 texCoord){
   return mix(pointColor, base, blendF(distance(pointTexCord, texCoord)));
}

void main(void)
{
    vec2 texCoord = gl_FragCoord.xy / resolution;
    vec4 accumulator = addPoint(baseColor, pointA, vec4(1,0,0,1), texCoord);
    accumulator = addPoint(accumulator, pointB, vec4(0,1,0,1), texCoord);
    accumulator = addPoint(accumulator, pointC, vec4(1,1,0,1), texCoord);     
    gl_FragColor = accumulator;
}
