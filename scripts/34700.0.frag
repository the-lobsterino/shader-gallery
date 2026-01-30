#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float minRadius = 25.0;
float maxRadius = 60.0;
float timeFactor = 125.0;

float timeVal = time * timeFactor;
float sinVal = sin(timeVal);
float sin2Val = sinVal*sinVal;
float sin4Val = sin2Val*sin2Val;
float sin8Val = sin4Val*sin4Val;
float sin16Val = sin8Val*sin8Val;

float currentRadius = sin16Val * (maxRadius - minRadius) + minRadius;

vec3 color = vec3(1.0, 0.0, 0.0);

vec2 dotCenter = vec2(200, 200);

void main( void ) {

if (distance(gl_FragCoord.xy, dotCenter) <= currentRadius) {
 gl_FragColor = vec4(color, 1.0);
}
else {
 discard;
}
}
