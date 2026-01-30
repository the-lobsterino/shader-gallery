#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif


uniform float time;

uniform vec2 resolution;


void main( void )
{
float battery = 1.0;
vec2 pos = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;

vec3 finalColor = vec3(1.0 - battery, 0.3, battery);

finalColor *= abs(1.0 / (sin(pos.y + sin(pos.x + time) * battery) * 30.0));
gl_FragColor = vec4(finalColor, 1.0 );
}